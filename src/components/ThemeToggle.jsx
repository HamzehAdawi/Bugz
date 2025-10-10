import React from 'react';
import sunIcon from '../assets/sun-icon.png';
import moonIcon from '../assets/moon-icon.png';

const ThemeToggle = ({ dark, setDark }) => {
  return (
    <div id="theme-toggle-container">
      <img id="theme-toggle-icon" src={dark ? moonIcon : sunIcon} alt="Toggle Theme" />
      <label className="switch">
        <input id="theme-toggle" type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} />
        <span className="slider round" />
      </label>
    </div>
  );

  
};

export default ThemeToggle;
