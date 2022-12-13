const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;

// Mảng chứa hình ảnh
const items = [
   { name: "bee", image: "bee.png" },
   { name: "crocodile", image: "crocodile.png" },
   { name: "macaw", image: "macaw.png" },
   { name: "gorilla", image: "gorilla.png" },
   { name: "tiger", image: "tiger.png" },
   { name: "monkey", image: "monkey.png" },
   { name: "chameleon", image: "chameleon.png" },
   { name: "piranha", image: "piranha.png" },
   { name: "anaconda", image: "anaconda.png" },
   { name: "sloth", image: "sloth.png" },
   { name: "cockatoo", image: "cockatoo.png" },
   { name: "toucan", image: "toucan.png" },
];

// Thời gian ban đầu
let seconds = 0,
   minutes = 0;
// Số nước đi ban đầu và số nước đi để thắng
let movesCount = 0,
   winCount = 0;

// Hẹn giờ
const timeGenerator = () => {
   seconds += 1;
   // Tính toán phút
   if (seconds >= 60) {
      minutes += 1;
      seconds = 0;
   }
   // Định dạng thời gian trước khi hiển thị
   let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
   let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
   timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};

// Tính toán số nước đi
const movesCounter = () => {
   movesCount += 1;
   moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};

// Chọn ngẫu nhiên hình ảnh từ mảng items
const generateRandom = (size = 4) => {
   let tempArray = [...items]; // Tạo một mảng tạm để lưu trữ các phần tử của mảng items
   let cardValues = []; // Mảng chứa các giá trị của các thẻ
   size = (size * size) / 2;
   // Chọn ngẫu nhiên các phần tử từ mảng items
   for (let i = 0; i < size; i++) {
      const randomIndex = Math.floor(Math.random() * tempArray.length);
      cardValues.push(tempArray[randomIndex]);
      // Phần tử sau khi được chọn sẽ bị xóa khỏi mảng tạm
      tempArray.splice(randomIndex, 1);
   }
   return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
   gameContainer.innerHTML = "";
   cardValues = [...cardValues, ...cardValues];
   // Xáo trộn mảng
   cardValues.sort(() => Math.random() - 0.5);
   for (let i = 0; i < size * size; i++) {
      gameContainer.innerHTML += `
      <div class="card-container" data-card-value="${cardValues[i].name}">
         <div class="card-before">?</div>
         <div class="card-after">
         <img src="${cardValues[i].image}" class="image"/></div>
         </div>
      `;
   }
   //Grid
   gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

   //Cards
   cards = document.querySelectorAll(".card-container");
   cards.forEach((card) => {
      card.addEventListener("click", () => {
         //Nếu thẻ đã được mở hoặc đã được ghép thì không thực hiện gì cả
         if (!card.classList.contains("matched")) {
            //Thẻ được lật khi người dùng click vào
            card.classList.add("flipped");
            if (!firstCard) {
               firstCard = card;
               firstCardValue = card.getAttribute("data-card-value");
            } else {
               //Tăng số lần di chuyển lên 1 khi người dùng click vào thẻ thứ 2
               movesCounter();
               secondCard = card;
               let secondCardValue = card.getAttribute("data-card-value");
               if (firstCardValue == secondCardValue) {
                  //Nếu hai thẻ trùng khớp thì thêm class matched và những thẻ này sẽ không thể được click vào nữa
                  firstCard.classList.add("matched");
                  secondCard.classList.add("matched");
                  firstCard = false;
                  //Điểm chiến thắng sẽ tăng lên 1 khi hai thẻ trùng khớp
                  winCount += 1;
                  if (winCount == Math.floor(cardValues.length / 2)) {
                     result.innerHTML = `<h2>You Won</h2>
            <h4>Moves: ${movesCount}</h4>`;
                     stopGame();
                  }
               } else {
                  //Nếu hai thẻ được lật không trùng khớp thì chúng sẽ được lật lại sau 900ms
                  let [tempFirst, tempSecond] = [firstCard, secondCard];
                  firstCard = false;
                  secondCard = false;
                  let delay = setTimeout(() => {
                     tempFirst.classList.remove("flipped");
                     tempSecond.classList.remove("flipped");
                  }, 900);
               }
            }
         }
      });
   });
};

//Start game
startButton.addEventListener("click", () => {
   movesCount = 0;
   seconds = 0;
   minutes = 0;
   controls.classList.add("hide");
   stopButton.classList.remove("hide");
   startButton.classList.add("hide");
   //Bắt đầu đếm thời gian
   interval = setInterval(timeGenerator, 1000);
   moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
   initializer();
});

//Stop game
stopButton.addEventListener(
   "click",
   (stopGame = () => {
      controls.classList.remove("hide");
      stopButton.classList.add("hide");
      startButton.classList.remove("hide");
      clearInterval(interval);
   })
);

const initializer = () => {
   result.innerText = "";
   winCount = 0;
   let cardValues = generateRandom();
   console.log(cardValues);
   matrixGenerator(cardValues);
};
