import React, { useEffect } from "react";
import wingUp from "../assets/flying-birdie-wing-up.png";
import wingDown from "../assets/flying-birdie.png";

const AnimatedBird = ({ flapIntervalMs = 300 }) => {
	useEffect(() => {
		let cancelled = false;
		let currentAnim = null;
		let floatation = null;
		const birdEl = document.getElementById("birdie");
		if (!birdEl) return;

		birdEl.style.willChange = "transform";

		let flapOn = false;

		const imgEl =
			birdEl.tagName === "IMG"
				? birdEl
				: birdEl.querySelector && birdEl.querySelector("img");
		let flapInterval = null;
		if (imgEl) {

			imgEl.src = wingDown;
			flapInterval = setInterval(() => {
				if (cancelled) return;
				imgEl.src = flapOn ? wingDown : wingUp;
				flapOn = !flapOn;
			}, flapIntervalMs);
		}

		const playLoop = async () => {
			while (!cancelled) {
				currentAnim = birdEl.animate(
					[
						{ transform: "translateX(-300px) rotateY(0deg)" },
						{ transform: "translateX(2000px) rotateY(0deg)" },
					],
					{
						duration: 20000,
						easing: "linear",
						iterations: 1,
						fill: "forwards",
					}
				);

				try {
					await currentAnim.finished;
				} catch {

					break;
				}
				if (cancelled) break;

				birdEl.style.transform = "translateX(2000px) rotateY(180deg)";

				void birdEl.offsetWidth;


				currentAnim = birdEl.animate(
					[
						{ transform: "translateX(2000px) rotateY(180deg)" },
						{ transform: "translateX(-300px) rotateY(180deg)" },
					],
					{
						duration: 20000,
						easing: "linear",
						iterations: 1,
						fill: "forwards",
					}
				);


				try {
					await currentAnim.finished;
					
				} catch {
					break;
				}
				if (cancelled) break;


				birdEl.style.transform = "translateX(-300px) rotateY(0deg)";

				await new Promise((res) => requestAnimationFrame(res));
			}
		};

		playLoop();

		return () => {
			cancelled = true;
			if (currentAnim) currentAnim.cancel();
			if (flapInterval) clearInterval(flapInterval);
		};
	}, [flapIntervalMs]);

	return null;
};

export default AnimatedBird;