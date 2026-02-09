import React, { useEffect, useRef, useState } from "react";

const ScrollReveal = ({ children, className = "", direction = "up", delay = 0 }) => {
	const [isVisible, setIsVisible] = useState(false);
	const domRef = useRef();

	useEffect(() => {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
					observer.unobserve(entry.target);
				}
			});
		});

		const current = domRef.current;
		if (current) {
			observer.observe(current);
		}

		return () => {
			if (current) {
				observer.unobserve(current);
			}
		};
	}, []);

	const getDirectionClass = () => {
		switch (direction) {
			case "left":
				return "reveal-left";
			case "right":
				return "reveal-right";
			case "up":
			default:
				return "reveal";
		}
	};

	return (
		<div
			ref={domRef}
			className={`${getDirectionClass()} ${isVisible ? "reveal-visible" : ""} ${className}`}
			style={{ transitionDelay: `${delay}ms` }}>
			{children}
		</div>
	);
};

export default ScrollReveal;
