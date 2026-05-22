import { db } from "../firebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const STORAGE_KEY = "gemini_usage_limits";

export const rateLimiter = {
	getLocalStorage() {
		try {
			const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
			return {
				usage: data.usage || {},
				bypasses: data.bypasses || {},
				blocks: data.blocks || {},
				refinement_counts: data.refinement_counts || {},
			};
		} catch (e) {
			return { usage: {}, bypasses: {}, blocks: {}, refinement_counts: {} };
		}
	},

	setLocalStorage(data) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	},

	async getUserStorage(userId) {
		if (!userId) return null;
		try {
			const userRef = doc(db, "users", userId);
			const userSnap = await getDoc(userRef);
			if (userSnap.exists()) {
				return userSnap.data().limits || { usage: {}, bypasses: {}, blocks: {} };
			}
			return { usage: {}, bypasses: {}, blocks: {} };
		} catch (e) {
			console.error("Error fetching user limits", e);
			return { usage: {}, bypasses: {}, blocks: {} };
		}
	},

	async setUserStorage(userId, limitsData) {
		if (!userId) return;
		try {
			const userRef = doc(db, "users", userId);
			await setDoc(userRef, { limits: limitsData }, { merge: true });
		} catch (e) {
			console.error("Error saving user limits", e);
		}
	},

	async checkLimit(toolName, user) {
		const isAnonymous = !user;
		let data;

		if (isAnonymous) {
			data = this.getLocalStorage();
		} else {
			data = await this.getUserStorage(user.uid);
		}

		// Initialize if empty structure
		if (!data.usage) data.usage = {};
		if (!data.bypasses) data.bypasses = {};
		if (!data.blocks) data.blocks = {};

		const key = toolName; // Simplified key for logged in, or generic for storage

		// 1. Check for Active Block
		const block = data.blocks[key];
		let needsUpdate = false;

		if (block) {
			if (block.expiresAt > Date.now()) {
				return {
					allowed: false,
					hardBlocked: true,
					expiresAt: block.expiresAt,
					message: block.level > 1 ? "Bloqueio temporário de 24h." : "Bloqueio temporário de 1h.",
				};
			} else if (block.active) {
				// Block expired, reset limits
				data.usage[key] = [];
				data.bypasses[key] = 0;
				block.active = false;
				needsUpdate = true;
			}
		}

		// 2. Filter Timestamps (Sliding Window)
		const windowMs = isAnonymous ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000;
		const now = Date.now();

		let timestamps = data.usage[key] || [];
		const initialCount = timestamps.length;
		timestamps = timestamps.filter((ts) => ts > now - windowMs);

		if (timestamps.length !== initialCount) needsUpdate = true;

		data.usage[key] = timestamps;

		if (needsUpdate) {
			if (isAnonymous) this.setLocalStorage(data);
			else await this.setUserStorage(user.uid, data);
		}

		const limit = isAnonymous ? 4 : 7;
		const count = timestamps.length;

		return {
			allowed: count < limit,
			hardBlocked: false,
			remaining: Math.max(0, limit - count),
			remainingBypasses: 4 - (data.bypasses[key] || 0),
			count,
			limit,
			isAnonymous,
		};
	},

	async recordUsage(toolName, user) {
		const isAnonymous = !user;
		let data;

		if (isAnonymous) {
			data = this.getLocalStorage();
		} else {
			data = await this.getUserStorage(user.uid);
		}

		// Initialize
		if (!data.usage) data.usage = {};
		const key = toolName;
		const timestamps = data.usage[key] || [];
		timestamps.push(Date.now());
		data.usage[key] = timestamps;

		if (isAnonymous) this.setLocalStorage(data);
		else await this.setUserStorage(user.uid, data);
	},

	async recordBypass(toolName, user) {
		const isAnonymous = !user;
		let data;

		if (isAnonymous) {
			data = this.getLocalStorage();
		} else {
			data = await this.getUserStorage(user.uid);
		}

		// Initialize
		if (!data.bypasses) data.bypasses = {};
		if (!data.blocks) data.blocks = {};

		const key = toolName;

		// Increment bypass count
		const currentBypasses = (data.bypasses[key] || 0) + 1;
		data.bypasses[key] = currentBypasses;

		// Check if we hit the 3 strikes limit
		if (currentBypasses >= 3) {
			const currentBlock = data.blocks[key] || { level: 0 };
			const duration = currentBlock.level >= 1 ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000;

			data.blocks[key] = {
				expiresAt: Date.now() + duration,
				level: (currentBlock.level || 0) + 1,
				active: true,
			};
		}

		if (isAnonymous) this.setLocalStorage(data);
		else await this.setUserStorage(user.uid, data);
	},

	async resetLimits(user) {
		if (!user) return;
		const emptyLimits = { usage: {}, bypasses: {}, blocks: {} };
		await this.setUserStorage(user.uid, emptyLimits);
	},

	// Refinement counters
	// Note: Refinement count is per specific defense ID in the user session usually,
	// but if we want it persisted per profile, we should modify this too.
	// Assuming defenseId is unique, we can store it in the user limits doc as well.
	async getRefinementCount(defenseId, user) {
		if (!defenseId) return 5;

		// For simplicity, refinement counts are often session-based or local in this app context
		// unless we want strict global enforcement.
		// Let's keep using localStorage for refinement counts as they are less critical
		// or implement similar logic.
		// Requirement said "limits of free tests". Refinement is a feature of the generation.
		// Let's persist it locally for now to avoid complexity, or follow the pattern if requested.
		// The prompt said "limites dos testes grátis". Refinements are post-generation.
		// I will stick to localStorage for refinement counts to minimize Firestore writes for now,
		// unless explicitly asked. The prompt emphasized "testes grátis" (analysis).

		// Actually, let's keep it sync for now as it was, but safety check.
		const data = this.getLocalStorage();
		const counts = data.refinement_counts || {};
		const key = `refinement_${defenseId}`;
		return typeof counts[key] === "number" ? counts[key] : 5;
	},

	decrementRefinementCount(defenseId) {
		if (!defenseId) return;
		const data = this.getLocalStorage();
		const counts = data.refinement_counts || {};
		const key = `refinement_${defenseId}`;
		const current = typeof counts[key] === "number" ? counts[key] : 5;

		counts[key] = Math.max(0, current - 1);
		data.refinement_counts = counts;
		this.setLocalStorage(data);
	},
};
