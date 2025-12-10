import React, { useRef, useState, useEffect } from 'react';
import '../css/plot-style.css';
import PlotPanelItem from './PlotPanelItem';
import BugSpotlight from './BugSpotlight.jsx';
import {bugs} from '../data/bugs.js';
import StartGame from './StartGame.jsx';
import QuitConfirmationModal from './QuitConfirmationModal.jsx';

const StartPlot = ({ onBack, dark, setDark }) => {
  const selectedPlotName = typeof window !== 'undefined' ?
    localStorage.getItem('selectedPlotName') : null;
  const mainRef = useRef(null);
  const bug = "worm";
  const [showQuitModal, setShowQuitModal] = useState(false);
  
  const [streak, setStreak] = useState(0);
  const [bonus, setBonus] = useState(0);
  const capped = Math.min(streak, 200);        
  const percent = (capped / 200) * 100;

  const handleFoodCollected = (points) => {
    setStreak(prevStreak => prevStreak + points);
  };

  const handleBonusCollected = (bonusSelected) => {
    setBonus(bonusSelected);
  };

  const handleQuitClick = () => {
    setShowQuitModal(true);
  };
  const handleConfirmQuit = () => {
    setShowQuitModal(false);
    onBack();
  };
  const handleCancelQuit = () => {
    setShowQuitModal(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowQuitModal(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  

  return (
    <div id="garden-plot-container"
      style={{
        backgroundImage: `
          url(${require('../assets/cobblestone-background.png')}), 
          url(${require('../assets/cobblestone-background-2.png')}), 
          url(${require('../assets/cobblestone-background.png')})
        `,
        backgroundRepeat: 'repeat, repeat, repeat',
        backgroundPosition: '0 0, 32px 32px, 164px 164px',
        backgroundSize: '374px 374px , 264px 364px ,364px',
        width: '100%',
        height: '100%',
        left: -9,
        right: 0,
        top: -9,
        position: 'absolute',
      }}
    >
      <div id="left-plot-panel">
        <div id='left-button-container'>
          <button className="green-button" id='settings-button'>Settings</button>
        </div>
        <div className='portrait'>
          <div className="current-bug-display">
            <BugSpotlight isBugDisplay={true} className="curr-bug"/>
          </div>
        </div>
        <div id='plot-items-container'>
          <PlotPanelItem title="Diet" className="veggie-container" />
          <div>
            {bugs.map((element, index) => (
              <div key={index} className="diet-item">
               { element.name === bug ?
                element.diet.map((dietItem, dietIndex) => (
                  <img 
                    key={dietIndex}
                    src={require(`../assets/${dietItem}-diet.png`)}
                    alt={dietItem}
                    className="diet-images"
                  />
                )) : null
                }
              </div> 
            ))}
          </div>
          <PlotPanelItem title="Streak" className="structure-container" />
          <div className="panel-item-value">{streak}</div>
          <PlotPanelItem title="Lives" className="structure-container" />
          <div id='lives'>
            <img src={require('../assets/heart.png')} alt="heart" />
            <img src={require('../assets/heart.png')} alt="heart" />
            <img src={require('../assets/heart.png')} alt="heart" />
          </div>
          <PlotPanelItem title="Bonuses" className="structure-container" />
          <div className="panel-item-value">
            {
              bonus === "" ? "None":bonus === "bonus-speed" ? <img src={require('../assets/speed-boost.png') } alt="heart" />:"None" 
            }
          </div>
        </div>
      </div>


      <div id="right-plot-panel">
        <div id='right-button-container'>
          <button className="green-button" id='back-menu-button' onClick={handleQuitClick}>Quit</button>
          <div id='goal-container'>
            <h2 id='goal-title'>Goal</h2>
            <div id='goal-bar'>
              <div id='goal-bar-fill' 
                style={{
                  height: `${percent}%`
                }}  
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <div id='main-panel'>
        <StartGame 
          onFoodCollected={handleFoodCollected} 
          onBonusCollected={handleBonusCollected} 
          quitButton={showQuitModal} 
          bug ={1}/>
      </div>
      <QuitConfirmationModal 
        isOpen={showQuitModal}
        onConfirm={handleConfirmQuit}
        onCancel={handleCancelQuit}
      />
    </div>
  );
};

export default StartPlot;