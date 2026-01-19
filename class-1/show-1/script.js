document.addEventListener('DOMContentLoaded', function() {
    // Get the predict button element
    const predictButton = document.getElementById('predict-button');
    
    // Add click event listener to the button
    predictButton.addEventListener('click', function() {
        // Generate a random number between 1 and 12
        const randomNumber = Math.floor(Math.random() * 12) + 1;
        
        // Determine the message to display
        let message;
        if (randomNumber === 1 || randomNumber === 2) {
            message = "Твоя наступна оцінка буде 12 в різні кліточки";
        } else {
            message = `Твоя наступна оцінка буде ${randomNumber}`;
        }
        
        // Display the message in an alert
        alert(message);
    });
});