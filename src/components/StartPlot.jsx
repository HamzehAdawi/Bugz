import React, { useRef } from 'react';
import '../plot-style.css';
import PlotDecorations from './PlotDecorations';
import AnimatedBird from './AnimateBird';

const StartPlot = ({ onBack, dark, setDark }) => {
  const selectedPlotName = typeof window !== 'undefined' ? localStorage.getItem('selectedPlotName') : null;
  const mainRef = useRef(null);

  return (
    
    <div 
      id="garden-plot-container"
      style={{
        backgroundImage: `url(${require('../assets/plot-background.png')})`,
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
        <div className='panel-item-container' id='veggies-container'>
          <h1 id='veggies-title'>
          Veggies
        </h1>
        </div>
      </div>
       <div id='top-plot-panel'>

        <div id='plot-title-sign'>
          <div>
            <p id="plot-title">{selectedPlotName || 'My Plot'}</p>
          </div>
          

        </div>
        
        <div className="animated-bird">
          <img id="birdie" src={require('../assets/flying-birdie.png')} alt="bird"/>
          <AnimatedBird />
        </div>
       </div>
           

      <PlotDecorations plotToDecorateRef={mainRef} />

      <div id="right-plot-panel">
        <button className="green-button" id='back-menu-button' onClick={onBack}>Quit</button>
      </div>

      <div id="bottom-plot-panel"></div>
       <div
        id='main-panel'
        ref={mainRef}
        style={{
          backgroundImage: `url(${require('../assets/Empty-grass-plot.png')}) `,
          border: '5px solid rgb(59, 37, 26)',
          borderTop: 'none',
        }}
      ></div>
      
    </div>
  );
};

export default StartPlot;
