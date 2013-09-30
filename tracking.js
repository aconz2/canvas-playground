var tau = Math.PI * 2;
var dt = 1;

exports.config = {
  numParticles: [1, 50, 1, 10],
  velocity: [1, 5, 1, 1],
  grid: [2, 10, 1, 1],
  length: [0.5, 2, 0.1, 1.4],
  drawPoints: [0, 1, 1, 0],
  drawCircles: [0, 1, 1, 0]
};

exports.draw = function(canvas, events) {
  var ctx = canvas.getContext('2d');
  var s = canvas.width;

  return function(n, V, m, length, pts, circles) {
    var stop = false;
    events.once('stop', function() {
      stop = true;
    }).once('start', function() {
      stop = false;
    });
    var grid = s / (m + 1);
    length = grid * length;
    pts = pts === 1;
    circles = circles === 1;

    var particles = [];

    while(n--) {
      particles.push(Particle());
    }

    (function loop() {
      // console.log(stop)
      if(!stop) requestAnimationFrame(loop);
      clear();
      draw();
    })();

    function clear() {
      ctx.clearRect(0, 0, s, s);
    }

    function draw() {
      particles.forEach(function(p, idx) {
        ctx.beginPath();
          for(var i = grid; i < s; i += grid) {
            for(var j = grid; j < s; j += grid) {
              var d = distance({x: i, y: j}, p);
              if(d < length) {
                if(circles) {
                  ctx.arc(i, j, d, 0, tau, true);
                } else {
                  ctx.moveTo(i, j);
                  ctx.lineTo(p.x, p.y);
                }
              }

            }
          }
        if(pts) ctx.arc(p.x, p.y, 2, 0, tau, true);
        p.x += p.v.x * dt;
        p.y += p.v.y * dt;
        if(outOfBounds(p)) {
          particles.splice(idx, 1, Particle());
        }
        ctx.closePath();
        ctx.stroke();
      });
    }

    function Particle() {
      var xOrY = tf();
      return {
        x: xOrY ? random(0, s) : tf() ? 0 : s,
        y: !xOrY ? random(0, s) : tf() ? 0 : s,
        v: {
          x: randUnit() * V,
          y: randUnit() * V
        }
      };
    }

    function outOfBounds(pt) {
      return pt.x < 0 || pt.x > s || pt.y < 0 || pt.y > s;
    }
  };

};


function random(min, max) {
  return Math.random() * (max - min) + min;
}

function randUnit() {
  return tf() ? -1 : 1;
}

function tf() {
  return Math.random() < 0.5;
}

function distance(a, b) {
  return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
}
