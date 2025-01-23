let currentIndex = 0;
let correctCount = 0;
let wrongCount = 0;
let data = [];

// Retrieve stored counters from localStorage, if available
if (localStorage.getItem('correctCount')) {
    correctCount = parseInt(localStorage.getItem('correctCount'));
}
if (localStorage.getItem('wrongCount')) {
    wrongCount = parseInt(localStorage.getItem('wrongCount'));
}

fetch('data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Veri yüklenemedi');
        }
        return response.json();
    })
    .then(jsonData => {
        if (!Array.isArray(jsonData) || jsonData.some(item => !item.arabic_word || !item.turkish_meaning)) {
            throw new Error('Geçersiz veri formatı.');
        }
        data = jsonData;
        shuffle(data);
        loadQuestion();
    })
    .catch(error => {
        console.error('Hata:', error);
        document.getElementById('game-container').innerHTML = '<p>Veri yüklenirken bir hata oluştu.</p>';
    });

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function loadQuestion() {
    const currentData = data[currentIndex];
    const arabicWordElement = document.getElementById('arabic-word');
    arabicWordElement.textContent = currentData.arabic_word;

    const choicesContainer = document.getElementById('choices-container');
    choicesContainer.innerHTML = '';

    const correctChoice = currentData.turkish_meaning;
    const wrongChoices = getRandomWrongChoices(currentIndex);
    const choices = shuffle([correctChoice, ...wrongChoices]);

    choices.forEach(choice => {
        const button = createButton(choice, arabicWordElement.offsetWidth);
        choicesContainer.appendChild(button);
    });

    document.getElementById('result').textContent = '';
    document.getElementById('next-button').style.display = 'none';

    enableCursor();

    // Update the score containers with stored values
    document.getElementById('correct-count').textContent = correctCount;
    document.getElementById('wrong-count').textContent = wrongCount;
}

function getRandomWrongChoices(currentIndex) {
    const wrongChoices = data
        .filter((_, index) => index !== currentIndex)
        .map(item => item.turkish_meaning);

    const shuffled = shuffle(wrongChoices);
    return shuffled.slice(0, Math.min(3, wrongChoices.length));
}

function playAudio() {
    const soundUrl = data[currentIndex].sound_url;
    if (!soundUrl) {
        alert('Bu soru için ses dosyası bulunamadı.');
        return;
    }
    const audio = new Audio(soundUrl);
    audio.play().catch(error => {
        console.error('Ses çalınamadı:', error);
        alert('Ses çalınırken bir hata oluştu.');
    });
}

function disableCursor() {
    document.getElementById('game-container').classList.add('cursor-disabled');
}

function enableCursor() {
    document.getElementById('game-container').classList.remove('cursor-disabled');
}

function checkAnswer(selectedChoice) {
    const result = document.getElementById('result');
    const correctAnswer = data[currentIndex].turkish_meaning;

    disableCursor();

    document.querySelectorAll('#choices-container button').forEach(button => {
        button.disabled = true;
        button.classList.add('disabled');

        if (button.textContent === correctAnswer) {
            button.classList.add('correct-answer');
        }

        if (button.textContent === selectedChoice) {
            button.classList.add('selected-choice');
        }
    });

    if (selectedChoice === correctAnswer) {
        correctCount++;
        result.textContent = 'Doğru!';
        result.style.color = 'green';
    } else {
        wrongCount++;
        result.textContent = `Yanlış! Doğru cevap: "${correctAnswer}"`;
        result.style.color = 'red';
    }

    // Update the score board dynamically
    document.getElementById('correct-count').textContent = correctCount;
    document.getElementById('wrong-count').textContent = wrongCount;

    // Store the updated counters in localStorage
    localStorage.setItem('correctCount', correctCount);
    localStorage.setItem('wrongCount', wrongCount);

    document.getElementById('next-button').style.display = 'block';
}

function nextQuestion() {
    currentIndex++;
    if (currentIndex >= data.length) {
        document.getElementById('game-container').innerHTML = `
            <h1>Oyun Bitti!</h1>
            <p>Doğru Cevaplar: ${correctCount}</p>
            <p>Yanlış Cevaplar: ${wrongCount}</p>
            <button onclick="restartGame()">Yeniden Başla</button>
        `;
    } else {
        loadQuestion();
    }
}

function restartGame() {
    currentIndex = 0;
    correctCount = 0;
    wrongCount = 0;
    // Clear localStorage if restarting
    localStorage.removeItem('correctCount');
    localStorage.removeItem('wrongCount');
    shuffle(data);
    loadQuestion();
}

function createButton(choice, width) {
    const button = document.createElement('button');
    button.textContent = choice;
    button.style.width = `${width}px`;
    button.style.marginTop = '15px';
    button.onclick = () => checkAnswer(choice);
    return button;
}
