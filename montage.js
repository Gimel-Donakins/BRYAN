const montageData = [
  {
    img: 'bryan.jpg',
    text: 'at the crack of dawn, eyelids open, but bryan is breathing over your bed'
  },
  {
    img: 'bryan2.jpg',
    text: `and at 9:30 each night Bryan BANGS down room 325\'s door because Eli once again forgot to check into the building`
  },
  {
    img: 'bryan5.jpg',
    text: `Sean left his milk on the counter, Eli was laying in bed, and Lucas was doing Lucas things`
  },
  {
    img: 'bryan4.jpg',
    text: `The Bacon is fryin' thanks to Bryan`
  },
  {
    img: 'bryan6.jpg',
    text: `The weights are flyin', you're the best Bryan`
  },
  {
    img: 'bryan4.jpg',
    text: `Chuck Norris is sighing, pretty cool Bryan`
  },
  {
    img: 'bryan7.jpeg',
    text: `One day I was cryin' but no more because Bryan`
  },
  {
    img: 'bryan.jpg',
    text: `For the room check we were tryin' but we won thanks to cuz of bryan`
  },
  {
    img: 'bryan8.jpeg',
    text: `At Nathan's house through the curtains Bryan be spyin'`
  },
  {
    img: 'bryan6.jpg',
    text: `one day I was walking on the sidewalk when I saw Jesse being carried by the likes of Bryan`
  },
  {
    img: 'bryan3.jpg',
    text: `and I was scared for a second because I was in awe of the awful strength of the chef mentor man Bryan`
  },
  {
    img: 'bryan7.jpg',
    text: `and I calmed down and started my load of drying and had a nice chat with Daniel the other cool guy before taking an investment\n THE INVESTMENT PAID OFF!!`
  }
];



let current = 0;
let audio;
let recording = false;
let lastTime = null;
// Intervals in ms between lyric switches, user-provided:
const intervals = [9584,11014,13978,4993,5013,5081,5060,5051,5889,5360,5826,12672,19061,4902,2494];
let intervalTimer = null;


function showMontageItem(idx, animate = true) {
  const m = montageData[idx];
  const montage = document.getElementById('montage');
  // Animate out old frame
  const oldFrame = montage.querySelector('.montage-frame');
  if (oldFrame && animate) {
    oldFrame.classList.add('fly-out');
    setTimeout(() => {
      oldFrame.classList.add('fly-out-active');
      setTimeout(() => {
        renderNewFrame();
      }, 600);
    }, 10);
    return;
  }
  renderNewFrame();

  function renderNewFrame() {
    montage.innerHTML = `
      <div class='montage-frame fly-in'>
        <img src='${m.img}' class='montage-img' alt='Bryan photo'>
      </div>
      <div class='lyric'>${m.text.replace(/\n/g, '<br>')}</div>
    `;
    setTimeout(() => {
      const newFrame = montage.querySelector('.montage-frame');
      if (newFrame) {
        newFrame.classList.add('fly-in-active');
        newFrame.classList.remove('fly-in');
      }
    }, 10);
  }
}


function nextMontageItem() {
  current++;
  if (current >= montageData.length) {
    current = 0;
  }
  showMontageItem(current);
}




function startMontage() {
  document.getElementById('start-screen').style.opacity = 0;
  setTimeout(() => {
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('montage').style.display = 'flex';
    document.getElementById('record-btn').style.display = 'none'; // Hide record button when using intervals
    showMontageItem(0, false);
    audio = new Audio('bryan.mp3');
    audio.play();
    recording = false;
    lastTime = Date.now();
    // Start auto-advance using intervals
    let idx = 0;
    function advance() {
      idx++;
      if (idx < montageData.length && idx < intervals.length + 1) {
        showMontageItem(idx);
        if (idx < intervals.length) {
          intervalTimer = setTimeout(advance, intervals[idx]);
        }
      }
    }
    if (intervals.length > 0) {
      intervalTimer = setTimeout(advance, intervals[0]);
    }
    // Fade in bryan.html overlay after 119999 ms from click
    setTimeout(() => {
      const montageDiv = document.getElementById('montage');
      montageDiv.style.transition = 'opacity 1.5s';
      montageDiv.style.opacity = 0;
      setTimeout(() => {
        montageDiv.style.display = 'none';
        // Fade in bryan.html as overlay
        let overlay = document.getElementById('bryan-overlay-frame');
        if (!overlay) {
          overlay = document.createElement('iframe');
          overlay.id = 'bryan-overlay-frame';
          overlay.src = 'bryan.html';
          overlay.style.position = 'fixed';
          overlay.style.top = '0';
          overlay.style.left = '0';
          overlay.style.width = '100vw';
          overlay.style.height = '100vh';
          overlay.style.border = 'none';
          overlay.style.zIndex = '99999';
          overlay.style.opacity = '0';
          overlay.style.transition = 'opacity 1.5s';
          overlay.style.overflow = 'auto'; // allow scrolling
          overlay.onload = function() {
            setTimeout(() => {
              overlay.style.opacity = '1';
            }, 50);
          };
          document.body.appendChild(overlay);
        } else {
          overlay.style.display = 'block';
          setTimeout(() => {
            overlay.style.opacity = '1';
          }, 50);
        }
      }, 1000);
    }, 93000);
  }, 700);
}

function recordInterval() {
  if (!recording) return;
  const now = Date.now();
  if (lastTime) {
    const interval = now - lastTime;
    intervals.push(interval);
    console.log('Interval:', interval, 'ms');
    // Optionally, log all intervals as JSON:
    console.log('All intervals:', JSON.stringify(intervals));
  }
  lastTime = now;
  nextMontageItem();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('start-screen').addEventListener('click', startMontage);
  document.getElementById('record-btn').addEventListener('click', recordInterval);
});
