import React, { useRef } from 'react';
import '../plot-style.css';
import PlotDecorations from './PlotDecorations';
import AnimatedBird from './AnimateBird';
import PlotPanelItem from './PlotPanelItem';
import BugControls from './BugControls';

const StartPlot = ({ onBack, dark, setDark }) => {
  const selectedPlotName = typeof window !== 'undefined' ? localStorage.getItem('selectedPlotName') : null;
  const mainRef = useRef(null);

  return (
    <div
      id="garden-plot-container"
      style={{
        backgroundImage: `url(${require('../assets/background_img.png')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        width: '100%',
        height: '100%',
        left: -5,
        top: -9,
        position: 'absolute',
      }}
    >
      <div id="left-plot-panel">

        <div id='left-button-container'>
          <button className="green-button" id='settings-button'>Settings</button>
        </div>
        
        <div id='plot-items-container'>
          <PlotPanelItem title="Veggies" className="veggie-container" />
          <PlotPanelItem title="Structs" className="structure-container" />
          <PlotPanelItem title="Beds" className="structure-container" />
           <PlotPanelItem title="Misc." className="structure-container" />
        </div>
        

      </div>
      
      <div id='top-plot-panel'>
  
        <div className="animated-bird">
          <img id="birdie" src={require('../assets/flying-birdie.png')} alt="bird"/>
          <AnimatedBird birdId={"birdie"}/>
        </div>

      </div>
           

      <PlotDecorations plotToDecorateRef={mainRef} />

      <div id="right-plot-panel">
        <div id='right-button-container'>
          <button className="green-button" id='back-menu-button' onClick={onBack}>Quit</button>
        </div>
        
      </div>

      <div id="bottom-plot-panel"></div>
      
      <div id='main-panel'>
        <div id='grass-canvas' ref={mainRef}></div>
        <div id='grass-flakes'></div>
        <div id='dirt-canvas'>
        <div id='bug-control-container'>
          <BugControls />
        </div>
          
        </div>
      </div>
      
    </div>
  );
};

export default StartPlot;
