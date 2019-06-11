//snake details constant
const GAME_SPEED = 100;
const CANVAS_BORDER_COLOUR = 'black';
const CANVAS_BACKGROUND_COLOUR = "white";
const SNAKE_COLOUR = 'darkgreen';
const SNAKE_BORDER_COLOUR = 'darkgreen';
const FOOD_COLOUR = 'red';
const FOOD_BORDER_COLOUR = 'darkred';
//where the snake starts
let snake = [
{x: 150, y: 150},
{x: 140, y: 150},
{x: 130, y: 150},
{x: 120, y: 150},
{x: 110, y: 150}
]

function playSound() {
  var audio = document.getElementById("audio");
  audio.play();
}

let dead = new Audio();
let eat = new Audio();
dead.src = "audio/gameover.wav";
eat.src = "audio/eat.wav";

// to implement score
let score = 0;
// when snake changes direction
let changingDirection = false;
// food x-coordinate
let foodX;
// food y-coordinate
let foodY;
// horizontal velocity
let dx = 10;
// vertical velocity
let dy = 0;
// get the canvas element
const gameCanvas = document.getElementById("gameCanvas");
// Return a two dimensional drawing context
const ctx = gameCanvas.getContext("2d");
// Create the first food location
createFood();
// call changeDirection whenever a key is pressed
document.addEventListener("keydown", changeDirection);

//main function of the game
function main() {
  // if the game ended return early to stop game
  if (didGameEnd()) return;
  setTimeout(function() {
    changingDirection = false;
    clearCanvas(); 
    drawFood();
    advanceSnake();
    drawSnake();
      // call game again
      main();
    }, GAME_SPEED);
}
function hide() {
  var x = document.getElementById("startGame");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}
/**
 * add canvas attributes to canvas
 */
function clearCanvas() {
//  select the colour to fill the drawing
ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
//  select the colour for the border of the canvas
ctx.strokestyle = CANVAS_BORDER_COLOUR;
// draw a "filled" rectangle to cover the entire canvas
ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
// draw a "border" around the entire canvas
ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}
/**
* function created to draw food on canvas
*/

function drawFood() {
var img = new Image();
img.src = "./images/apple.png";
ctx.drawImage(img, foodX, foodY, 10, 10);

}
/**
* advances the snake by changing the x-coordinates of its parts
* according to the horizontal velocity and the y-coordinates of its parts
* according to the vertical veolocity
*/
function advanceSnake() {
  // here we declare the new head +10 of the x-axis. it will keep growing to simulate movement
  const head = {x: snake[0].x + dx, y: snake[0].y + dy};
  // unshift pops the head on top of the snake array to make it the first array position i.e. [0]
  snake.unshift(head);
  // this runs a check when the snakes head intercepts with the food coordinates
  const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
  if (didEatFood) {
    // play eat sound 
    eat.play()
    // increase score
    score += 1;
    document.getElementById('score').innerHTML = score;
    // Generate new food location
    createFood();
  } else {
    // Remove the last part of snake body, to sim movement.
   snake.pop();
  }
}
/**
* conditions for game to end
*/
function didGameEnd() {
for (let i = 4; i < snake.length; i++) {
//if any part of the snakes head hit any part of the tail play functions. this is done via loops to check if any part of the body is hit
  if (snake[i].x === snake[0].x && snake[i].y === snake[0].y){
   dead.play();
   alert("GAME OVER!");
   location.reload();
 }
}
//if any part of the snakes head hit the 
if(snake[0].x < 0 || snake[0].x > gameCanvas.width - 10 || snake[0].y < 0 || snake[0].y > gameCanvas.height - 10){
 dead.play();
 alert("GAME OVER!")
 location.reload();
}
}
/**
* generates a random number that is a multiple of 10 given a minumum and a maximum number
*/
function randomTen(min, max) {
return Math.round((Math.random() * (max-min) + min) / 10) * 10;
}
/**
* creates random set of coordinates for the snake food.
*/
function createFood() {
foodX = randomTen(0, gameCanvas.width - 10);
foodY = randomTen(0, gameCanvas.height - 10);
// if the new food location is where the snake currently is, generate a new food location
snake.forEach(function isFoodOnSnake(part) {
  const foodIsoNsnake = part.x == foodX && part.y == foodY;
  if (foodIsoNsnake) createFood();
});
}
//draws the snake on the canvas
function drawSnake() {
// loop through the snake parts drawing each part on the canvas
snake.forEach(drawSnakePart)
}
function drawSnakePart(snakePart) {
// set the colour of the snake part
ctx.fillStyle = SNAKE_COLOUR;
// set the border colour of the snake part
ctx.strokestyle = SNAKE_BORDER_COLOUR;
// draw a "filled" rectangle to represent the snake part at the coordinates
// the part is located
ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
// draw a border around the snake part
ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}
function changeDirection(event) {
const LEFT_KEY = 65;
const RIGHT_KEY = 68;
const UP_KEY = 87;
const DOWN_KEY = 83;
/**
 * prevent the snake from reversing
 * If snake is moving to the right. User presses down and immediately left
 * and the snake immediately changes direction without taking a step down first
 */
 if (changingDirection) return;
 changingDirection = true;
 const keyPressed = event.keyCode;
 const goingUp = dy === -10;
 const goingDown = dy === 10;
 const goingRight = dx === 10;
 const goingLeft = dx === -10;
 if (keyPressed === LEFT_KEY && !goingRight) {
  dx = -10;
  dy = 0;
}
if (keyPressed === UP_KEY && !goingDown) {
  dx = 0;
  dy = -10;
}
if (keyPressed === RIGHT_KEY && !goingLeft) {
  dx = 10;
  dy = 0;
}

if (keyPressed === DOWN_KEY && !goingUp) {
  dx = 0;
  dy = 10;
}
}

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => console.log('~~~ Tuning in to the waves of port '+PORT+' ~~~'));
