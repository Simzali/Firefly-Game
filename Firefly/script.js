let video;
let handpose;
let predictions = [];
let ML = false;
let handposeActive = false; // Tracks if model is already active
let lightImg, sparkyImg, lampImg, spiderImg;
let intro = true;
let gameOver = false;
let winner = false;


function preload(){
  sparkyImg = loadImage('Sparky.png');
  spiderImg = loadImage('Spidey.png');
  lampImg = loadImage('Lamp.png');
  largeTreeImg = loadImage('Large_Tree.png');
  smallTreeImg = loadImage('Small_Tree.png');
  lightImg = loadImage('Light.png');
  Sparky2Img = loadImage('Sparky2.png');
}

function setup() {
  createCanvas(600, 400);

  // Create light sprite
  light = createSprite(width / 2, height / 2, 50, 50);
  light.image = lightImg;
  light.scale = 2;

  //Create Sparky sprite
  sparky = createSprite(50, height-150, 50, 50);
  sparky.image = sparkyImg;

  // Environment
  lamp = createSprite(50, height-80, 50, 50);
  lamp.image = lampImg;

  lamp2 = createSprite(width-50, height-80, 50, 50);
  lamp2.image = lampImg;

  spider = createSprite(width/2, 50, 50, 50);
  spider.image = spiderImg;
  spider.scale = 1.5;

  smallTree = createSprite(width/3,height-80,50,100);
  smallTree.image = smallTreeImg;
  smallTree.scale = 2;

  for (let s of [sparky, lamp, lamp2, spider,smallTree]) {
    s.collider = 'd';
  }
  light.collider = "none";
}

function draw() {
  background(255, 254, 186);
  fill("brown");
  rect(0, height-50, width, 50); // Ground

  // Draw sprites in desired order
  spider.draw();
  smallTree.draw();
  light.draw();
  lamp.draw();
  lamp2.draw();
  sparky.draw();

    // press R to reload
      if (kb.released('r')) {
  location.reload(); 
}

  if(gameOver != true && winner != true)
  {
    // Toggle ML on/off with 'e'
    if (kb.released('e') && !ML) {
    ML = true;
    MLSetup();
    console.log("ML Activated");
    alert("Hand Tracking Mode Activated. Press r to return to WASD mode."); // Optional
  }
    // Control mode
    if (ML) {
      MLMove();
    } else {
      IKJL();
    }

    //Sparky movement
    WASD();

    //intro screen
    if (intro == true){
      drawIntroPopup();
    }

    if (sparky.collides(spider)){
      gameOver = true;
    }
    else if (sparky.collides(smallTree)){
      gameOver = true;
    }
    else if (sparky.collides(lamp2)){
      winner = true
    }

} else if (gameOver == true) {
  loose();
} else if (winner == true) {
  win();
}
  }


function MLSetup(){
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  handpose = ml5.handpose(video, modelReady);
  handpose.on("predict", results => {
    predictions = results;
  });
}




function MLMove(){
  if (predictions.length > 0) {
    let finger = predictions[0].landmarks[8];
    let x = width - finger[0] + 50;
    let y = finger[1] - 100;

    light.position.x = lerp(light.position.x, x, 0.5);
    light.position.y = lerp(light.position.y, y, 0.5);
  }
  console.log("Predictions length:", predictions.length);
}

function WASD(){
  if (kb.pressing('w')) sparky.position.y -= 2;
  if (kb.pressing('s')) sparky.position.y += 2;
  if (kb.pressing('a')) sparky.position.x -= 2;
  if (kb.pressing('d')) sparky.position.x += 2;
}

function IKJL(){
  if (kb.pressing('i')) light.position.y -= 2;
  if (kb.pressing('k')) light.position.y += 2;
  if (kb.pressing('j')) light.position.x -= 2;
  if (kb.pressing('l')) light.position.x += 2;
}

