let currentIndex = 0;
let correctCount = 0;
let wrongCount = 0;
let data = [];

// JSON dosyasını yükleyip veriyi alıyoruz
fetch('data.json')
    .then(response => response.json())
    .then(jsonData => {
        data = shuffle(jsonData);
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
    document.getElementById('surah-info').textContent = 
        `Sure: ${currentData.sure_adi} - Ayet: ${currentData.ayet_no} - Kelime Sırası: ${currentData.kelime_sirasi}`;

    // Ses dosyasını okuma çubuğuna atıyoruz
    const audioPlayer = document.getElementById('audio-player');
    audioPlayer.src = currentData.sound_url;

    // Seçenekleri yükle
    const choicesContainer = document.getElementById('choices-container');
    choicesContainer.innerHTML = '';
    const choices = shuffle([currentData.turkish_meaning, ...getRandomWrongChoices()]);
    
    choices.forEach(choice => {
        const button = document.createElement('button');
        button.textContent = choice;
        button.classList.add('choice-button');
        button.onclick = () => handleChoice(button, choice, currentData.turkish_meaning);
        choicesContainer.appendChild(button);
    });

    document.getElementById('next-button').style.display = 'none';
}

function getRandomWrongChoices() {
    const wrongChoices = data
        .filter((_, index) => index !== currentIndex)
        .map(item => item.turkish_meaning);
    return shuffle(wrongChoices).slice(0, 3);
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
    document.querySelectorAll('.choice-button').forEach(choice => choice.disabled = true);

    if (selectedChoice === correctChoice) {
        correctCount++;
        displayResult('Doğru!', 'green');
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

function nextQuestion() {
    currentIndex++;
    if (currentIndex >= data.length) {
        alert('Oyun bitti!');
        currentIndex = 0;
        correctCount = 0;
        wrongCount = 0;
    }
    document.getElementById('result').textContent = '';
    document.getElementById('next-button').style.display = 'none';
    loadQuestion();
}

// Havai fişek efekti
const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = Math.random() * 6 + 3;
        this.speedX = (Math.random() - 0.5) * 4;
        this.speedY = (Math.random() - 0.5) * 4;
        this.alpha = 1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha -= 0.015;
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
    for (let i = 0; i < 40; i++) {
        particles.push(new Particle(x, y, colors[Math.floor(Math.random() * colors.length)]));
    }
}

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
