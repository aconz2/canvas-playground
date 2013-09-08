var cos = Math.cos;
var sin = Math.sin;
var tau = Math.PI * 2;

exports.config = {
  // [min, max, step, default]
  spokes: [5, 50, 1, 20],
  radius: [100, 500, 10, 150],
  diag: [1.1, 2, 0.1, 1.3],
  rotation: [2, 20, 1, 4],
  diminishFactor: [0.1, 0.9, 0.05, 0.7]
};

exports.draw = function draw(canvas) {
  var ctx = canvas.getContext('2d');
  var s = canvas.width;

  ctx.lineWidth = 0.5;
  ctx.strokeStyle = 'rgba(200, 200, 200, 0.7)';
  ctx.fillStyle = 'rgba(0,0, 150, 0.05)';

  return function(n, r, diagFactor, m, diminishFactor) {
    ctx.translate(s/2, s/2);
    pedals(n, r);
    function pedals(n, r) {
      if(n < 3 || r < 10) return null;

      var _d = tau / n;
      var diagonal = r * diagFactor;

      for(var i = 0; i < n; i++) {
          var d = _d * i;
          var d2 = _d * (i + 0.5);
          var d3 = _d * (i + 1);

        ctx.beginPath();

        ctx.moveTo(0,0);
        ctx.lineTo(cos(d) * r, sin(d) * r);
        ctx.lineTo(cos(d2) * diagonal, sin(d2) * diagonal);
        ctx.lineTo(cos(d3) * r, sin(d3) * r);

        ctx.stroke();
        ctx.fill();

        ctx.closePath();

      }
      ctx.rotate(tau / m);
      pedals(n, r * diminishFactor);
    }
  };

};