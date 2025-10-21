import React from "react";
import '../plot-style.css';

const PlotPanelItem = ({ title }) => {
  return (
    <div className="panel-item-container">
        <h1 className="panel-item-title">{title}</h1>
        <div className="panel-items"></div>
    </div>
      

  
    
    
  );
};

export default PlotPanelItem;
