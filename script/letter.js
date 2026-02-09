 window.onload = function() {
            const fromGame = sessionStorage.getItem('chestTransition');
            const chestWrapper = document.getElementById('chest-wrapper');
            
            if (fromGame) {
                // SEAMLESS ENTRY:
                sessionStorage.removeItem('chestTransition');
                
                // 1. Instant Pink Background & Visible Chest (No fade in)
                document.body.classList.add('pink-mode');
                chestWrapper.classList.add('from-game');
                startSolemnHearts();
                
                // 2. Wait a split second, then move chest right
                setTimeout(() => { chestWrapper.classList.add('move-right'); }, 500);
                
                // 3. Show UI
                setTimeout(() => {
                    document.getElementById('letter-container').classList.add('show');
                    document.getElementById('reveal-btn').classList.add('show');
                }, 2000);
            } else {
                // FRESH LOAD ENTRY:
                chestWrapper.classList.add('show'); // Fade in chest
                setTimeout(() => { document.body.classList.add('pink-mode'); startSolemnHearts(); }, 500);
                setTimeout(() => { chestWrapper.classList.add('move-right'); }, 2000);
                setTimeout(() => {
                    document.getElementById('letter-container').classList.add('show');
                    document.getElementById('reveal-btn').classList.add('show');
                }, 3500);
            }
        };

        // --- SCRATCH LOGIC ---
        const canvas = document.getElementById('scratch-canvas');
        const ctx = canvas.getContext('2d');
        const buttonsContainer = document.getElementById('hidden-buttons');
        let isDrawing = false, isRevealed = false;

        function initScratchCard() {
            ctx.fillStyle = '#C0C0C0'; ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#666'; ctx.font = 'bold 24px Arial'; ctx.textAlign = 'center';
            ctx.fillText("✨ Scratch Me! ✨", canvas.width/2, canvas.height/2);
            ctx.globalCompositeOperation = 'destination-out';
        }
        function openScratchCard() { initScratchCard(); document.getElementById('scratch-overlay').classList.add('visible'); }

        function getPosition(e) {
            const rect = canvas.getBoundingClientRect();
            return {
                x: (e.touches ? e.touches[0].clientX : e.clientX) - rect.left,
                y: (e.touches ? e.touches[0].clientY : e.clientY) - rect.top
            };
        }
        function scratch(e) {
            if (!isDrawing) return;
            e.preventDefault();
            const pos = getPosition(e);
            ctx.beginPath(); ctx.arc(pos.x, pos.y, 30, 0, Math.PI * 2); ctx.fill();
            if (!isRevealed && Math.random() > 0.8) checkPercentage();
        }
        function checkPercentage() {
            const data = ctx.getImageData(0,0,canvas.width,canvas.height).data;
            let clear=0;
            for(let i=3; i<data.length; i+=4) if(data[i]===0) clear++;
            if((clear/(data.length/4))*100 > 50) { isRevealed=true; buttonsContainer.classList.add('revealed'); }
        }

        canvas.addEventListener('mousedown', (e)=>{isDrawing=true; scratch(e)});
        canvas.addEventListener('mousemove', scratch);
        canvas.addEventListener('mouseup', ()=>{isDrawing=false; checkPercentage()});
        canvas.addEventListener('touchstart', (e)=>{isDrawing=true; scratch(e)});
        canvas.addEventListener('touchmove', scratch);
        canvas.addEventListener('touchend', ()=>{isDrawing=false; checkPercentage()});

        function moveButton(btn) {
            btn.style.transform = `translate(${(Math.random()*200)-100}px, ${(Math.random()*200)-100}px)`;
        }
        function sheSaidYes() { window.location.href = 'success.html'; }
        
        function startSolemnHearts() {
            setInterval(() => {
                const heart = document.createElement('div');
                heart.innerHTML = "❤️"; heart.classList.add('heart');
                heart.style.left = Math.random() * 100 + "vw";
                heart.style.animationDuration = Math.random() * 8 + 10 + "s";
                heart.style.fontSize = Math.random() * 40 + 40 + "px";
                document.body.appendChild(heart);
                setTimeout(() => heart.remove(), 18000);
            }, 800);
        }