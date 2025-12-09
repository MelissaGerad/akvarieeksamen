const ocean = document.getElementById("ocean");
    // Knapfunktioner
  const playBtn = document.querySelector('.play');
playBtn.innerHTML = '<span class="symbol">&#9658;</span>';
playBtn.addEventListener('click', () => {
  window.location.href = 'spil.html'; // <--  HTML-fil der skal åbne
});

const infoBtn = document.querySelector('.info');
infoBtn.innerHTML = '<span class="symbol">i</span>';
infoBtn.addEventListener('click', () => {
  window.location.href = 'info.html'; 
});

// Indstillinger knap
const settingsBtn = document.querySelector('.settings-btn');
settingsBtn.addEventListener('click', () => {
  window.location.href = 'settings.html'; // eller hvilken side du vil åbne
});




    // BOBLER: Automatisk genererede bobler ===
function createBubble() {
  const bubble = document.createElement("span"); // <-- tilføjet
  bubble.className = "bubble";
  const size = Math.random() * 20 + 10; // 10–30 px
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;
  bubble.style.left = `${Math.random() * 100}%`;
  bubble.style.animationDuration = `${6 + Math.random() * 4}s`;

  ocean.appendChild(bubble);

  setTimeout(() => {
    bubble.remove();
  }, 9000);
}

// Lav nye bobler løbende
setInterval(createBubble, 500);