function modelReady() {
  console.log("Handpose model loaded!");
}
function drawIntroPopup() {

  if (kb.presses(' ')) {
	intro = false;
}
  // Outer frame (3D border effect)
  fill(180); // Light gray border
  stroke(80); // Darker edge
  strokeWeight(2);
  rect(width / 2 - 210, height / 2 - 130, 420, 260); // Slightly bigger for border


  // Inner popup box (background)
  fill(240); // Light gray interior
  stroke(160); // Medium gray border
  strokeWeight(1);
  rect(width / 2 - 200, height / 2 - 120, 400, 240);


  // Title bar
  fill(128, 128, 128); // Classic gray
  noStroke();
  rect(width / 2 - 200, height / 2 - 120, 400, 30);


  // Title text
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(14);
  textFont('monospace'); // Pixel-like font
  text("Finding the Light", width / 2, height / 2 - 105);


  // Close button (X)
  fill(200, 0, 0);
  rect(width / 2 + 190, height / 2 - 120, 10, 10);
  fill(255);
  textSize(10);
  text("X", width / 2 + 195, height / 2 - 115);


  // Instructions inside box
  fill(0);
  textSize(12);
  textAlign(CENTER, CENTER);
  text("⚡ WELCOME TO LIGHT QUEST ⚡", width / 2, height / 2 - 60);


  textSize(11);
  text("- Use JIKL to move the Light\n- Use WASD to move Sparky\n- Press 'E' to activate hand tracking\n- Wave at the screen to control the Light", width / 2, height / 2 - 10);


  text("Press 'Space' to begin...", width / 2, height / 2 + 60);
}

function loose(){
 // Outer frame (3D border effect)
  fill(180); // Light gray border
  stroke(80); // Darker edge
  strokeWeight(2);
  rect(width / 2 - 210, height / 2 - 130, 420, 260); // Slightly bigger for border


  // Inner popup box (background)
  fill(240); // Light gray interior
  stroke(160); // Medium gray border
  strokeWeight(1);
  rect(width / 2 - 200, height / 2 - 120, 400, 240);


  // Title bar
  fill(128, 128, 128); // Classic gray
  noStroke();
  rect(width / 2 - 200, height / 2 - 120, 400, 30);


  // Title text
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(14);
  textFont('monospace'); // Pixel-like font
  text("Finding the Light", width / 2, height / 2 - 105);


  // Close button (X)
  fill(200, 0, 0);
  rect(width / 2 + 190, height / 2 - 120, 10, 10);
  fill(255);
  textSize(10);
  text("X", width / 2 + 195, height / 2 - 115);


  // Instructions inside box
  fill(0);
  textSize(12);
  textAlign(CENTER, CENTER);
  text("⚡Sparky never got to find his light... ⚡", width / 2, height / 2 - 60);


  textSize(11);
  text("Spiders are a natural predator of fireflies! \n Avoid the spiders and trees to help Sparky find his light.", width / 2, height / 2 - 10);


  text("Press 'r' to restart...", width / 2, height / 2 + 60);
}

function win() {
  // Outer frame (3D border effect)
  fill(180); // Light gray border
  stroke(80); // Darker edge
  strokeWeight(2);
  rect(width / 2 - 210, height / 2 - 130, 420, 260); // Slightly bigger for border

  // Inner popup box (background)
  fill(240); // Light gray interior
  stroke(160); // Medium gray border
  strokeWeight(1);
  rect(width / 2 - 200, height / 2 - 120, 400, 240);

  // Title bar
  fill(128, 128, 128); // Classic gray
  noStroke();
  rect(width / 2 - 200, height / 2 - 120, 400, 30);

  // Title text
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(14);
  textFont('monospace');
  text("Finding the Light", width / 2, height / 2 - 105);

  // Close button (X)
  fill(200, 0, 0);
  rect(width / 2 + 190, height / 2 - 120, 10, 10);
  fill(255);
  textSize(10);
  text("X", width / 2 + 195, height / 2 - 115);

  // Display the win image inside popup
  // Placeholder - use any image variable here, e.g., winImg
  // Replace 'image' with the actual loaded image variable

  imageMode(CENTER);
  image(Sparky2Img, width / 2, height / 2 + 10, 150, 150); // Centered image with size
}
