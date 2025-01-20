let currentIndex = 0;
let data = []; // JSON verisini buraya alacağız

// JSON verisini al
fetch('data.json')
    .then(response => response.json())
    .then(jsonData => {
        data = jsonData;
        shuffle(data); // JSON verilerini karıştır
        loadQuestion();
    });

// Soruyu yükle
function loadQuestion() {
    const currentData = data[currentIndex];
    document.getElementById('arabic-word').textContent = currentData.arabic_word;

    const choicesContainer = document.getElementById('choices-container');
    choicesContainer.innerHTML = ''; // Önceki şıkları temizle

    // Doğru cevabı al
    const correctChoice = currentData.turkish_meaning;

    // Yanlış şıkları rastgele seç
    const wrongChoices = getRandomWrongChoices(currentIndex);

    // Doğru cevabı ve yanlış şıkları birleştir
    const choices = [correctChoice, ...wrongChoices];

    // Şıkları karıştır
    shuffle(choices);

    // Şıkları ekle
    choices.forEach(choice => {
        const choiceButton = document.createElement('button');
        choiceButton.textContent = choice;
        choiceButton.onclick = () => checkAnswer(choice);
        choicesContainer.appendChild(choiceButton);
    });

    // Sonuçları temizle
    document.getElementById('result').textContent = '';
    document.getElementById('next-button').style.display = 'none'; // Next butonunu gizle
}

// Şıkları karıştırma fonksiyonu
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Yanlış şıkları rastgele seçme fonksiyonu
function getRandomWrongChoices(currentIndex) {
    // Tüm kelimelerden doğru cevabı çıkararak yanlışları seçiyoruz
    const wrongChoices = data
        .filter((_, index) => index !== currentIndex)  // Şu anki doğru cevabı çıkart
        .map(item => item.turkish_meaning);  // Yalnızca Türkçe anlamları al

    // Yanlış şıklar için 3 rastgele seçenek al
    const randomWrongChoices = [];
    while (randomWrongChoices.length < 3) {
        const randomChoice = wrongChoices[Math.floor(Math.random() * wrongChoices.length)];
        if (!randomWrongChoices.includes(randomChoice)) {
            randomWrongChoices.push(randomChoice);
        }
    }

    return randomWrongChoices;
}

// Sesli okuma fonksiyonu
function playAudio() {
    const currentData = data[currentIndex];
    const audio = new Audio(currentData.sound_url);
    audio.play();
}

// Cevap kontrolü
function checkAnswer(selectedChoice) {
    const currentData = data[currentIndex];
    const result = document.getElementById('result');
    
    if (selectedChoice === currentData.turkish_meaning) {
        result.textContent = 'Doğru!';
    } else {
        result.textContent = `Maalesef, doğru cevap: "${currentData.turkish_meaning}" 😟`;
    }

    // Bir sonraki soruya geçmek için 1 saniye bekle
    setTimeout(nextQuestion, 1500); // 1000 ms = 1 saniye
}

// Bir sonraki soruya geç
function nextQuestion() {
    currentIndex++;
    if (currentIndex >= data.length) {
        alert("Oyun Bitti!");
    } else {
        loadQuestion(); // Yeni soruyu yükle
    }
}
