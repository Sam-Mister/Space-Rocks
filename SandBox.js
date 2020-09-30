let particleArr = [];
let clicker = 0
let Button1;
let Button2;
let Button3;
let cnv;
let MassSlider;
let Playing = false;
let CirclePos;
let ArrowTo;
let TempRadius;
let MouseHeld = false;
let Stat;

function setup() {
  CirclePos = createVector(mouseX - canvas.width/2,mouseY - canvas.height/2);
  ArrowTo = createVector(mouseX - canvas.width/2,mouseY - canvas.height/2);
  TempRadius = 0;
  cnv = createCanvas(window.innerWidth * (2/3), window.innerHeight, WEBGL);
  //cnv.mouseClicked(addParticle);
  cnv.position((window.innerWidth/2 - canvas.width/2),0)
  properties = {timestep : 1, x_min : -1*canvas.width/2, x_max : canvas.width/2, y_min : -1*canvas.height/2, y_max : canvas.height/2,
    BoundaryConditions : "solid",
    TwoBodyForces : true,
    NewtonGravity : true,
    UniformGravity : false,
  };

  cnv.mousePressed(SetPos);
  cnv.mouseMoved(SetVel);
  cnv.mouseReleased(addParticle);

  World = new World(properties);

  Button1 = createButton('Gravity');
  Button1.position(window.innerWidth * (0.85),50);
  Button1.mousePressed(GravChange);

  Button2 = createButton('Forces');
  Button2.position(window.innerWidth * (0.85),100);
  Button2.mousePressed(ForceChange);

  Button3 = createButton('Play/Pause');
  Button3.position(window.innerWidth * (0.85),150);
  Button3.mousePressed(PlayWorld);

  MassSlider = createSlider(50,500,100);
  MassSlider.position(window.innerWidth * (0.85),200)

  Stat = new StaticCircle(0,0,10*MassSlider.value(),"stat",0.8)


  Camera = createCamera();
  setCamera(Camera);
  Camera.lookAt(0,0,0);
}

function draw() {
  background(50);
  Camera.setPosition(0,0,850)
  circle(CirclePos.x,CirclePos.y,TempRadius);
  if (!MouseHeld){
    stroke(50);
  }else{
    strokeWeight(5);
    stroke("white");
  }
  line(CirclePos.x,CirclePos.y,ArrowTo.x,ArrowTo.y)
  for (var i = 0; i < particleArr.length; i++){
    particleArr[i].update();
  }
  Stat.update();
  if (Playing){
    AdvanceWorld();
  }

}
function SetPos(){
  MouseHeld = true
  CirclePos.x = mouseX-canvas.width/2;
  CirclePos.y = mouseY - canvas.height/2;
  ArrowTo.x = mouseX - canvas.width/2;
  ArrowTo.y = mouseY - canvas.height/2;
  TempRadius = 2*Math.sqrt(MassSlider.value());
}

function SetVel(){
  if (MouseHeld){
    ArrowTo.x = mouseX - canvas.width/2;
    ArrowTo.y = mouseY - canvas.height/2;
  }
}

function addParticle(){
  let InitVel = ArrowTo.sub(CirclePos)
  let Mass = MassSlider.value();
  let Pholder = new Circle(CirclePos.x,CirclePos.y,(InitVel.x)/10,(InitVel.y)/10,Mass,"swarm"+clicker,0.8)
  particleArr.push(Pholder)

  clicker++
  MouseHeld = false
  CirclePos = createVector(mouseX - canvas.width/2,mouseY - canvas.height/2);
  ArrowTo = createVector(mouseX - canvas.width/2,mouseY - canvas.height/2);
  TempRadius = 0;
}
function GravChange(){
  World.UniformGravity = toggle(World.UniformGravity);
}

function ForceChange(){
  World.TwoBodyForces = toggle(World.TwoBodyForces);
}

function PlayWorld(){
  Playing = toggle(Playing);
}

function AdvanceWorld(){
  let n = 1/properties.timestep;
  for (var i = 0; i < n; i++){
    World.updateWorld();
  }
}


class Circle{
  constructor(x,y,v_x,v_y,mass,id,res){
    this.radius = Math.sqrt(mass);
    this.particle = new PointParticle(x,y,v_x,v_y,10*mass,id,this.radius,res)
    console.log(this.particle.inWorld);
    World.addobject(this.particle);
    console.log(this.particle.inWorld);
  }

  draw = function(){
    if (this.particle.inWorld){
    noStroke();
    circle(this.particle.pos.x,this.particle.pos.y,2*this.radius)
    }
  }

  update = function(){
    this.draw();
  }
}

class StaticCircle{
  constructor(x,y,mass,id,res){
    this.radius = Math.sqrt(mass);
    this.particle = new StaticParticle(x,y,10*mass,id,this.radius,res)
    World.addobject(this.particle);
  }

  draw = function(){
    noStroke();
    circle(this.particle.pos.x,this.particle.pos.y,2*this.radius)
  }

  update = function(){
    this.draw();
  }
}
