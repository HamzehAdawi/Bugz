import React, { useState, useEffect } from 'react';
import './App.css';
import './style.css';
import Menu from './components/Menu';
import StartPlot from './components/StartPlot';

function App() {
  const [view, setView] = useState('menu');
  const [dark, setDark] = useState(localStorage.getItem('theme-dark') === '1');

  useEffect(() => {
    const root = document.documentElement;
    const themeColor = dark ? 'rgb(43, 42, 51)' : 'rgb(54, 184, 224)';
    root.style.setProperty('--theme-color', themeColor);
    localStorage.setItem('theme-dark', dark ? '1' : '0');
  }, [dark]);

  return (
    <div className="App">
      {view === 'menu' && <Menu onStart={() => setView('start')} dark={dark} setDark={setDark} />}
      {view === 'start' && <StartPlot onBack={() => setView('menu')} dark={dark} setDark={setDark} />}
    </div>
  );
}

export default App;
