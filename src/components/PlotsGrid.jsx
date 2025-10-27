import React, { useEffect, useState, useRef } from 'react';
import "../css/PlotsGrid.css"

const PlotsGrid = ({ onStart, visible = true, onClose }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [names, setNames] = useState(['', '', '', '']);
  const [editingIndex, setEditingIndex] = useState(null);


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
  const plotsContainerRef = useRef(null);
  const inputRefs = useRef([]);



  function showToast(text) {
    const containerId = 'toast-container';
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      container.style.position = 'fixed';
      container.style.top = '20px';
      container.style.left = '50%';
      container.style.transform = 'translateX(-50%)';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.alignItems = 'center';
      container.style.gap = '8px';
      container.style.zIndex = '9999';
      container.style.pointerEvents = 'none';
      container.style.maxWidth = '100%';
      container.style.left = '51%';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'simple-toast-item';
    toast.style.pointerEvents = 'auto';
    toast.style.background = '#3fbb62ed';
    toast.style.color = '#fff';
    toast.style.padding = '10px 16px';
    toast.style.borderRadius = '8px';
    toast.style.minWidth = '480px';
    toast.style.maxWidth = '1600vw';
    toast.style.textAlign = 'center';
    toast.style.boxShadow = '0 6px 18px rgba(0,0,0,0.12)';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-6px)';
    toast.style.transition = 'opacity 180ms ease, transform 180ms ease';
    toast.style.fontSize = '24px';
    toast.textContent = text;

    // insert at the top so new clicks build downward
    container.insertBefore(toast, container.firstChild);

    // force a frame then animate in
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    const duration = 3000;
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-6px)';
      setTimeout(() => {
        try {
          if (toast && toast.parentNode) toast.parentNode.removeChild(toast);
          // remove container if empty
          if (container && container.childElementCount === 0 && container.parentNode) {
            container.parentNode.removeChild(container);
          }
        } catch (e) {
          // ignore
        }
      }, 220);
    }, duration);
  }

  function handleNameChange(i, value) {
    const copy = names.slice();
    copy[i] = value;
    setNames(copy);
    localStorage.setItem(`plot${i + 1}-name`, value);
  }

  function handleStart() {
    if (selectedIndex == null) {
      showToast('Please select a game.');
      return;
    }

    const plotName = names[selectedIndex] || `Plot ${selectedIndex + 1}`;
    localStorage.setItem('selectedPlotName', plotName);
    if (typeof onStart === 'function') onStart();
  }

  function handleMenu() {
    // Prefer letting the parent control visibility via an onClose callback.
    if (typeof onClose === 'function') {
      onClose();
      return;
    }

    // Fallback: if no callback provided, try to hide the container directly.
    if (plotsContainerRef.current) {
      plotsContainerRef.current.style.display = 'none';
    }
  }

  return (
    <div ref={plotsContainerRef} id="plots-container" style={{ display: visible ? 'block' : 'none' }}>
      <h1 id="plots-title">Game Saves</h1>
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
              
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  ref={(el) => (inputRefs.current[i] = el)}
                  className="plot-names"
                  placeholder={`New Game #${i + 1}`}
                  value={names[i]}
                  readOnly={names[i].length > 0 && editingIndex !== i} 
                  onChange={(e) => handleNameChange(i, e.target.value)}
                  onClick={() => {
                    if (names[i].length === 0) {
                      setEditingIndex(i);
                    }
                  }}
                  onBlur={() => {
                    if (editingIndex === i) setEditingIndex(null);
                  }}
                />             
                {names[i] && names[i].length > 0 && editingIndex !== i && (
                    <button
                      className="green-button"
                      style={{ padding: '6px 6px', fontSize: '14px', marginRight: "2px", marginBottom: "20px" }}
                      onClick={(e) => {
                        e.stopPropagation(); 
                        setEditingIndex(i);
                        setTimeout(() => {
                          if (inputRefs.current[i]) {
                            inputRefs.current[i].focus();
                            const el = inputRefs.current[i];
                            const len = el.value ? el.value.length : 0;
                            el.setSelectionRange(len, len);
                          }
                        }, 0);
                      }}
                        >
                          Rename
                    </button>
                  )}
                </div>
           </div>
          ))}

          <div id="plot-select-buttons">
            <button className="green-button" id="menu-button" onClick={handleMenu}>Menu </button>
            <button className="green-button" id="new-plot-button" onClick={handleStart}>
              Let's Go!
            </button>
          </div>
        </div>
    </div>
  );
};

export default PlotsGrid;
