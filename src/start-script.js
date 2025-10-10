// Simple plot title setter for start.html page
function setPlotTitle() {
  const plotTitle = document.getElementById("plot-title");
  
  if (plotTitle) {
    const selectedPlotName = localStorage.getItem("selectedPlotName");
    
    if (selectedPlotName && selectedPlotName.trim() !== '') {
      plotTitle.textContent = selectedPlotName;
    } else {
      plotTitle.textContent = "Garden Plot";
    }
  }
}

// Try multiple ways to ensure the title gets set
document.addEventListener('DOMContentLoaded', setPlotTitle);
window.addEventListener('load', setPlotTitle);
setTimeout(setPlotTitle, 100);

// If document is already ready, run immediately
if (document.readyState !== 'loading') {
  setPlotTitle();
}