// var baseUrl = "http://crossorigin.me/https://s3-us-west-2.amazonaws.com/s.cdpn.io/106114/";
var baseUrl = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/106114/";

var loader = new PIXI.loaders.Loader(baseUrl).
add("face", "awesome250.png").
load(init);

var minX = 0;
var minY = 0;
var maxX = window.innerWidth;
var maxY = window.innerHeight;

var gravity = 0.5;
var total = 0;
var batch = 12;
var limit = 5000;

var ease = Power0.easeNone;

var faces = [];
var isAdding = false;

var view = document.querySelector("canvas");

var stage = new PIXI.Container();

var renderer = PIXI.autoDetectRenderer(maxX, maxY, { view, transparent: true });

var container = new PIXI.ParticleContainer(limit, {
  scale: true,
  position: true,
  rotation: true,
  uvs: false,
  alpha: true });


var texture;

stage.addChild(container);


//
// AWESOME FACE
// ========================================================================
class AwesomeFace extends PIXI.Sprite {

  constructor(texture) {
    super(texture);

    var repeat = -1;
    var yoyo = true;

    var time1 = _.random(0.5, 3);
    var time2 = _.random(2, 4.5);
    var time3 = _.random(2, 4.5);

    var prog1 = _.random(1, true);
    var prog2 = _.random(1, true);
    var prog3 = _.random(1, true);

    var scale = _.random(0.5);
    var alpha = _.random(0.4, 1);

    var speedX = _.random(-10, 10, true);
    var speedY = _.random(2, 10, true);

    var startX = _.random(maxX);
    var angle = _.randomSign() * Math.PI * 2;

    this.anchor.set(0.5);
    this.pivot.set(0.5);
    this.scale.set(0.1);

    this.x = startX;
    this.alpha = alpha;
    this.rotation = 0;

    this.speed = new PIXI.Point(speedX, speedY);

    TweenMax.to(this, time1, { repeat, ease, rotation: angle }).progress(prog1);
    TweenMax.to(this, time2, { repeat, ease, yoyo, alpha: 1 }).progress(prog2);
    TweenMax.to(this.scale, time3, { repeat, ease, yoyo, x: 1, y: 1 }).progress(prog3);
  }

  update() {

    this.x += this.speed.x;
    this.y += this.speed.y;
    this.speed.y += gravity;

    if (this.x > maxX) {

      this.x = maxX;
      this.speed.x *= -1;

    } else if (this.x < minX) {

      this.x = minX;
      this.speed.x *= -1;
    }

    if (this.y > maxY) {

      this.y = maxY;
      this.speed.y *= -1;

    } else if (this.y < minY) {

      this.y = minY;
      this.speed.y = 0;
    }
  }}


//
// INIT
// ========================================================================
function init(loader, assets) {

  // texture = assets.face.texture;
  texture = PIXI.Sprite.fromImage("https://upload.wikimedia.org/wikipedia/commons/5/53/Pok%C3%A9_Ball_icon.svg").texture;

  var visible = true;

  var toggle = event => {

    isAdding = !isAdding;

    if (visible) {
      visible = false;
      TweenLite.to("#info", 1, { autoAlpha: 0 });
    }
  };

  document.addEventListener("touchstart", toggle);
  document.addEventListener("touchend", toggle);
  document.addEventListener("mousedown", toggle);
  document.addEventListener("mouseup", toggle);

  window.addEventListener("resize", resize);
  TweenLite.ticker.addEventListener("tick", render);
  TweenLite.set("main", { autoAlpha: 1 });

  createFaces(_.random(50));
}

//
// CREATE FACES
// ========================================================================
function createFaces(count) {

  for (var i = 0; i < count; i++) {

    TweenLite.delayedCall(_.random(0.5), createFace);
  }

  function createFace() {

    var face = new AwesomeFace(texture);

    faces.push(face);
    container.addChild(face);
    total++;
  }
}

//
// RESIZE
// ========================================================================
function resize() {

  maxX = window.innerWidth;
  maxY = window.innerHeight;

  renderer.resize(maxX, maxY);
}

//
// RENDER
// ========================================================================
function render() {

  if (isAdding && total < limit) {
    createFaces(batch);
  }

  for (var i = 0; i < total; i++) {
    faces[i].update();
  }

  renderer.render(stage);
}