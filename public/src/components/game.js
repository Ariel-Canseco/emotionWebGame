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

    // Mapeo de emociones a nombres, colores de fondo y colores de texto
    const emotionDetails = {
        alegria: { name: "Alegría", color: "#ffeb3b", textColor: "#000000" },
        enojo: { name: "Enojo", color: "#f44336", textColor: "#000000" },
        miedo: { name: "Miedo", color: "#9c27b0", textColor: "#ffffff" },
        tristeza: { name: "Tristeza", color: "#2196f3", textColor: "#ffffff" }
    };

    // Actualizar el contenido, color de fondo y color de texto del elemento h2
    const emotionNameElement = document.getElementById('emotion-name');
    const emotionDetail = emotionDetails[targetImageId] || { name: "No especificada", color: "#ffffff", textColor: "#000000" };
    
    emotionNameElement.textContent = `Emoción: ${emotionDetail.name}`;
    emotionNameElement.style.backgroundColor = emotionDetail.color;
    emotionNameElement.style.color = emotionDetail.textColor; // Cambiar el color del texto

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

        const faceRect = faceContainer.getBoundingClientRect();

        // Coordenadas de las posiciones esperadas para las partes de la cara
        const parts = {
            'alegria': { left: 972, top: 270 },
            'enojo': { left: 972, top: 270 },
            'miedo': { left: 972, top: 270 },
            'tristeza': { left: 972, top: 270 },
        };

        // Coordenadas donde se suelta la parte
        const offsetX = e.clientX - draggable.clientWidth / 2;
        const offsetY = e.clientY - draggable.clientHeight / 2;

        // Verificar si se suelta dentro del contenedor de la cara
        if (
            e.clientX > faceRect.left && e.clientX < faceRect.right &&
            e.clientY > faceRect.top && e.clientY < faceRect.bottom
        ) {
            const targetPosition = parts[id];
            if (targetPosition) {
                draggable.style.position = 'absolute';
                draggable.style.left = `${faceRect.left + targetPosition.left - faceContainer.offsetLeft}px`;
                draggable.style.top = `${faceRect.top + targetPosition.top - faceContainer.offsetTop}px`;
            } else {
                draggable.style.position = 'absolute';
                draggable.style.left = `${offsetX}px`;
                draggable.style.top = `${offsetY}px`;
            }
        } else {
            draggable.style.position = 'absolute';
            draggable.style.left = `${offsetX}px`;
            draggable.style.top = `${offsetY}px`;
        }

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

        // Deshabilitar botones y enlaces
        disableLinks(true);

        if (correct) {
            showConfetti();
            victorySound.play();  // Reproduce el sonido de victoria
            successMessage.classList.add('show');
            overlay.classList.add('show');
            setTimeout(() => {
                successMessage.classList.remove('show');
                overlay.classList.remove('show');
                // Habilitar botones y enlaces después de la animación de éxito
                disableLinks(false);
            }, 9500); // Mostrar el mensaje de éxito por 7 segundos
        } else {
            failureSound.play();  // Reproduce el sonido de fracaso
            errorMessage.classList.add('show');
            overlay.classList.add('show');
            setTimeout(() => {
                errorMessage.classList.remove('show');
                overlay.classList.remove('show');
                // Habilitar botones y enlaces después de la animación de fracaso
                disableLinks(false);
            }, 3000); // Mostrar el mensaje de fracaso por 3 segundos
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
            particleCount: 1500, // Incrementar la cantidad de confeti
            spread: 160, // Ajustar la dispersión para mayor efecto
            origin: { y: 0.6 },
            zIndex: 9999 // Asegúrate de que el confeti esté siempre en la parte superior
        });

        setTimeout(() => {
            canvas.remove();
        }, 7000); // Duración del confeti
    }

    // Función para habilitar o deshabilitar los enlaces
    function disableLinks(disable) {
        const links = document.querySelectorAll('#validateButton, #backButton, #mainButton');
        links.forEach(link => {
            if (disable) {
                link.classList.add('disabled');
                link.addEventListener('click', preventDefault, true); // Prevenir clics
            } else {
                link.classList.remove('disabled');
                link.removeEventListener('click', preventDefault, true); // Permitir clics
            }
        });
    }

    function preventDefault(e) {
        e.preventDefault();
    }

    // Script para ajustar dinámicamente el enlace de regreso
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
