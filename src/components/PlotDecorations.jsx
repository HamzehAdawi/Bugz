import React, { useEffect } from "react";

const PlotDecorations = ({ plotToDecorateRef }) => {
  useEffect(() => {
    const container = plotToDecorateRef && plotToDecorateRef.current;
    if (!container) return;

    const decorations = [
      require('../assets/flower-plot-deco.png'),
      require('../assets/flower2-plot-deco.png'),
      require('../assets/rock-plot-deco.png'),
    ];

    const amountOfDeco = Math.floor(Math.random() * 4);
    const plotBoundary = container.getBoundingClientRect();

    const created = [];
    for (let i = 0; i < amountOfDeco; i++) {
      const chooseDeco = decorations[Math.floor(Math.random() * decorations.length)];
      const decoElement = document.createElement('img');
      decoElement.src = chooseDeco;
      decoElement.style.position = 'absolute';
      decoElement.style.width = '25px';
      decoElement.style.height = '25px';

      const x = Math.random() * Math.max(0, plotBoundary.width - 45);
      const y = Math.random() * Math.max(0, plotBoundary.height - 45);
      decoElement.style.left = `${x}px`;
      decoElement.style.top = `${y}px`;

      container.appendChild(decoElement);
      created.push(decoElement);
    }

    return () => {
      created.forEach(el => el.remove());
    };
  }, [plotToDecorateRef]);

  return null;
};

export default PlotDecorations;