import React, { useState, useEffect, useRef } from 'react';
import AnimatedTitle from './AnimatedTitle';
import ThemeToggle from './ThemeToggle';
import PlotsGrid from './PlotsGrid';
import sunImg from '../assets/sun.png';
import moonImg from '../assets/moon.png';
import cloudImg from '../assets/cloud.png';
import Grass from './Grass';

const Menu = ({ onStart, dark, setDark }) => {
  const [showPlots, setShowPlots] = useState(false);
  const cloudRefs = useRef([]);
  const sunRef = useRef(null);
  const moonRef = useRef(null);

  useEffect(() => {
    // basic cloud animation using Web Animations API
    const refs = cloudRefs.current || [];
    refs.forEach((el, index) => {
      if (!el) return;
      const opposite = index % 2 === 0 ? 1 : -1;
      el.animate(
        [
          { transform: `translateX(${opposite * 1600}px)` },
          { transform: `translateX(${opposite * -1600}px)` },
        ],
        {
          duration: 50800,
          iterations: Infinity,
          easing: 'linear',
        }
      );
    });
  }, []);

  useEffect(() => {
    // sun/moon positioning when theme changes
    if (dark) {
      sunRef.current.style.transform = 'translateX(-280px)';
      sunRef.current.style.transitionDuration = '1200ms';
      moonRef.current.style.transform = 'translateY(210px)';
      moonRef.current.style.transitionDuration = '1200ms';
    }
    if (!dark) {
      moonRef.current.style.transform = 'translateY(0px)';
      sunRef.current.style.transform = 'translateX(0px)';

    }
  }, [dark]);

  return (
    <div>
      {/* decorative images from public assets */}
      <img id="sun" ref={sunRef} className="sun" src={sunImg} alt="sun" />
      <img id="moon" ref={moonRef} className="moon" src={moonImg} alt="moon" />
      <img
        className="cloud"
        ref={(el) => (cloudRefs.current[0] = el)}
        id="cloud2"
        src={cloudImg}
        alt="cloud"
      />
      <img
        className="cloud"
        ref={(el) => (cloudRefs.current[1] = el)}
        id="cloud1"
        src={cloudImg}
        alt="cloud"
      />

      <ThemeToggle dark={dark} setDark={setDark} />

      <AnimatedTitle text="GardenPlotter" />

      <button className="green-button" id="start-button" onClick={() => setShowPlots(true)}>
        Start
      </button>

      <Grass className="grass-container" />

      

      <PlotsGrid onStart={onStart} visible={showPlots} />
    </div>
  );
};

export default Menu;
