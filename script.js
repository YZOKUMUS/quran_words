let currentIndex = 0;
let data = [];

fetch('data.json')
    .then(response => response.json())
    .then(jsonData => {
        data = jsonData;
        shuffle(data);
        loadQuestion();
    });

function loadQuestion() {
    const currentData = data[currentIndex];
    document.getElementById('arabic-word').textContent = currentData.arabic_word;

    const choicesContainer = document.getElementById('choices-container');
    choicesContainer.innerHTML = '';

    const correctChoice = currentData.turkish_meaning;
    const wrongChoices = getRandomWrongChoices(currentIndex);
    const choices = [correctChoice, ...wrongChoices];
    shuffle(choices);

    choices.forEach(choice => {
        const button = document.createElement('button');
        button.textContent = choice;
        button.onclick = () => checkAnswer(choice);
        choicesContainer.appendChild(button);
    });

    document.getElementById('result').textContent = '';
    document.getElementById('next-button').style.display = 'none';
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getRandomWrongChoices(currentIndex) {
    const wrongChoices = data
        .filter((_, index) => index !== currentIndex)
        .map(item => item.turkish_meaning);

    const randomWrongChoices = [];
    while (randomWrongChoices.length < 3) {
        const randomChoice = wrongChoices[Math.floor(Math.random() * wrongChoices.length)];
        if (!randomWrongChoices.includes(randomChoice)) {
            randomWrongChoices.push(randomChoice);
        }
    }
    return randomWrongChoices;
}

function playAudio() {
    const audio = new Audio(data[currentIndex].sound_url);
    audio.play();
}

function checkAnswer(selectedChoice) {
    const result = document.getElementById('result');
    if (selectedChoice === data[currentIndex].turkish_meaning) {
        result.textContent = 'Doğru!';
        result.style.color = 'green';
    } else {
        result.textContent = `Yanlış! Doğru cevap: "${data[currentIndex].turkish_meaning}"`;
        result.style.color = 'red';
    }
    document.getElementById('next-button').style.display = 'block';
}

function nextQuestion() {
    currentIndex++;
    if (currentIndex >= data.length) {
        document.getElementById('game-container').innerHTML = `
            <h1>Oyun Bitti!</h1>
            <p>Tüm soruları tamamladınız.</p>
        `;
    } else {
        loadQuestion();
    }
}
