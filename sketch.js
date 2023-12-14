let currentIndex = 0;
let cells = [];
let cellSize = 100;
let catImgs = [];
let gameStatus = "before";
let startBtn, trueBtn, falseBtn;
let answering = false;
let diedCatImage, welcome, successImg, answeringImg;

// four question i'm using for each question page
// true -> left, false -> right
let questions = [
  { title: "Are Cats Cute?", left: "Yes",right: "No",answer: true, },
  {title: "How often do u want to feed your cat?",
    left: "twice a day",right: "once a year",
    answer: true,
  },
  {title: "what do u want to feed your cat?",
    left: "Regular cat food",
    right: "chocolate(poisonous for cats)",
    answer: true,
  },
  {title: "what do u want to offer ur cat to drink?",
    left: "special cat milk, goal milk, almond milk",
    right: "coffee(poisonous for cats)",
    answer: true,
  },
];
//load the images for project
function preload() {
  catImgs[0] = loadImage("catpage1.png");
  catImgs[1] = loadImage("cat2.png");
  catImgs[2] = loadImage("cat3.png");
  diedCatImage = loadImage("deadcat.jpg");
  welcome = loadImage("welcome.png");
  successImg = loadImage("cat4.png");
  answeringImg = loadImage("cat5.png");
}
//create buttons, set up te canvas, and present welcome page
function setup() {
  //framerate(1);
  createCanvas(800, 600);
  textAlign(CENTER);
  //clickstart to start playing and button dissapear afterwards
  startBtn = createButton("Start");
  startBtn.position(width / 2 - 50, 400);
  startBtn.mousePressed(startGame);
  //create the button that has the right answers
  trueBtn = createButton("rightanswerBtn");
  trueBtn.position(width / 2 - 200, 300);
  trueBtn.mousePressed(() => {
    let q = questions[currentIndex];
    if (q.answer) {
      hanldeTrue();
    } else {
      hanldeFalse();
    }
  });
  trueBtn.position(-1000, -300);
  //create the button that has the wrong answers
  falseBtn = createButton("wronganswerBtn");
  falseBtn.position(width / 2 + 100, 300);
  falseBtn.mousePressed(() => {
    let q = questions[currentIndex];
    if (!q.answer) {
      hanldeTrue();
    } else {
      hanldeFalse();
    }
  });
  falseBtn.position(-1000, -300);
}
//if the answer is correct, go to the next level of match 3
function hanldeTrue() {
  if (currentIndex == questions.length - 1) {
    gameStatus = "success";
  } else {
    currentIndex = currentIndex + 1;
    answering = false;
    match3();
  }
  falseBtn.position(-1000, -300);
  trueBtn.position(-1000, -300);
}
//game end if wrong answers
function hanldeFalse() {
  gameStatus = "end";
  falseBtn.position(-1000, -300);
  trueBtn.position(-1000, -300);
}
//first level after game start
function startGame() {
  match3();
  gameStatus = "playing";
  startBtn.position(-1000, -300);
}

function draw() {
  background(255);
  //displaythe welcome pic as background
  if (gameStatus == "before") {
    image(welcome,width/2-welcome.width/2,height/2-welcome.height/2);
    fill(0);
    textSize(32);
    text("Save the Cats!!", 0, 100, width, 40);
    textSize(22);
    text("Instructions: match 3 cats in a row and", 0, 200, width, 40);
    text("answer the question right!", 0, 250, width, 40);
    fill(255, 100, 100);
    text(
      "Be careful! life is fragile, you don't get to restart",
      0,300,width,40);
  } else if (gameStatus == "playing") {
    if (answering) {
      drawQuestion();
    } else {
      for (let i = 0; i < cells.length; i++) {
        cells[i].display();
      }
    }
  } else if (gameStatus == "end") {
    fill(0);
    textSize(32);
    image(diedCatImage, width / 2 - 75, 100, 150, 150);
    text("TERRIBLE cat owner!", 0, 50, width, 40);
    text("Don't ever get a cat!", 0, 250, width, 40);
  } else if (gameStatus == "success") {
    image(successImg, width / 2 - 144, height / 2 - 142, 288, 284);
    fill(0);
    textSize(32);
    text(" Congrats! ", 0, 100, width, 40);
    text("You save the Cat", 0, 450, width, 40);

  }
}

