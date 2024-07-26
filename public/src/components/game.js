document.addEventListener('DOMContentLoaded', () => {
    const draggables = document.querySelectorAll('.draggable');
    const faceContainer = document.querySelector('.face-container');
    const validateButton = document.getElementById('validateButton');

    const urlParams = new URLSearchParams(window.location.search);
    const targetImageId = urlParams.get('id') || 'alegria'; // Default to 'alegria' if no param is provided

    // Mapeo de emociones a nombres
    const emotionNames = {
        alegria: "Alegría",
        enojo: "Enojo",
        miedo: "Miedo",
        tristeza: "Tristeza"
    };

    // Actualizar el contenido del elemento h2
    const emotionNameElement = document.getElementById('emotion-name');
    if (emotionNames[targetImageId]) {
        emotionNameElement.textContent = `Emoción: ${emotionNames[targetImageId]}`;
    } else {
        emotionNameElement.textContent = "Emoción: No especificada";
    }

    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', dragStart);
        draggable.addEventListener('dragend', dragEnd);
    });

    document.addEventListener('dragover', dragOver);
    document.addEventListener('drop', drop);

    validateButton.addEventListener('click', validateFace);

    function dragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.id);
        e.target.classList.add('dragging');
    }

    function dragEnd(e) {
        e.target.classList.remove('dragging');
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function drop(e) {
        e.preventDefault();
        const id = e.dataTransfer.getData('text');
        const draggable = document.getElementById(id);
        const offsetX = e.clientX - draggable.clientWidth / 2;
        const offsetY = e.clientY - draggable.clientHeight / 2;

        draggable.style.position = 'absolute';
        draggable.style.left = `${offsetX}px`;
        draggable.style.top = `${offsetY}px`;

        // Mostrar posición en tiempo real
        console.log(`${id} - Left: ${draggable.style.left}, Top: ${draggable.style.top}`);
    }

    function validateFace() {
        const parts = {
            'alegria': { left: 80, top: 50 },
            'enojo': { left: 100, top: 90 },
            'miedo': { left: 100, top: 90 },
            'tristeza': { left: 90, top: 70 }
        };

        // Define the tolerance range in pixels
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

        // Check if the part is within the tolerance range and inside the face container
        if (
            Math.abs(left - targetPosition.left) > tolerance ||
            Math.abs(top - targetPosition.top) > tolerance ||
            rect.left < parentRect.left || rect.right > parentRect.right ||
            rect.top < parentRect.top || rect.bottom > parentRect.bottom
        ) {
            correct = false;
        }

        // Check if there are any incorrect parts inside the face container
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

        // Reset message visibility
        successMessage.classList.remove('show');
        errorMessage.classList.remove('show');
        overlay.classList.remove('show');

        if (correct) {
            showConfetti();
            successMessage.classList.add('show');
            overlay.classList.add('show');
            setTimeout(() => {
                successMessage.classList.remove('show');
                overlay.classList.remove('show');
            }, 3000); // Mostrar el mensaje por 3 segundos
        } else {
            errorMessage.classList.add('show');
            overlay.classList.add('show');
            setTimeout(() => {
                errorMessage.classList.remove('show');
                overlay.classList.remove('show');
            }, 3000); // Mostrar el mensaje por 3 segundos
        }
    }

    function showConfetti() {
        // Asegúrate de que solo haya un solo canvas de confeti en el DOM
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
            particleCount: 500, // Incrementar la cantidad de confeti
            spread: 90,
            origin: { y: 0.6 }
        });
    }
});
