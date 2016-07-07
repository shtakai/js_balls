
function Circle(cx, cy, html_id, r)
{
  var html_id = html_id;
  this.info = { cx: cx,  cy: cy , r: r};

  //private function that generates a random number
  var randomNumberBetween = function(min, max){
    return Math.random()*(max-min) + min;
  }

  this.initialize = function(){
    //give a random velocity for the circle
    this.info.velocity = {
      x: randomNumberBetween(-3,3),
      y: randomNumberBetween(-3,3)
    }

    //create a circle
    var circle = makeSVG('circle',
      { 	cx: this.info.cx,
        cy: this.info.cy,
        r:  r,
        id: html_id,
        style: "fill: black"
      });

    document.getElementById('svg').appendChild(circle);
  }

  this.update = function(time){
    var el = document.getElementById(html_id);

    //see if the circle is going outside the browser. if it is, reverse the velocity
    if( this.info.cx > document.body.clientWidth - r || this.info.cx < r)
    {
      this.info.velocity.x = this.info.velocity.x * -1;
    }
    if( this.info.cy > document.body.clientHeight -r || this.info.cy < r)
    {
      this.info.velocity.y = this.info.velocity.y * -1;
    }

    this.info.cx = this.info.cx + this.info.velocity.x*time;
    this.info.cy = this.info.cy + this.info.velocity.y*time;

    el.setAttribute("cx", this.info.cx);
    el.setAttribute("cy", this.info.cy);
  }

  this.destroy = function () {
    var el = document.getElementById(html_id);
    el.remove();
  }

  //creates the SVG element and returns it
  var makeSVG = function(tag, attrs) {
    var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs)
    {
      el.setAttribute(k, attrs[k]);
    }
    return el;
  }

  this.collisionDetect = function (anotherCircle) {
    if((this.info.r + anotherCircle.info.r ) >=
      Math.sqrt(
      Math.pow(this.info.cx - anotherCircle.info.cx, 2) +
        Math.pow(this.info.cy - anotherCircle.info.cy, 2)
    )){
      return true;
    }
    return false
  }

  this.initialize();
}

function PlayGround()
{
  var counter = 0;  //counts the number of circles created
  var circles = [ ]; //array that will hold all the circles created in the app

  //a loop that updates the circle's position on the screen
  this.loop = function(){
    var eraseCircles = [];

    for(circle in circles)
    {
      circles[circle].update(1);
      for( var anotherCircle in circles ){
         if(circles[circle] === circles[anotherCircle]){continue;}
         if(circles[circle].collisionDetect(circles[anotherCircle])){
           eraseCircles.push(circle);
           eraseCircles.push(anotherCircle);
           circles[circle].destroy();
           circles[anotherCircle].destroy();
           break;
         }
      }
      if(eraseCircles.length != 0){break;}
    }
    if(eraseCircles.length != 0){
      delete circles[eraseCircles.pop()];
      delete circles[eraseCircles.pop()];
    }
  }

  this.createNewCircle = function(x,y,r){
    var new_circle = new Circle(x,y,counter++, r);
    circles.push(new_circle);
     //console.log('created a new circle!', new_circle);
  }

  //create one circle when the game starts
  this.createNewCircle(document.body.clientWidth/2, document.body.clientHeight/2, 10);
}

var playground = new PlayGround();
setInterval(playground.loop, 15);

document.onmousedown = function(e) {
  mousedown_time = getTime();
}
document.onmouseup = function(e) {
  var time_pressed = getTime() - mousedown_time;
  playground.createNewCircle(e.x,e.y, time_pressed/10);
}
var mousedown_time;
var getTime = function () {
  var date = new Date();
  return date.getTime();
}
