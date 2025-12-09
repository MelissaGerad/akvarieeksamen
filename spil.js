
// spil.js - small fixes and safe handlers for the fishing game
// Provides: showFishInfo(id) and closeFishInfo(id) used by the HTML
// and optional keyboard control if an element with id="player-fish" exists.
;
        
 
        

// Når HTML’en er fuldt indlæst, kør denne kode
document.addEventListener('DOMContentLoaded', () => {

    // --- FUNKTIONER TIL INFO-BOKSE ---
    // Denne funktion viser info-boksen for en fisk
    window.showFishInfo = function(id) {
        // find HTML-elementet med id fx 'fish1-info'
        const el = document.getElementById(id + '-info');
        // hvis elementet ikke findes, stop og log en advarsel
        if (!el) return console.warn('Info element not found for', id);
        // fjern 'hidden' klassen så boksen bliver synlig
        el.classList.remove('hidden');
    };

    // Denne funktion skjuler info-boksen for en fisk
    window.closeFishInfo = function(id) {
        // find elementet med id fx 'fish1-info'
        const el = document.getElementById(id + '-info');
        if (!el) return; // hvis det ikke findes, gør ingenting
        // tilføj 'hidden' klassen så boksen bliver skjult
        el.classList.add('hidden');
    };

    // Luk info-boksen hvis man klikker på overlay, men ikke hvis man klikker inde i boksen
    document.querySelectorAll('.info-box').forEach(box => {
        box.addEventListener('click', (e) => {
            // hvis klik-mål er selve boksen (overlay), skjul den
            if (e.target === box) box.classList.add('hidden');
        });
    });

     // === spil.js med detaljerede forklaringer ===


    // --- PILTAST KONTROL AF FISK ---
    // find fisken som spilleren styrer
    const controlledFish = document.getElementById('player-fish');
    // score til plankton samlet
    let score = 0;
    // reference til HTML-element der viser score
    const scoreEl = document.getElementById('score');
    // flag der markerer om spillet er slut
    let gameIsOver = false;
    // håndtag til plankton-spawner interval
    let spawnHandle = null;

    // --- INITIERING AF FISKEN ---
    if (controlledFish) {
        // gem startposition, hvis stil ikke allerede sat, brug 100x100
        let fishPosition = { 
            x: parseInt(controlledFish.style.left) || 100, 
            y: parseInt(controlledFish.style.top) || 100 
        };
        const fishSpeed = 20; // hvor mange pixels fisken flytter pr tastetryk

        // sikre absolut positionering
        controlledFish.style.position = controlledFish.style.position || 'absolute';
        controlledFish.style.left = fishPosition.x + 'px';
        controlledFish.style.top = fishPosition.y + 'px';

        // --- STYR FISKEN MED PILETASTER ---
        document.addEventListener('keydown', function(event){
            const key = event.key; // hvilken tast blev trykket

            // forhindre standard scrolling når man trykker piletaster
            if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(key)) event.preventDefault();

            // hent nuværende position
            const currentLeft = parseInt(controlledFish.style.left) || fishPosition.x;
            const currentTop = parseInt(controlledFish.style.top) || fishPosition.y;

            // opdater position baseret på tast
            if (key === 'ArrowUp') fishPosition.y = currentTop - fishSpeed;      // flyt op
            if (key === 'ArrowDown') fishPosition.y = currentTop + fishSpeed;    // flyt ned
            if (key === 'ArrowLeft') {
                fishPosition.x = currentLeft - fishSpeed;                         // flyt til venstre
                controlledFish.style.transform = 'scaleX(-1)';                  // vend fisken til venstre
            }
            if (key === 'ArrowRight') {
                fishPosition.x = currentLeft + fishSpeed;                        // flyt til højre
                controlledFish.style.transform = 'scaleX(1)';                   // vend fisken til højre
            }

            // opdater fiskens CSS position
            controlledFish.style.left = fishPosition.x + 'px';
            controlledFish.style.top = fishPosition.y + 'px';

            // --- SAMLE PLANKTON ---
            // find alle plankton i spilområdet
            document.querySelectorAll('.plankton').forEach(p => {
                // hent planktonets position
                const rectP = p.getBoundingClientRect();
                // hent fiskens position
                const rectF = controlledFish.getBoundingClientRect();

                // beregn afstand mellem midtpunkter af fisk og plankton
                const dx = Math.abs((rectF.left + rectF.width/2) - (rectP.left + rectP.width/2));
                const dy = Math.abs((rectF.top + rectF.height/2) - (rectP.top + rectP.height/2));

                // hvis fisk er tæt nok på plankton (dx < 40 og dy < 40)
                if (dx < 40 && dy < 40) {
                    // fjern planktonet (spist)
                    p.remove();
                    // opdater score
                    score++;
                  if (scoreEl) scoreEl.textContent = 'Plankton samlet: ' + score;

                  // Hvis spilleren har samlet ALT plankton → game over
                  if (document.querySelectorAll('.plankton').length === 0) {
                  gameOver();
}   
                }
            });
        });
    }

    // --- PLANKTON SPAWNER ---
    const gameArea = document.getElementById('game-area');
    if (gameArea) {
        const maxPlankton = 15;         // max antal plankton på banen
        const spawnIntervalMs = 1500;   // hvor ofte plankton spawnes (ms)

        function spawnPlankton() {
            if (gameIsOver) return; // stop hvis spil slut
            const existing = gameArea.querySelectorAll('.plankton').length;
            if (existing >= maxPlankton) return; // hvis for mange plankton, spawn ikke

            // opret nyt plankton-element
            const p = document.createElement('div');
            p.className = 'plankton';

            // placering tilfældigt indenfor gameArea
            const rect = gameArea.getBoundingClientRect();
            const margin = 30;
            const x = Math.floor(Math.random() * Math.max(0, rect.width - margin*2)) + margin;
            const y = Math.floor(Math.random() * Math.max(0, rect.height - margin*2)) + margin;

            p.style.left = x + 'px';
            p.style.top = y + 'px';
            p.style.position = 'absolute';

            gameArea.appendChild(p);


        // start interval for at spawn plankton
        spawnHandle = setInterval(spawnPlankton, spawnIntervalMs);

        // stop plankton interval hvis siden lukkes
        window.addEventListener('beforeunload', () => { if (spawnHandle) clearInterval(spawnHandle); 
        });

        // stop plankton spawner
       if (spawnHandle) clearInterval(spawnHandle);

      // vis score overlay
    const overlay = document.createElement('div');
    overlay.id = 'gameover-overlay';
    overlay.style.position = 'fixed';
    overlay.style.left = 0;
    overlay.style.top = 0;
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.7)';
    overlay.style.zIndex = 5000;
    overlay.innerHTML = `
        <div style="background:#fff;padding:30px;border-radius:12px;text-align:center;">
            <h1>GAME OVER</h1>
            <p>Plankton samlet: ${score}</p>
            <button id="restart-btn">Spil igen</button>
        </div>`;

    document.body.appendChild(overlay);


    }

    // close if(gameArea) and DOMContentLoaded
    }
});
