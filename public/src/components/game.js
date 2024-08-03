document.addEventListener('DOMContentLoaded', () => {
    const draggables = document.querySelectorAll('.draggable');
    const faceContainer = document.querySelector('.face-container');
    const validateButton = document.getElementById('validateButton');
    const backButton = document.getElementById('backButton');
    const mainButton = document.getElementById('mainButton');

    const victorySound = document.getElementById('victory-sound');
    const failureSound = document.getElementById('failure-sound');

    const urlParams = new URLSearchParams(window.location.search);
    const targetImageId = urlParams.get('id') || 'alegria'; // Default to 'alegria' if no param is provided

    const emotionDetails = {
        alegria: { name: "Alegría", color: "#ffeb3b", textColor: "#000000" },
        enojo: { name: "Enojo", color: "#f44336", textColor: "#000000" },
        miedo: { name: "Miedo", color: "#9c27b0", textColor: "#ffffff" },
        tristeza: { name: "Tristeza", color: "#2196f3", textColor: "#ffffff" }
    };

    const emotionNameElement = document.getElementById('emotion-name');
    const emotionDetail = emotionDetails[targetImageId] || { name: "No especificada", color: "#ffffff", textColor: "#000000" };

    emotionNameElement.textContent = `Emoción: ${emotionDetail.name}`;
    emotionNameElement.style.backgroundColor = emotionDetail.color;
    emotionNameElement.style.color = emotionDetail.textColor;

    interact('.draggable')
        .draggable({
            listeners: {
                start(event) {
                    event.target.classList.add('dragging');
                },
                end(event) {
                    event.target.classList.remove('dragging');
                    // Make sure the element stays at its last position
                    event.target.style.transform = '';
                }
            }
        })
        .on('dragmove', function (event) {
            let x = (parseFloat(event.target.getAttribute('data-x')) || 0) + event.dx;
            let y = (parseFloat(event.target.getAttribute('data-y')) || 0) + event.dy;

            // Update the position of the element
            event.target.style.transform = `translate(${x}px, ${y}px)`;
            event.target.setAttribute('data-x', x);
            event.target.setAttribute('data-y', y);
        });

    interact('.face-container').dropzone({
        accept: '.draggable',
        overlap: 'pointer',
        ondrop: function (event) {
            const draggable = event.relatedTarget;
            // Ensure the draggable is appended to the container
            faceContainer.appendChild(draggable);
            // Reset position to the coordinates where it was dropped
            draggable.style.transform = '';
            draggable.style.position = 'absolute';
            draggable.style.left = `${event.clientX}px`;
            draggable.style.top = `${event.clientY}px`;
        }
    });

    validateButton.addEventListener('click', validateFace);

    restartButton.addEventListener('click', () => {
        location.reload(); // Reload the page
    });

    function validateFace() {
        const parts = {
            'alegria': { left: 80, top: 50 },
            'enojo': { left: 100, top: 90 },
            'miedo': { left: 100, top: 90 },
            'tristeza': { left: 90, top: 70 }
        };

        const tolerance = 180;

        let correct = true;

        const targetPosition = parts[targetImageId];
        if (!targetPosition) {
            console.error('Imagen objetivo no válida.');
            return;
        }

        const targetPart = document.getElementById(targetImageId);
        if (!targetPart) {
            console.error('No se encontró la imagen para validar.');
            return;
        }

        const rect = targetPart.getBoundingClientRect();
        const parentRect = faceContainer.getBoundingClientRect();
        const left = rect.left - parentRect.left + faceContainer.scrollLeft;
        const top = rect.top - parentRect.top + faceContainer.scrollTop;

        console.log(`${targetImageId} - Expected: Left: ${targetPosition.left}, Top: ${targetPosition.top}, Actual: Left: ${left}, Top: ${top}`);

        if (
            Math.abs(left - targetPosition.left) > tolerance ||
            Math.abs(top - targetPosition.top) > tolerance ||
            rect.left < parentRect.left || rect.right > parentRect.right ||
            rect.top < parentRect.top || rect.bottom > parentRect.bottom
        ) {
            correct = false;
        }

        draggables.forEach(draggable => {
            if (draggable.id !== targetImageId) {
                const draggableRect = draggable.getBoundingClientRect();
                if (
                    draggableRect.left >= parentRect.left && draggableRect.right <= parentRect.right &&
                    draggableRect.top >= parentRect.top && draggableRect.bottom <= parentRect.bottom
                ) {
                    correct = false;
                }
            }
        });

        const overlay = document.querySelector('.message-overlay');
        const successMessage = document.querySelector('.success-message');
        const errorMessage = document.querySelector('.error-message');

        successMessage.classList.remove('show');
        errorMessage.classList.remove('show');
        overlay.classList.remove('show');

        disableLinks(true);

        if (correct) {
            showConfetti();
            victorySound.play();
            successMessage.classList.add('show');
            overlay.classList.add('show');
            setTimeout(() => {
                successMessage.classList.remove('show');
                overlay.classList.remove('show');
                disableLinks(false);
            }, 9500);
        } else {
            failureSound.play();
            errorMessage.classList.add('show');
            overlay.classList.add('show');
            setTimeout(() => {
                errorMessage.classList.remove('show');
                overlay.classList.remove('show');
                disableLinks(false);
            }, 3000);
        }
    }

    function showConfetti() {
        const existingCanvas = document.querySelector('.confetti-canvas');
        if (existingCanvas) {
            existingCanvas.remove();
        }

        const canvas = document.createElement('canvas');
        canvas.classList.add('confetti-canvas');
        document.querySelector('.message-overlay').appendChild(canvas);

        const confetti = window.confetti.create(canvas, {
            resize: true,
            useWorker: true
        });

        confetti({
            particleCount: 1500,
            spread: 160,
            origin: { y: 0.6 },
            zIndex: 9999
        });

        setTimeout(() => {
            canvas.remove();
        }, 7000);
    }

    function disableLinks(disable) {
        const links = document.querySelectorAll('#validateButton, #backButton, #mainButton, #reiniciar');
        links.forEach(link => {
            if (disable) {
                link.classList.add('disabled');
                link.addEventListener('click', preventDefault, true);
            } else {
                link.classList.remove('disabled');
                link.removeEventListener('click', preventDefault, true);
            }
        });
    }

    function preventDefault(e) {
        e.preventDefault();
    }

    switch (targetImageId) {
        case 'alegria':
            backButton.href = '../pages/yellowPage.html';
            break;
        case 'enojo':
            backButton.href = '../pages/redPage.html';
            break;
        case 'miedo':
            backButton.href = '../pages/greenPage.html';
            break;
        case 'tristeza':
            backButton.href = '../pages/bluePage.html';
            break;
        default:
            backButton.href = '../../index.html';
    }
});
