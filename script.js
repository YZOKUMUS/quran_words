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
    const allChoices = document.querySelectorAll('.choice-button');
    allChoices.forEach(choice => choice.disabled = true);

    if (selectedChoice === correctChoice) {
        correctCount++;
        displayResult('Doğru!', 'green');
        showFireworks(); // ✨ Havai fişek efekti ekle ✨
    } else {
        wrongCount++;
        displayResult(`Yanlış! Doğru cevap: ${correctChoice}`, 'red');
    }

    updateScore(correctCount, wrongCount);
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
function showFireworks() {
    const container = document.getElementById('arabic-word-container');

    for (let i = 0; i < 8; i++) { // Daha fazla parçacık ekleyelim
        const firework = document.createElement('div');
        firework.classList.add('firework');

        // Rastgele konum belirleyelim
        firework.style.left = `${Math.random() * 80 + 10}%`; // Daha geniş alan
        firework.style.top = `${Math.random() * 60 + 20}%`; 

        // Renkleri çeşitlendirelim
        const colors = ['gold', 'orange', 'red', 'yellow'];
        firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        container.appendChild(firework);

        // Efekti biraz daha uzun tutalım (1.2s sürecek)
        setTimeout(() => firework.remove(), 1200);
    }
}

const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Parçacık sınıfı
class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 6 + 3; // Daha büyük parçacıklar
        this.speedX = (Math.random() - 0.5) * 4; // Daha yavaş hareket
        this.speedY = (Math.random() - 0.5) * 4;
        this.alpha = 1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= 0.015; // Daha yavaş kaybolsun
    }

    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

let particles = [];

function showFireworks(x, y) {
    const colors = ["#ff0000", "#ff8000", "#ffff00", "#00ff00", "#00ffff", "#0000ff", "#8000ff"];

    for (let i = 0; i < 40; i++) { // Daha fazla parçacık
        particles.push(new Particle(x, y, colors[Math.floor(Math.random() * colors.length)]));
    }
}

// Animasyon döngüsü
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle, index) => {
        particle.update();
        particle.draw();
        if (particle.alpha <= 0) particles.splice(index, 1);
    });
}

animate();

// Efekti doğru cevapta çağır
function handleChoice(button, selectedChoice, correctChoice) {
    const allChoices = document.querySelectorAll('.choice-button');
    allChoices.forEach(choice => choice.disabled = true);

    if (selectedChoice === correctChoice) {
        correctCount++;
        displayResult('Doğru!', 'green');

        // Efekti kelimenin üzerinde başlat
        const wordElement = document.getElementById("arabic-word");
        const rect = wordElement.getBoundingClientRect();
        showFireworks(rect.left + rect.width / 2, rect.top + rect.height / 2);
    } else {
        wrongCount++;
        displayResult(`Yanlış! Doğru cevap: ${correctChoice}`, 'red');
    }

    updateScore(correctCount, wrongCount);
    document.getElementById('next-button').style.display = 'block';
}
// Tıklama sesi için yeni ses öğesi
const clickSound = new Audio("click.mp3");

function handleChoice(button, selectedChoice, correctChoice) {
    // Tıklama sesini çal
    clickSound.play().catch(error => console.error("Ses çalınamadı:", error));

    // Tüm şıkları devre dışı bırak
    const allChoices = document.querySelectorAll('.choice-button');
    allChoices.forEach(choice => choice.disabled = true);

    if (selectedChoice === correctChoice) {
        correctCount++;
        displayResult('Doğru!', 'green');

        // Havai fişek efekti
        const wordElement = document.getElementById("arabic-word");
        const rect = wordElement.getBoundingClientRect();
        showFireworks(rect.left + rect.width / 2, rect.top + rect.height / 2);
    } else {
        wrongCount++;
        displayResult(`Yanlış! Doğru cevap: ${correctChoice}`, 'red');
    }

    // Puanları güncelle
    updateScore(correctCount, wrongCount);

    // Sonraki butonunu göster
    document.getElementById('next-button').style.display = 'block';
}
