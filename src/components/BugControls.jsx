import React, { use, useEffect, useRef } from "react";
import '../plot-style.css';
import worm from '../assets/worm.png';
import wormAnim from '../assets/worm-anim.png';


const BugControls = () => {
    
    const bugSprites = [
        [worm, wormAnim]
    ];
    const bug = useRef(null);
    
    useEffect(() => {
        
    const bugElement = bug.current;
    const bugContainer = document.getElementById('bug-control-container');
    let animator = 0;
    if (!bugElement || !bugContainer) return;
    
    let lastX = 0;
    let lastY = 0;

    const currBug = document.getElementById('bug');
    let bugAnimation = null;
    let stopTimer = null;
    
    function animateBug() {
        if (bugAnimation) return;

        bugAnimation = currBug.animate([
            { transform: 'translate3d(0px,0,0)' },
            { transform: 'translate3d(-100%,0,0)' }
        ], {
            duration: 600,
            iterations: Infinity,
            easing: 'steps(4)'
        });
    }

    const handleMouseMove = (event) => {
        const rect = bugContainer.getBoundingClientRect();
        const { width, height } = bugElement.getBoundingClientRect();

        let x = event.clientX - width / 2 - rect.left;
        let y = event.clientY - height / 2 - rect.top;

        x = Math.max(0, Math.min(x, rect.width - width));
        y = Math.max(0, Math.min(y, rect.height - height));

        lastX = bugElement.style.left = `${x}px`;
        lastY = bugElement.style.top = `${y}px`;
        
        animateBug();
        clearTimeout(stopTimer);
        stopTimer = setTimeout(() => {
        if (bugAnimation) {
            bugAnimation.cancel();
            bugAnimation = null;
        }
        }, 120);

    };

    document.addEventListener('mousemove', handleMouseMove);
    

    return () => {
        document.removeEventListener('mousemove', handleMouseMove);
    };
    }, []);
  
    
    return (
        <div ref={bug} id='bug-container'
            style={{
                position: "absolute",
                pointerEvents: "none",
                userSelect: "none",
                width: "39px",
                height: "33px",
                overflow: "hidden",
            }}>
          <img id="bug" src={worm} alt="bug" 
          style={{
            

          }}/>
        </div>
    );
};

export default BugControls;