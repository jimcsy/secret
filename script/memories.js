// CONFIG - Edit your comments here!
        const myPhotos = [
            { src: "images/image1.jpg", text: "Ako ang iyong pahing >_<" },
            { src: "images/image2.jpg", text: "Deserve mo yan ganda" },
            { src: "images/image3.jpg", text: "Wehoo Tagaytay" },
            { src: "images/image4.jpg", text: "Parang movie lang" },
            { src: "images/image5.jpg", text: "Bagay na bagay" },
            { src: "images/image6.jpg", text: "FAV PIC" },
            { src: "images/image7.jpg", text: "Binondo" },
            { src: "images/image8.jpg", text: "Dito nawala phone ko HAHSHA" },
            { src: "images/image9.jpg", text: "So prettyyy babyy" },
            { src: "images/image10.jpg", text: "More walking wit u" }
        ];
        
        let collectedCount = 0;
        const totalPhotos = myPhotos.length;

        const loader = document.getElementById('loader');
        const photoContainer = document.getElementById('photo-container');
        const chestContainer = document.getElementById('chest-container');
        const chestImg = document.getElementById('chest-img');
        const progressBar = document.getElementById('progress-bar');
        const instructionText = document.querySelector('.instruction-text');

        window.onload = function() {
            setTimeout(() => {
                loader.style.display = 'none';
                progressBar.style.display = 'block';
                startPhotoDump();
            }, 2000);
        };

        function startPhotoDump() {
            myPhotos.forEach((photoObj, index) => {
                setTimeout(() => { createDraggablePhoto(photoObj, index); }, index * 200);
            });
            setTimeout(() => {
                chestContainer.classList.add('show');
                // Fade in the instruction text at the top
                setTimeout(() => { instructionText.style.opacity = '1'; }, 1000);
            }, myPhotos.length * 200 + 500);
        }

        function createDraggablePhoto(photoObj, index) {
            const wrapper = document.createElement('div');
            wrapper.className = 'photo-wrapper';
            
            const comment = document.createElement('div');
            comment.className = 'comment-popup';
            comment.innerText = photoObj.text;
            
            const img = document.createElement('img');
            img.src = photoObj.src;
            
            wrapper.appendChild(comment);
            wrapper.appendChild(img);
            
            // Random position logic
            const randomX = Math.random() * (window.innerWidth - 250) + 125; 
            const randomY = Math.random() * (window.innerHeight * 0.6) + 100;
            const randomRot = (Math.random() * 30) - 15;
            
            wrapper.style.left = randomX + 'px';
            wrapper.style.top = randomY + 'px';
            wrapper.style.setProperty('--rotation', randomRot + 'deg');
            wrapper.style.zIndex = 100 + index;
            
            addDragLogic(wrapper);
            photoContainer.appendChild(wrapper);
            setTimeout(() => { wrapper.classList.add('visible'); }, 50);
        }

        function addDragLogic(el) {
            let isDragging = false;
            let startX, startY, initialLeft, initialTop;

            el.addEventListener('mousedown', startDrag);
            el.addEventListener('touchstart', startDrag, {passive: false});

            function startDrag(e) {
                e.preventDefault();
                isDragging = true;
                el.classList.add('dragging');
                const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
                const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
                startX = clientX; startY = clientY;
                initialLeft = parseFloat(el.style.left); initialTop = parseFloat(el.style.top);
                document.addEventListener('mousemove', moveDrag);
                document.addEventListener('mouseup', endDrag);
                document.addEventListener('touchmove', moveDrag, {passive: false});
                document.addEventListener('touchend', endDrag);
            }

            function moveDrag(e) {
                if (!isDragging) return;
                const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
                const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
                el.style.left = `${initialLeft + (clientX - startX)}px`;
                el.style.top = `${initialTop + (clientY - startY)}px`;
            }

            function endDrag() {
                if (!isDragging) return;
                isDragging = false;
                el.classList.remove('dragging');
                document.removeEventListener('mousemove', moveDrag);
                document.removeEventListener('mouseup', endDrag);
                document.removeEventListener('touchmove', moveDrag);
                document.removeEventListener('touchend', endDrag);
                
                if (checkCollision(el, chestImg)) { collectPhoto(el); } 
                else { el.style.transform = `translate(-50%, -50%) scale(1) rotate(${el.style.getPropertyValue('--rotation')})`; }
            }
        }

        function checkCollision(draggedEl, targetEl) {
            const r1 = draggedEl.getBoundingClientRect();
            const r2 = targetEl.getBoundingClientRect();
            return !(r1.right < r2.left || r1.left > r2.right || r1.bottom < r2.top || r1.top > r2.bottom);
        }

        function collectPhoto(el) {
            const chestRect = chestImg.getBoundingClientRect();
            el.style.left = (chestRect.left + chestRect.width / 2) + 'px';
            el.style.top = (chestRect.top + chestRect.height / 2) + 'px';
            el.classList.add('collected');
            collectedCount++;
            progressBar.innerText = `${collectedCount} / ${totalPhotos}`;
            chestImg.style.transform = "scale(1.2)";
            setTimeout(() => chestImg.style.transform = "scale(1)", 200);
            if (collectedCount === totalPhotos) { setTimeout(winGame, 800); }
        }

        function winGame() {
            instructionText.innerText = "All memories safe! ❤️";
            progressBar.classList.add('fade-out');
            photoContainer.classList.add('fade-out');
            chestContainer.classList.add('transitioning');
            
            setTimeout(() => {
                document.body.classList.add('pink-mode');
                instructionText.style.opacity = '0';
            }, 500);

            setTimeout(() => {
                chestContainer.style.bottom = "50%"; 
                chestContainer.style.transform = "translate(-50%, 50%) scale(1.5)";
            }, 800);
            
            setTimeout(() => {
                sessionStorage.setItem('chestTransition', 'true');
                window.location.href = 'letter.html';
            }, 3000);
        }