import React, { useEffect, useRef } from "react";
import "../css/plot-style.css";
import worm from "../assets/worm.png";
import { bugs } from "../data/bugs.js";

const BugSpotlight = ({ isBugDisplay }) => {
  const bug = useRef(null);
  const spritesheet = useRef(null);

  useEffect(() => {
    const bugElement = bug.current;
    const currBug = spritesheet.current;
    const bugContainer = document.getElementById("bug-control-container");

    if (!bugElement || !currBug || !bugContainer) return;

    let bugAnimation = null;
    let stopTimer = null;
    let lastPoint = { x: null, y: null };

    function animateBug(direction) {
      if (!currBug) return;


      if (direction === "right") {
        currBug.style.top = "-42px";
      } else if (direction === "left") {
        currBug.style.top = "0px";
      }
      

      if (bugAnimation) return;

      bugAnimation = currBug.animate(
        [
          { transform: "translate3d(0px, 0, 0)" },
          { transform: "translate3d(-100%, 0, 0)" },
        ],
        {
          duration: 600,
          iterations: Infinity,
          easing: "steps(4)",
        }
      );
    }

    const handleMouseMove = (event) => {
     
      const rect = bugContainer.getBoundingClientRect();
      const { width, height } = bugElement.getBoundingClientRect();

      let x = event.clientX - width / 2 - rect.left;
      let y = event.clientY - height / 2 - rect.top;

      x = Math.max(0, Math.min(x, rect.width - width));
      y = Math.max(0, Math.min(y, rect.height - height));

      if (!isBugDisplay) {
        bugElement.style.left = `${x}px`;
        bugElement.style.top = `${y}px`;
      }
      

      const leftOrRight =
        lastPoint.x === null
          ? "none"
          : event.clientX > lastPoint.x
          ? "right"
          : event.clientX < lastPoint.x
          ? "left"
          : "none";

      if (leftOrRight !== "none") {
        animateBug(leftOrRight);
      }

      lastPoint.x = event.clientX;
      lastPoint.y = event.clientY;

      clearTimeout(stopTimer);
      stopTimer = setTimeout(() => {
        if (bugAnimation) {
          bugAnimation.cancel();
          bugAnimation = null;
        }
      }, 120);
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (bugAnimation) bugAnimation.cancel();
    };
  }, []);

  return (
    <div
      ref={bug}
      id="bug-container"
      style={{
        position: "absolute",
        pointerEvents: "none",
        userSelect: "none",
        width: "58px",
        height: "46px",
        overflow: "hidden",
        
      }}
    >
      <img
        ref={spritesheet}
        id="bug"
        src={worm}
        alt="bug"
       style={{ position: "absolute", width: "246px", left: "1px" }}
      />
    </div>
  );
};

export default BugSpotlight;
