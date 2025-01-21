let currentIndex = 0;
let data = [];

fetch('data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Veri yüklenemedi');
        }
        return response.json();
    })
    .then(jsonData => {
        data = jsonData;
        shuffle(data);
        loadQuestion();
    })
    .catch(error => {
        console.error('Hata:', error);
        document.getElementById('game-container').innerHTML = '<p>Veri yüklenirken bir hata oluştu.</p>';
    });

function loadQuestion() {
    const currentData = data[currentIndex];
    document.getElementById('arabic-word').textContent = currentData.arabic_word;

    const choicesContainer = document.getElementById('choices-container');
    choicesContainer.innerHTML = '';

    const correctChoice = currentData.turkish_meaning;
    const wrongChoices = getRandomWrongChoices(currentIndex);
    const choices = shuffle([correctChoice, ...wrongChoices]);

    choices.forEach(choice => {
        const button = document.createElement('button');
        button.textContent = choice;
        button.onclick = () => checkAnswer(choice);
        choicesContainer.appendChild(button);
    });

    document.getElementById('result').textContent = '';
    document.getElementById('next-button').style.display = 'none';

    // Enable cursor when loading a new question
    enableCursor();
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function getRandomWrongChoices(currentIndex) {
    const wrongChoices = data
        .filter((_, index) => index !== currentIndex)
        .map(item => item.turkish_meaning);

    const randomWrongChoices = [];
    while (randomWrongChoices.length < Math.min(3, wrongChoices.length)) {
        const randomChoice = wrongChoices[Math.floor(Math.random() * wrongChoices.length)];
        if (!randomWrongChoices.includes(randomChoice)) {
            randomWrongChoices.push(randomChoice);
        }
    }
    return randomWrongChoices;
}

function playAudio() {
    const audio = new Audio(data[currentIndex].sound_url);
    audio.play().catch(error => {
        console.error('Ses çalınamadı:', error);
        alert('Ses çalınırken bir hata oluştu.');
    });
}

// Disable cursor when a choice is selected
function disableCursor() {
    document.body.classList.add('cursor-disabled');
}

// Enable cursor after answering
function enableCursor() {
    document.body.classList.remove('cursor-disabled');
}

function checkAnswer(selectedChoice) {
    const result = document.getElementById('result');
    const correctAnswer = data[currentIndex].turkish_meaning;

    // Disable cursor while processing the answer
    disableCursor();

    document.querySelectorAll('#choices-container button').forEach(button => {
        button.disabled = true;
        button.style.cursor = 'default'; // Remove pointer cursor

        if (button.textContent === correctAnswer) {
            button.style.backgroundColor = 'green';
            button.style.color = 'white';
        }

        if (button.textContent === selectedChoice) {
            button.style.border = '2px solid black';
            button.style.fontWeight = 'bold';
        } else {
            button.style.opacity = 0.6;
        }
    });

    result.textContent = selectedChoice === correctAnswer ? 'Doğru!' : `Yanlış! Doğru cevap: "${correctAnswer}"`;
    result.style.color = selectedChoice === correctAnswer ? 'green' : 'red';

    document.getElementById('next-button').style.display = 'block';
}

function nextQuestion() {
    currentIndex++;
    if (currentIndex >= data.length) {
        document.getElementById('game-container').innerHTML = `
            <h1>Oyun Bitti!</h1>
            <p>Tüm soruları tamamladınız.</p>
            <button onclick="restartGame()">Yeniden Başla</button>
        `;
    } else {
        loadQuestion();
    }
}

function restartGame() {
    currentIndex = 0;
    shuffle(data);
    loadQuestion();
}
