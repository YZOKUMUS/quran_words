let currentIndex = 0;
let correctCount = 0;
let wrongCount = 0;
let data = [];

// JSON dosyasını yükleyip veriyi alıyoruz
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

    // Ses dosyasının yolunu dinamik olarak güncelle
    const audioPlayer = document.getElementById('audio-player');
    audioPlayer.src = currentData.sound_url; // JSON'dan ses URL'si al

    // Seçenekleri yükle
    const choicesContainer = document.getElementById('choices-container');
    choicesContainer.innerHTML = ''; // Önceki seçenekleri temizle
    const choices = shuffle([currentData.turkish_meaning, ...getRandomWrongChoices()]);
    choices.forEach(choice => {
        const button = document.createElement('button');
        button.textContent = choice;
        button.classList.add('choice-button');
        button.onclick = () => handleChoice(button, choice, currentData.turkish_meaning);
        choicesContainer.appendChild(button);
    });

    // Sonraki butonunu gizle
    document.getElementById('next-button').style.display = 'none';
}

function getRandomWrongChoices() {
    const wrongChoices = data
        .filter((_, index) => index !== currentIndex)
        .map(item => item.turkish_meaning);
    return shuffle(wrongChoices).slice(0, 3); // 3 yanlış cevap seçiyoruz
}


function playAudio() {
    const audioPlayer = document.getElementById('audio-player');
    audioPlayer.play()
        .then(() => {
            console.log('Ses başarıyla çalındı');
        })
        .catch(error => {
            console.error('Ses çalınamadı:', error);
        });
}

function updateScore(correct, wrong) {
    document.getElementById('correct-count').textContent = correct;
    document.getElementById('wrong-count').textContent = wrong;
}

function displayResult(resultText, resultColor) {
    const resultElement = document.getElementById('result');
    resultElement.textContent = resultText;
    resultElement.style.color = resultColor;
}

function handleChoice(button, selectedChoice, correctChoice) {
    // Şıkları devre dışı bırak
    const allChoices = document.querySelectorAll('.choice-button');
    allChoices.forEach(choice => choice.disabled = true);

    if (selectedChoice === correctChoice) {
        correctCount++;
        displayResult('Doğru!', 'green');
    } else {
        wrongCount++;
        displayResult(`Yanlış! Doğru cevap: ${correctChoice}`, 'red');
    }

    // Puanları güncelle
    updateScore(correctCount, wrongCount);

    // Sonraki butonunu göster
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

    // Sonucu temizle
    const resultElement = document.getElementById('result');
    resultElement.textContent = ''; // Mesajı temizle
    resultElement.style.color = ''; // Rengi sıfırla

    document.getElementById('next-button').style.display = 'none';
    loadQuestion();
}
