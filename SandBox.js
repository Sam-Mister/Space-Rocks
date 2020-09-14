let particleArr = [];
let clicker = 0
let Button1;
let Button2;
let Button3;
let cnv;
let MassSlider;
let Playing = false;

function setup() {
  cnv = createCanvas(800, window.innerHeight);
  cnv.mouseClicked(addParticle);
  cnv.position((window.innerWidth/2 - canvas.width/2),0)
  properties = {timestep : 1, x_min : -1*canvas.width/2, x_max : canvas.width/2, y_min : -1*canvas.height/2, y_max : canvas.height/2,
    BoundaryConditions : "solid",
    TwoBodyForces : true,
    NewtonGravity : true,
    UniformGravity : false,
  };

  World = new World(properties);

  Button1 = createButton('Gravity');
  Button1.position(1100,50);
  Button1.mousePressed(GravChange);

  Button2 = createButton('Forces');
  Button2.position(1100,100);
  Button2.mousePressed(ForceChange);

  Button3 = createButton('Play/Pause');
  Button3.position(1100,150);
  Button3.mousePressed(PlayWorld);

  MassSlider = createSlider(50,500,100);
  MassSlider.position(1100,200)
}

function draw() {
  translate(canvas.width/2,canvas.height/2)
  background(50);
  for (var i = 0; i < particleArr.length; i++){
    particleArr[i].update();
  }
  if (Playing){
    AdvanceWorld();
  }

}

function addParticle(){
  let mass = MassSlider.value();
  let Pholder = new Circle((mouseX-canvas.width/2),(mouseY - canvas.height/2),0,0,mass,"swarm"+clicker,0.8)
  particleArr.push(Pholder)
  World.addobject(Pholder.particle);
  clicker++
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
    this.particle = new PointParticle(x,y,v_x,v_y,mass,id,this.radius,res)
  }

  draw = function(){
    circle(this.particle.pos.x,this.particle.pos.y,2*this.radius)
  }

  update = function(){
    this.draw();
  }
}
