
let btnRedX, btnRedY;
let btnOrangeX, btnOrangeY;
let btnSize = 220; 

function setup() {
    createCanvas(windowWidth, windowHeight);
    textFont("monospace");
    
    
    textAlign(CENTER, CENTER);

    
    btnRedX = width / 2 - 180;
    btnRedY = height / 2 + 80;
    
    btnOrangeX = width / 2 + 180;
    btnOrangeY = height / 2 + 80;
}

function draw() {
    
    background(135, 206, 235); 

    
    fill(40, 60, 90); 
    textSize(40);     
    text("Choose What You Like", width / 2, height / 2 - 120);

    
    noStroke();
    fill(235, 60, 60); 
    circle(btnRedX, btnRedY, btnSize);
    
    
    fill(255);
    textSize(22);
    text("Audio", btnRedX, btnRedY);

    
    fill(255, 140, 0); 
    circle(btnOrangeX, btnOrangeY, btnSize);
    
    
    fill(255);
    textSize(16);
    textWrap(WORD); 
    rectMode(CENTER); 
    text("Perlin noise and randomness", btnOrangeX, btnOrangeY, btnSize - 40, btnSize - 40);
}


function mousePressed() {
    
    let dRed = dist(mouseX, mouseY, btnRedX, btnRedY);
    if (dRed < btnSize / 2) { 
        console.log("正在跳转到 Leah 的独立网页...");
       
        window.location.href = "../Leah/index.html";
    }

    
    let dOrange = dist(mouseX, mouseY, btnOrangeX, btnOrangeY);
    if (dOrange < btnSize / 2) {
        console.log("正在跳转到最外层的柏林噪声网页...");
        window.location.href = "../index.html";
    }
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    btnRedX = width / 2 - 180;
    btnRedY = height / 2 + 80;
    btnOrangeX = width / 2 + 180;
    btnOrangeY = height / 2 + 80;
}