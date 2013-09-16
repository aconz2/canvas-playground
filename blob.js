var tau = Math.PI * 2;

exports.config = {
  rMin: [-110, 110, 10, 10],
  rMax: [-110, 110, 10, 110],

  wMin: [1, 5, 1, 2],
  wMax: [1, 5, 1, 3],

  aMin: [1, 10, 1, 3],
  aMax: [1, 10, 1, 4],

  rotationStep: [1, 360, 1, 2]
};

exports.draw = function(canvas) {
  var ctx = canvas.getContext('2d');
  var s = canvas.width;

  return function(rMin, rMax, wMin, wMax, aMin, aMax, rotationStep) {
    var update = {
      r: oscillate(rMin, rMax),
      w: oscillate(wMin, wMax),
      a: oscillate(aMin, aMax)
    };

    var r;
    var a;
    var w;

    rotationStep = rads(rotationStep);
    var samplesPerPeriod = 50;
    var rotated = 0;

    (function loop() {
      requestAnimationFrame(loop);
      r = update.r();
      w = update.w();
      a = update.a();
      console.log(r, a, w);
      draw();
    })();

    function draw() {
      ctx.clearRect(0,0,s,s);
      ctx.save();
      ctx.translate(s/2, s/2);
      ctx.rotate(rotated);

      circley(r, a, w);

      ctx.restore();
      rotated += rotationStep % tau;
    }

    function circley(r, a, w) {
      var f = function (x) {
        return Math.cos(w * x) * a + r;
      };
      var xMax = tau * w;
      var n = w * samplesPerPeriod;
      var dx = xMax / n;
      var d = tau / n;

      // ctx.beginPath();
      for(var x = 0; x <= xMax; x += dx) {
        var y = f(x);
        ctx.lineTo(0, y);
        ctx.rotate(d);
      }
      ctx.stroke();
      // ctx.closePath();
    }

  };

};

function oscillate(min, max, k) {
  k = k || 1;
  var dx = Math.PI / 50 * k;
  var p = Math.PI * 2 * k;
  var x = -dx;
  return function () {
    x = (x + dx) % p;
    return Math.cos(k * x) * (max - min) / 2 + (max + min) / 2;
  };
}

function rads(degrees) {
  return degrees / 180 * Math.PI;
}
