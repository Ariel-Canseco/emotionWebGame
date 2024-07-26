<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="../styles/game.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css">
    <title>Emotion Matching Game</title>
</head>
<body>
    <div class="instructions-container">
        <h2>Instrucciones para jugar</h2>
        <p>Arrastra las partes del rostro a la posición correcta en el rostro vacío según la emoción que hayas escogido. Cuando termines, presiona "Finalizar" para validar si las colocaste correctamente. ¡Buena suerte!</p>
    </div>
    <div class="game-container">
        <div class="demo">
            <h2 id="emotion-name">Emoción:</h2>
        </div>
        <div class="face-container">
            <img src="../img/3.png" alt="Rostro Vacío" id="empty-face">
        </div>
        <div class="parts-container">
            <img src="../img/4.png" alt="Alegría" class="draggable" id="alegria">
            <img src="../img/6.png" alt="Enojo" class="draggable" id="enojo">
            <img src="../img/7.png" alt="Miedo" class="draggable" id="miedo">
            <img src="../img/5.png" alt="Tristeza" class="draggable" id="tristeza">
        </div>
        <button id="validateButton">Finalizar</button>
    </div>
    <div class="message-overlay">
        <div class="success-message">¡Felicidades, has completado el rostro correctamente!</div>
        <div class="error-message">Lo siento, no has colocado la parte correctamente.</div>
    </div>
    <script src="../src/components/game.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.7.0/dist/confetti.browser.min.js"></script>
</body>
</html>
