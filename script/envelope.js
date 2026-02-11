let clickCount = 0;
        let wanderInterval;
        let currentScale = 0.4; // Start VERY small
        let moveSpeed = 800;    // Start Fast (800ms)

        const envelope = document.getElementById('envelope-wrapper');
        const tooltip = document.getElementById('tooltip');
        const bubble = document.getElementById('bubble');
        const memoryBtn = document.querySelector('.load-memories-btn');

        // --- STEP 1: START THE GAME ---
        function startGame() {
            bubble.classList.add('fade-out');
            envelope.style.opacity = '1';
            envelope.style.pointerEvents = 'auto'; 
            
            // Set initial scale
            envelope.style.transform = `scale(${currentScale})`;

            startWandering();
            setTimeout(() => {
                if(clickCount === 0) tooltip.style.opacity = '1';
            }, 2000);
        }

        // --- STEP 2: WANDERING LOGIC ---
        function startWandering() {
            moveRandomly(); 
            // Start interval based on moveSpeed
            wanderInterval = setInterval(moveRandomly, moveSpeed);
        }

        function moveRandomly() {
            // Random position between 5% and 85% to keep it on screen
            const randomTop = Math.floor(Math.random() * 80) + 5;
            const randomLeft = Math.floor(Math.random() * 80) + 5;
            
            envelope.style.top = randomTop + "%";
            envelope.style.left = randomLeft + "%";
        }

        // --- STEP 3: CLICK LOGIC (CHALLENGE MODE) ---
        function handleClick() {
            clickCount++;

            // If we haven't clicked 4 times yet...
            if (clickCount <= 3) {
                // 1. Reset the interval
                clearInterval(wanderInterval);

                // 2. Make it bigger!
                currentScale += 0.4; // 0.4 -> 0.6 -> 0.8 -> 1.0
                envelope.style.transform = `scale(${currentScale})`;

                // 3. Make it FASTER!
                moveSpeed -= 150; // 800 -> 600 -> 400 -> 200 (Super fast)
                
                // 4. Move immediately to a new spot (Dodge effect)
                moveRandomly();

                // 5. Update Tooltip
                const messages = ["HAHAHAHHAHA", "Isa pa", "Mabilis ba?"];
                if (clickCount <= messages.length) tooltip.innerText = messages[clickCount - 1];
                tooltip.style.opacity = '1';

                // 6. Restart movement with new INSANE speed
                wanderInterval = setInterval(moveRandomly, moveSpeed);
            } 
            else {
                // WIN!
                clearInterval(wanderInterval);
                openEnvelope();
            }
        }

        // --- STEP 4: OPEN & REVEAL BUTTON ---
        function openEnvelope() {
            document.body.classList.add('dimmed');
            envelope.classList.add('centered');
            
            // 1. Open the envelope after moving to center (1 sec delay)
            setTimeout(() => {
                envelope.classList.add('open');

                // 2. Wait 5 seconds AFTER opening, then show button
                setTimeout(() => {
                    memoryBtn.classList.add('visible');
                }, 3000);

            }, 1000);
        }