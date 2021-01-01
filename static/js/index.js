const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;     // innerWidth is just the screen without the UI, menu, etc
canvas.height = window.innerHeight;   // innerHeight is just the screen without the UI, menu, etc

let particlesArray;


let mouse = {
  x: null,                       //Initially the x and y position of the mouse is null until seen
  y: null,
  //radius: (canvas.height/85)*(canvas.width/85)   // The radius of the circle around the mouse that pushes the particles
  radius: 0
}


window.addEventListener('mousemove', function(event) {   //Everytime the mouse moves, this event listener activates
  mouse.x = event.x;    // Set the mouse variable's x and y position to the current mouse position on the screen (which is event)
  mouse.y = event.y;
  }
);

//creating particles

class Particle {

  constructor(x,y,directionX,directionY, size, color){   //These particles have these properties.
    this.x=x;       // x position
    this.y = y;     // y position
    this.directionX = directionX; // the x-direction particle is going to
    this.directionY = directionY; // the y-direction particle is going to
    this.size = size;    //particle size
    this.color = color;   //particle color
  }


  draw() {
    ctx.beginPath();    //Generates a "line" to be drawn
    ctx.arc(this.x,this.y,this.size, 0, Math.PI * 2, false);  //x,y,radius,starting angle, ending angle, counterclockwise
    ctx.fillStyle = '#FFFFFF';   //Color to fill in the line
    ctx.fill();   //"Fills" the line with a color. (like coloring in a circle)
  }

  update() {

    if(this.x > canvas.width || this.x < 0){
      this.directionX = -this.directionX;
    }

    if(this.y > canvas.height || this.y < 0){
      this.directionY = -this.directionY;
    }

    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx*dx + dy*dy);

    if(distance < mouse.radius + this.size){
      
      if(mouse.x < this.x && this.x < canvas.width - this.size * 10){
        this.x +=10;
      }

      if(mouse.x > this.x && this.x > this.size * 10){
        this.x -= 10;
      }

      if(mouse.y < this.y && this.y < canvas.height - this.size * 10){
        this.y += 10;
      }

      if(mouse.y > this.y && this.y > this.size * 10){
        this.y -= 10;
      }

    }

    //move particles
    this.x += this.directionX;
    this.y += this.directionY;

    //draw particle

    this.draw();




  }
}


function init() {
  particlesArray = [];
  let numberOfParticles = 80;//(canvas.height * canvas.width) / 15000;

  for(let i = 0; i < numberOfParticles; i++){
    let size = 1;
    let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size*2);
    let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size*2);
    let directionX = (Math.random() * 5) - 2.5;
    let directionY = (Math.random() * 5) - 2.5;
    let color = '#FFFFFF';


    particlesArray.push(new Particle(x,y,directionX,directionY, size, color));
  }

}


//animation loop

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0,0,innerWidth, innerHeight);
  
  for(let i = 0; i < particlesArray.length; i++){
    particlesArray[i].update();
  }

  connect();

}


function connect() {

  let opacityValue = 1;

  for(let a = 0; a < particlesArray.length; a++){
    for(let b = a; b < particlesArray.length; b++){
      let distance = (( particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + (( particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
      if(distance < (canvas.width/7) * (canvas.height/7)) {
        
        opacityValue = 1 - (distance/20000);
        ctx.strokeStyle='rgba(255,255,255,' + opacityValue + ')';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}


window.addEventListener('resize', function() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  mouse.radius = ((canvas.height/80) * (canvas.height/80));
  init();
});

window.addEventListener('mouseout', function() {
  mouse.x = undefined;
  mouse.y = undefined;
})

init();
animate();