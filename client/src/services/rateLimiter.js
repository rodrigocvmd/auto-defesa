const STORAGE_KEY = 'gemini_usage_limits';

export const rateLimiter = {
  getStorage() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      // Ensure structure
      return {
        usage: data.usage || {},
        bypasses: data.bypasses || {}, // Track number of bypasses per key
        blocks: data.blocks || {}      // Track active blocks { expiresAt, level }
      };
    } catch (e) {
      return { usage: {}, bypasses: {}, blocks: {} };
    }
  },

  setStorage(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  },

  checkLimit(toolName, isAnonymous) {
    const data = this.getStorage();
    const key = isAnonymous ? `${toolName}_anon` : `${toolName}_user`;
    
    // 1. Check for Active Block
    const block = data.blocks[key];
    if (block) {
        if (block.expiresAt > Date.now()) {
            return { 
                allowed: false, 
                hardBlocked: true, 
                expiresAt: block.expiresAt,
                message: block.level > 1 ? "Bloqueio de 24h por reincidência." : "Bloqueio temporário de 1h."
            };
        } else if (block.active) {
            // Block expired but logic hasn't reset usage yet
            // Requirement: "Passada a 1 hora de bloqueio, são resetados os limites"
            data.usage[key] = [];
            data.bypasses[key] = 0;
            block.active = false; // Mark as inactive/processed
            this.setStorage(data);
        }
    }

    // 2. Filter Timestamps (Sliding Window)
    // Logged In: 1 hour window.
    // Anonymous: 24 hour window (Requirement: "resetar também a cada 24h").
    const windowMs = isAnonymous ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000;
    const now = Date.now();
    
    let timestamps = data.usage[key] || [];
    timestamps = timestamps.filter(ts => ts > now - windowMs);
    
    // Save filtered timestamps
    data.usage[key] = timestamps;
    this.setStorage(data);

    const limit = isAnonymous ? 3 : 6;
    const count = timestamps.length;
    
    // 3. Determine if allowed
    const isAllowed = count < limit;

    return {
      allowed: isAllowed,
      hardBlocked: false,
      remaining: Math.max(0, limit - count),
      remainingBypasses: 3 - (data.bypasses[key] || 0),
      count,
      limit,
      isAnonymous
    };
  },

  recordUsage(toolName, isAnonymous) {
    const data = this.getStorage();
    const key = isAnonymous ? `${toolName}_anon` : `${toolName}_user`;
    const timestamps = data.usage[key] || [];
    timestamps.push(Date.now());
    data.usage[key] = timestamps;
    this.setStorage(data);
  },

  recordBypass(toolName, isAnonymous) {
    const data = this.getStorage();
    const key = isAnonymous ? `${toolName}_anon` : `${toolName}_user`;
    
    // Increment bypass count
    const currentBypasses = (data.bypasses[key] || 0) + 1;
    data.bypasses[key] = currentBypasses;

    // Check if we hit the 3 strikes limit
    if (currentBypasses >= 3) {
        const currentBlock = data.blocks[key] || { level: 0 };
        // Level 0 (First Block) -> 1 Hour
        // Level >= 1 (Repeat) -> 24 Hours
        const duration = currentBlock.level >= 1 ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000;
        
        data.blocks[key] = {
            expiresAt: Date.now() + duration,
            level: (currentBlock.level || 0) + 1,
            active: true
        };
    }
    
    this.setStorage(data);
  },
  
  // Refinement counters (Same as before)
  getRefinementCount(defenseId) {
     if (!defenseId) return 5;
     const data = this.getStorage();
     // We store refinements in 'usage' for simplicity or a separate key?
     // The previous implementation used the root object. Let's keep it compatible or move to 'usage'.
     // To be safe and simple with the new structure, let's put it in a separate 'refinements' object or just root.
     // Let's use root to match previous logic's persistence style implicitly, 
     // BUT my getStorage now returns structured data. I must handle this.
     
     // Let's store refinements in a new 'refinement_counts' object in storage
     const counts = data.refinement_counts || {};
     const key = `refinement_${defenseId}`;
     return typeof counts[key] === 'number' ? counts[key] : 5;
  },

  decrementRefinementCount(defenseId) {
     if (!defenseId) return;
     const data = this.getStorage();
     const counts = data.refinement_counts || {};
     const key = `refinement_${defenseId}`;
     const current = typeof counts[key] === 'number' ? counts[key] : 5;
     
     counts[key] = Math.max(0, current - 1);
     data.refinement_counts = counts;
     this.setStorage(data);
  }
};