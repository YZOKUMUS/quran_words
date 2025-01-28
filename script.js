let currentIndex = 0;
let correctCount = 0;
let wrongCount = 0;
let data = [];

fetch('data.json')
    .then(response => {
        if (!response.ok) throw new Error('Veri yüklenemedi');
        return response.json();
    })
    .then(jsonData => {
        data = jsonData;
        shuffle(data);
        loadQuestion();
    })
    .catch(error => console.error('Hata:', error));

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function loadQuestion() {
    const currentData = data[currentIndex];
    document.getElementById('arabic-word').textContent = currentData.arabic_word;
    document.getElementById('surah-info').textContent = `Sure: ${currentData.sure_adi} - Ayet: ${currentData.ayet_no} - Kelime Sırası: ${currentData.kelime_sirasi}`;

    const choicesContainer = document.getElementById('choices-container');
    choicesContainer.innerHTML = '';
    const choices = shuffle([currentData.turkish_meaning, ...getRandomWrongChoices()]);
    choices.forEach(choice => {
        const button = document.createElement('button');
        button.textContent = choice;
        button.onclick = () => checkAnswer(choice, currentData.turkish_meaning);
        choicesContainer.appendChild(button);
    });
}


function getRandomWrongChoices() {
    const wrongChoices = data
        .filter((_, index) => index !== currentIndex)
        .map(item => item.turkish_meaning);
    return shuffle(wrongChoices).slice(0, 2);
}

function checkAnswer(selectedChoice, correctChoice) {
    const resultElement = document.getElementById('result');
    if (selectedChoice === correctChoice) {
        correctCount++;
        resultElement.textContent = 'Doğru!';
        resultElement.style.color = 'green';
    } else {
        wrongCount++;
        resultElement.textContent = `Yanlış! Doğru cevap: ${correctChoice}`;
        resultElement.style.color = 'red';
    }
    document.getElementById('correct-count').textContent = correctCount;
    document.getElementById('wrong-count').textContent = wrongCount;
    document.getElementById('next-button').style.display = 'block';
}

function nextQuestion() {
    currentIndex++;
    if (currentIndex >= data.length) {
        alert('Oyun bitti!');
        currentIndex = 0;
        correctCount = 0;
        wrongCount = 0;
    }
    document.getElementById('next-button').style.display = 'none';
    loadQuestion();
}
