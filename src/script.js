const delay = 3500;
const title = document.querySelector("#main-title");
const arrayLetters = "GardenPlotter".split("");
const radius = 200; 
const centerIndex = (arrayLetters.length - 1) / 2;
const angleStep = 20 / radius; 

arrayLetters.forEach((letter, index) => {

  const outer = document.createElement("span");
  outer.style.display = "inline-block";
  outer.style.transformOrigin = "bottom center";


  const angle = (index - centerIndex) * (Math.PI / 31);
  const yOffset = Math.cos(angle) * -radius + radius; 
  const rotation = (angle * 180) / Math.PI;

  outer.style.transform = `translateY(${yOffset}px) rotate(${rotation}deg)`;

 
  const inner = document.createElement("span");
  inner.classList.add("letter");
  inner.textContent = letter;
  inner.style.display = "inline-block";

  outer.appendChild(inner);
  title.appendChild(outer);
});


function bounce(element) {
  return element.animate(
    [
      { transform: "translateY(0px)" },
      { transform: "translateY(-80px)" },
      { transform: "translateY(0px)" },
      { transform: "translateY(-20px)" },
      { transform: "translateY(0px)" },
      { transform: "translateY(-14px)" },
      { transform: "translateY(0px)" },
      { transform: "translateY(-9px)" },
      { transform: "translateY(0px)" },
    ],
    {
      duration: 1200,
      iterations: 1,
    }
  ).finished;
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function delayBounce(delay) {
  const letters = title.querySelectorAll(".letter");
  
  while (true) {
    const random = Math.floor(Math.random() * letters.length);
    await bounce(letters[random]);
    await wait(delay);
  }
}

delayBounce(delay);


// Start Button
let iteration = 1; 
let startButton = document.querySelector("#start-button");
let plotContainer = document.querySelector("#plots-container");
startButton.addEventListener("click", () => {
  startButton.style.display = "none";
  plotContainer.style.display = "block";
});

let hoverAnimation; 

startButton.addEventListener("mouseover", () => {
 
  hoverAnimation = startButton.animate(
    [
      { transform: "rotate(5deg)" },
      { transform: "rotate(-5deg)" },
      { transform: "rotate(5deg)" },
      { transform: "rotate(-5deg)" },
      { transform: "rotate(0deg)" },
    ],
    {
      duration: 700,
      iterations: Infinity,
      easing: "ease-in-out",
    }
  );
});

startButton.addEventListener("mouseleave", () => {
 
  if (hoverAnimation) {
    hoverAnimation.cancel();
    hoverAnimation = null;
  }
});

// Cloud Animations
const clouds = document.querySelectorAll(".cloud");
let tranlation = 1300;

clouds.forEach((cloud, index) => {
  const opposite = index % 2 === 0 ? 1 : -1;
  cloud.animate(
    [
      { transform: `translateX(${opposite * 1600}px)` },
      { transform: `translateX(${opposite * -1600}px)` },
      { transform: `translateX(${opposite * 1600}px)` },
      { transform: `translateX(${opposite * -1600}px)` },
    ],
    {
      duration: 78500,
      iterations: Infinity,
      easing: "linear",
      delay: 0,
    }
  );
});

// Theme change
const toggleSwitch = document.getElementById('theme-toggle');
const body = document.body;
const slider = document.querySelector('.slider');
const sliderBefore = document.querySelector('.slider:before');
const sun = document.getElementById('sun');
const moon = document.getElementById('moon');
const themeIcon = document.getElementById('theme-toggle-icon');
const root = document.documentElement;

// Initialize theme immediately
const dark = localStorage.getItem('theme-dark') === '1';
const themeColor = dark ? 'rgb(43, 42, 51)' : 'rgb(54, 184, 224)';
root.style.setProperty('--theme-color', themeColor);

// Restore theme and icon state from localStorage
const savedIcon = localStorage.getItem('theme-icon');
if (dark) {

  if (themeIcon && savedIcon === 'moon') {
  themeIcon.setAttribute('src', '/assets/moon-icon.png');
    themeIcon.style.width = '18px';
    themeIcon.style.height = '18px';
  }
} else {
  if (themeIcon && savedIcon === 'sun') {
  themeIcon.setAttribute('src', '/assets/sun-icon.png');
    themeIcon.style.width = '18px';
    themeIcon.style.height = '18px';
  }
}

if (toggleSwitch) {
  toggleSwitch.checked = dark;
  if (dark) {
    root.style.setProperty('--theme-color', 'rgb(43, 42, 51)');
    slider.style.backgroundColor = '#ffffffff';
    if (sun) sun.style.transform = 'translateX(-260px)';
    if (moon) moon.style.transform = 'translateY(160px)';
    if (themeIcon) {
      themeIcon.setAttribute('src', '/assets/moon-icon.png');
      themeIcon.style.width = '18px';
      themeIcon.style.height = '18px';
    }
  } else {
    root.style.setProperty('--theme-color', 'rgb(54, 184, 224)');
    slider.style.backgroundColor = 'rgba(43, 42, 51, 0.68)';
    if (sun) sun.style.transform = 'translateX(0px)';
    if (moon) moon.style.transform = 'translateY(-180px)';
    if (themeIcon) {
      themeIcon.setAttribute('src', '/assets/sun-icon.png');
      themeIcon.style.width = '18px';
      themeIcon.style.height = '18px';
    }
  }

  toggleSwitch.addEventListener('change', (e) => {
    if (e.target.checked) {
      root.style.setProperty('--theme-color', 'rgb(43, 42, 51)');
      slider.style.backgroundColor = '#ffffffff';
      if (themeIcon) {
        themeIcon.setAttribute('src', '/assets/moon-icon.png');
        themeIcon.style.width = '18px';
        themeIcon.style.height = '18px';
      }
      sun.animate(
        [
          { transform: 'translateX(-260px)' }
        ],
        {
          duration: 1200,
          iterations: 1,
        }
      ).finished.then(() => {
        sun.style.transform = 'translateX(-260px)';
      });
      moon.animate(
        [
          { transform: 'translateY(160px)' },
        ],
        {
          duration: 1200,
          iterations: 1,
        }
      ).finished.then(() => {
        moon.style.transform = 'translateY(160px)';
      });
      localStorage.setItem('theme-dark', '1');
      localStorage.setItem('theme-icon', 'moon');
    } else {
      root.style.setProperty('--theme-color', 'rgb(54, 184, 224)');
      slider.style.backgroundColor = 'rgba(43, 42, 51, 0.68)';
      if (themeIcon) {
        themeIcon.setAttribute('src', '/assets/sun-icon.png');
        themeIcon.style.width = '18px';
        themeIcon.style.height = '18px';
      }
      sun.animate(
        [
          { transform: 'translateX(0px)' },
        ],
        {
          duration: 1200,
          iterations: 1,
        }
      ).finished.then(() => {
        sun.style.transform = 'translateX(0px)';
      });
      moon.animate(
        [
          { transform: 'translateY(-180px)' },
        ],
        {
          duration: 1200,
          iterations: 1,
        }
      ).finished.then(() => {
        moon.style.transform = 'translateY(-180px)';
      });
      localStorage.setItem('theme-dark', '0');
      localStorage.setItem('theme-icon', 'sun');
    }
  });
}

let plots = document.querySelectorAll(".plot"); 
let plotClicked = false;
let plotSelected = null;

plots.forEach(plot => {
  plot.addEventListener("click", () => {
    if (!plotClicked) {
      plotClicked = true;
      plotSelected = plot;
      plot.setAttribute("style", "border: solid 3px white;");
    } else {
      plotSelected.setAttribute("style", "border: none;");
      plot.setAttribute("style", "border: solid 3px white;");
      plotSelected = plot;
    }
  });
});

let newPlotButton = document.querySelector("#new-plot-button");

if (newPlotButton) {
  newPlotButton.addEventListener("click", () => {
     
     if (plotSelected != null) {

      const plotNameInput = plotSelected.querySelector('.plot-names');
      let plotName = plotNameInput ? plotNameInput.value.trim() : '';
      
      // If no custom name entered, use the placeholder text or default name
      if (!plotName) {
        plotName = plotNameInput ? plotNameInput.placeholder : `Plot ${Array.from(plots).indexOf(plotSelected) + 1}`;
      }
      
      localStorage.setItem("selectedPlotName", plotName);
      window.location.href = "start.html";
     } else {
        Toastify({
          text: "Please select a plot.",
          duration: 3000,
          gravity: "top", 
          position: "center", 
          style: {
            background: "#3fbb62ed", 
            color: "#fff",         
            fontSize: "25px",       
            padding: "16px 24px",
            minWidth: "20%",   
            boxshadow: "0 4px 6px rgba(0, 0, 0, 0.1)", 
            textAlign: "center",
        }
      }).showToast();
    }
  });
}

const plotInputs = document.querySelectorAll('.plot-names');

plotInputs.forEach((input, index) => {
 
  const savedName = localStorage.getItem(`plot${index + 1}-name`);
  if (savedName) {
    input.value = savedName;
  }
  
  input.addEventListener('input', (event) => {
    const plotName = event.target.value;
    localStorage.setItem(`plot${index + 1}-name`, plotName); 
  });
});

let menuButton = document.getElementById("menu-button");

if (menuButton) {
  menuButton.addEventListener("click", () => {
     plotContainer.style.display = "none";
     startButton.style.display = "block";
  });
}

// Plot title setter - only runs if plot-title element exists (on start.html)
function setPlotTitle() {
  // Only run on start.html or if plot-title element exists
  if (!window.location.href.includes('start.html') && !document.getElementById("plot-title")) {
    return;
  }
  
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

// Call the function when the page loads - use multiple strategies
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setPlotTitle);
} else {
  // DOM is already loaded
  setPlotTitle();
}

// Also try after a short delay to ensure everything is ready
setTimeout(setPlotTitle, 100);

// For extra safety, try when window loads
window.addEventListener('load', setPlotTitle);