function drawQuestion() {
  image(answeringImg, width / 2 - 90, height / 2 - 135, 180, 278);
  let q = questions[currentIndex];
  fill(0);
  textSize(32);
  text(q.title, 0, 100, width, 40);
}

function match3() {
  cells = [];
  catImgs.sort(() => random() - 0.5);

  let rowCount;

if (currentIndex === 0) {
  rowCount = 3;
} else {
  rowCount = 4;
}

  let wh = rowCount * cellSize;
  let startX = width / 2 - wh / 2;
  let startY = height / 2 - wh / 2;

  for (let i = 0; i < rowCount; i++) {
    for (let j = 0; j < rowCount; j++) {
      cells.push(
        new Cell(
          createVector(startX + i * cellSize, startY + j * cellSize),
          cells.length
        )
      );
    }
  }
}

function mousePressed() {
  if (gameStatus == "playing") {
    for (let i = 0; i < cells.length; i++) {
      cells[i].clickMe();
    }
  }
}

class Cell {
  constructor(pos, index) {
    this.pos = pos;
    this.active = false; //not chosen
    this.index = index;
    if (this.index % 2 == 0) {
      this.imgIndex = (this.index + 1) % catImgs.length;
    } else {
      this.imgIndex = this.index % catImgs.length;
    }
  }

  display() {
    push();
    fill(255, 25, 0);
    translate(this.pos.x, this.pos.y);
    image(catImgs[this.imgIndex], 0, 0, cellSize, cellSize);
    noFill();
    //chosen cell red outline, not chosen black outline
    if (this.active) {
      stroke(255, 25, 0);
    } else {
      stroke(0);
    }
    rect(1, 1, cellSize - 2, cellSize - 2);
    pop();
  }
  //get the mouse position and trigger the exchange between the chosencell now and the one chosen before
  clickMe() {
    let x = mouseX;
    let y = mouseY;
    if (
      x >= this.pos.x &&
      x <= this.pos.x + cellSize &&
      y >= this.pos.y &&
      y <= this.pos.y + cellSize
    ) {
      this.active = true; //cell is chosen
      exchange(this.index);
    }
  }
}
//swap the pic in two chosen cell
function exchange(index) {
  let t;
  for (let i = 0; i < cells.length; i++) {
    if (index != i && cells[i].active) {
      //chosen cell
      t = cells[i].imgIndex;
      cells[i].imgIndex = cells[index].imgIndex; //swap the image
      cells[index].imgIndex = t;
      cells[i].active = false;
      cells[index].active = false; //deactivate the chosen staus
      checkCellStatus();
    }
  }
}

function checkCellStatus() {
  //for first level = 3cell/roll, for the rest =4cell/roll
  let rowCount;
  if (currentIndex === 0) {
    rowCount = 3;
  } else {
    rowCount = 4;
  }
  for (let i = 0; i < cells.length; i++) {
    let self = cells[i]; //chosen
    let top = cells[i - 1]; //above
    let bottom = cells[i + 1]; //below
    let left = cells[i - rowCount]; //left
    let right = cells[i + rowCount]; //right
    let b1 = false;
    //top = chosen = botton b1 set to true
    if (
      top &&bottom &&self.imgIndex === top.imgIndex &&
      self.imgIndex === bottom.imgIndex
    ) {
      b1 = true;
    }
    let b2 = false;
    //left = chosen = right b2 set to true
    if (left &&right &&self.imgIndex === left.imgIndex &&
      self.imgIndex === right.imgIndex) {
      b2 = true;
    }
    //b1 or b2 = true = match 3 = go to next question
    if (b1 == true || b2 == true) {
      //get the question for the current level
      let q = questions[currentIndex];
////Bt that hold the right answers
      trueBtn = createButton(q.left);
      trueBtn.position(width / 2 - 200, 300);
      trueBtn.mousePressed(() => {
        let q = questions[currentIndex];
        if (q.answer) {
          hanldeTrue();
        } else {
          hanldeFalse();
        }
      });
//Bt that hold the wrong answers
      falseBtn = createButton(q.right);
      falseBtn.position(width / 2 + 100, 300);
      falseBtn.mousePressed(() => {
        let q = questions[currentIndex];
        if (!q.answer) {
          hanldeTrue();
        } else {
          hanldeFalse();
        }
      });

      answering = true; //update the status of the current question to answering
    }
  }
}