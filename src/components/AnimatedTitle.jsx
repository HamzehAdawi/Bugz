import React, { useEffect, useRef } from 'react';

const AnimatedTitle = ({ text = 'GardenPlotter', letterClass = 'letter', delay = 3500 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const title = containerRef.current;
    if (!title) return;

    // Clear any previous children
    title.innerHTML = '';

    const arrayLetters = String(text).split('');
    const radius = 200;
    const centerIndex = (arrayLetters.length - 1) / 2;

    arrayLetters.forEach((letter, index) => {
      const outer = document.createElement('span');
      outer.style.display = 'inline-block';
      outer.style.transformOrigin = 'bottom center';

      const angle = (index - centerIndex) * (Math.PI / 31);
      const yOffset = Math.cos(angle) * -radius + radius;
      const rotation = (angle * 180) / Math.PI;

      outer.style.transform = `translateY(${yOffset}px) rotate(${rotation}deg)`;

      const inner = document.createElement('span');
      inner.classList.add(letterClass);
      inner.textContent = letter;
      inner.style.display = 'inline-block';

      outer.appendChild(inner);
      title.appendChild(outer);
    });

    // bounce animation helper
    function bounce(element) {
      return element.animate(
        [
          { transform: 'translateY(0px)' },
          { transform: 'translateY(-80px)' },
          { transform: 'translateY(0px)' },
          { transform: 'translateY(-20px)' },
          { transform: 'translateY(0px)' },
          { transform: 'translateY(-14px)' },
          { transform: 'translateY(0px)' },
          { transform: 'translateY(-9px)' },
          { transform: 'translateY(0px)' },
        ],
        {
          duration: 1200,
          iterations: 1,
        }
      ).finished;
    }

    function wait(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    let stopped = false;

    async function delayBounce(d) {
      const letters = title.querySelectorAll(`.${letterClass}`);
      while (!stopped) {
        const random = Math.floor(Math.random() * letters.length);
        await bounce(letters[random]);
        await wait(d);
      }
    }

    delayBounce(delay);

    return () => {
      stopped = true;
    };
  }, [text, letterClass, delay]);

  return <h1 id="main-title" ref={containerRef} aria-label={text}>{text}</h1>;
};

export default AnimatedTitle;
