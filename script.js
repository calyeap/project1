// var name = prompt("Hi there. Please enter your name?");
// if (name === "null") {
//   location.reload(); //name input for game
// }
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

// var backGrnd = new Audio ("audio/background.mp3");
// backGrnd.play();
//load audio files
let dead = new Audio();
let eat = new Audio();
dead.src = "audio/gameover.wav";
eat.src = "audio/eat.wav";

  //   not working
  //   function bgSoundPlay(){
  //   var bgSound = document.getElementById('bgSound');
  //   bgSound.loop = true;
  //   bgSound.play();
  // }

    // to implement score
    let score = 0;
    // when snake changes direction
    let changingDirection = false;
    // Food x-coordinate
    let foodX;
    // Food y-coordinate
    let foodY;
    // Horizontal velocity
    let dx = 10;
    // Vertical velocity
    let dy = 0;
    // Get the canvas element
    const gameCanvas = document.getElementById("gameCanvas");
    // Return a two dimensional drawing context
    const ctx = gameCanvas.getContext("2d");
    // Start game
    // main();
    // Create the first food location
    createFood();
    // Call changeDirection whenever a key is pressed
    document.addEventListener("keydown", changeDirection);
    /**
     * Main function of the game
     * starts the game
     */
     function main() {
      // If the game ended return early to stop game
      if (didGameEnd()) return;
      setTimeout(function() {
          changingDirection = false;
          clearCanvas(); 
          drawFood();
          advanceSnake();
          drawSnake();
          // Call game again
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
      //  Select the colour to fill the drawing
      ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
      //  Select the colour for the border of the canvas
      ctx.strokestyle = CANVAS_BORDER_COLOUR;
      // Draw a "filled" rectangle to cover the entire canvas
      ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
      // Draw a "border" around the entire canvas
      ctx.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
    }
    /**
     * function created to draw food on canvas
     */
     
    function drawFood() {
      var img = new Image();
      img.src = "./images/micky.png";
      ctx.drawImage(img, foodX, foodY, 10, 10);
      
    }
    /**
     * Advances the snake by changing the x-coordinates of its parts
     * according to the horizontal velocity and the y-coordinates of its parts
     * according to the vertical veolocity
     */
     function advanceSnake() {
      // Create the new Snake's head
      const head = {x: snake[0].x + dx, y: snake[0].y + dy};
      // Add the new head to the beginning of snake body
      snake.unshift(head);
      const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
      if (didEatFood) {
        eat.play()
        // Increase score
        score += 1;
        // Display score on screen
        document.getElementById('score').innerHTML = score;
        // Generate new food location
        createFood();
      } else {
        // Remove the last part of snake body
        snake.pop();
      }
    }
    /**
     * conditions for game to end
     */
     function didGameEnd() {
      for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y){
           dead.play();
          alert("GAME OVER! YOU ARE A LOSER!!!");
          location.reload();
        }
      }
      if(snake[0].x < 0 || snake[0].x > gameCanvas.width - 10 || snake[0].y < 0 || snake[0].y > gameCanvas.height - 10){
         dead.play();
        alert("GAME OVER")
        location.reload();
      }

    }

    /**

     * Generates a random number that is a multiple of 10 given a minumum
     * and a maximum number
     * @param { number } min - The minimum number the random number can be
     * @param { number } max - The maximum number the random number can be
     */
     function randomTen(min, max) {
      return Math.round((Math.random() * (max-min) + min) / 10) * 10;
    }
    /**
     * Creates random set of coordinates for the snake food.
     */
     function createFood() {
      // Generate a random number the food x-coordinate
      foodX = randomTen(0, gameCanvas.width - 10);
      // Generate a random number for the food y-coordinate
      foodY = randomTen(0, gameCanvas.height - 10);
      // if the new food location is where the snake currently is, generate a new food location
      snake.forEach(function isFoodOnSnake(part) {
        const foodIsoNsnake = part.x == foodX && part.y == foodY;
        if (foodIsoNsnake) createFood();
      });
    }
    /**
     * Draws the snake on the canvas
     */
     function drawSnake() {
      // loop through the snake parts drawing each part on the canvas
      snake.forEach(drawSnakePart)
    }
    /**
     * Draws a part of the snake on the canvas
     * @param { object } snakePart - The coordinates where the part should be drawn
     */
     function drawSnakePart(snakePart) {
      // Set the colour of the snake part
      ctx.fillStyle = SNAKE_COLOUR;
      // Set the border colour of the snake part
      ctx.strokestyle = SNAKE_BORDER_COLOUR;
      // Draw a "filled" rectangle to represent the snake part at the coordinates
      // the part is located
      ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
      // Draw a border around the snake part
      ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
    }
    /**
     * Changes the vertical and horizontal velocity of the snake according to the
     * key that was pressed.
     * The direction cannot be switched to the opposite direction, to prevent the snake
     * from reversing
     * For example if the the direction is 'right' it cannot become 'left'
     * @param { object } event - The keydown event
     */
     function changeDirection(event) {
      const LEFT_KEY = 65;
      const RIGHT_KEY = 68;
      const UP_KEY = 87;
      const DOWN_KEY = 83;
      /**
       * Prevent the snake from reversing
       * Example scenario:
       * Snake is moving to the right. User presses down and immediately left
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
