import React, { useEffect, useState, useRef } from 'react';

const PlotsGrid = ({ onStart, visible = true }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [names, setNames] = useState(['', '', '', '']);

  useEffect(() => {
    // load saved names
    const newNames = names.slice();
    for (let i = 0; i < 4; i++) {
      const saved = localStorage.getItem(`plot${i + 1}-name`);
      if (saved) newNames[i] = saved;
    }
    setNames(newNames);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const containerRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (!visible) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setSelectedIndex((s) => (s == null ? 0 : Math.min(3, s + 1)));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setSelectedIndex((s) => (s == null ? 0 : Math.max(0, s - 1)));
      } else if (e.key === 'Enter') {
        handleStart();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, names, selectedIndex]);

  function showToast(text) {
    const id = 'simple-toast';
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement('div');
      el.id = id;
      document.body.appendChild(el);
      el.style.position = 'fixed';
      el.style.top = '20px';
      el.style.left = '50%';
      el.style.transform = 'translateX(-50%)';
      el.style.background = '#3fbb62ed';
      el.style.color = '#fff';
      el.style.padding = '12px 20px';
      el.style.borderRadius = '8px';
      el.style.zIndex = 9999;
    }
    el.textContent = text;
    el.style.display = 'block';
    setTimeout(() => {
      if (el) el.style.display = 'none';
    }, 2000);
  }

  function handleNameChange(i, value) {
    const copy = names.slice();
    copy[i] = value;
    setNames(copy);
    localStorage.setItem(`plot${i + 1}-name`, value);
  }

  function handleStart() {
    if (selectedIndex == null) {
      showToast('Please select a plot.');
      return;
    }

    const plotName = names[selectedIndex] || `Plot ${selectedIndex + 1}`;
    localStorage.setItem('selectedPlotName', plotName);
    if (typeof onStart === 'function') onStart();
  }

  return (
    <div id="plots-container" style={{ display: visible ? 'block' : 'none' }}>
      <h1 id="plots-title">My Plots</h1>
        <div id="plots-grid" ref={containerRef}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="plot"
              role="button"
              tabIndex={0}
              aria-pressed={selectedIndex === i}
              style={{ border: selectedIndex === i ? 'solid 3px white' : 'none', cursor: 'pointer' }}
              onClick={() => setSelectedIndex(i)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') setSelectedIndex(i);
              }}
            >
              <input
                className="plot-names"
                placeholder={`Empty Plot #${i + 1}`}
                value={names[i]}
                onChange={(e) => handleNameChange(i, e.target.value)}
              />
            </div>
          ))}

          <div id="plot-select-buttons">
            <button className="green-button" id="new-plot-button" onClick={handleStart}>
              Let's Go!
            </button>
          </div>
        </div>
    </div>
  );
};

export default PlotsGrid;
