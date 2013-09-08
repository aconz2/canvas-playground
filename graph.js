var tau = Math.PI * 2;
var r = 2;

exports.config = {
  numPoints: [10, 1000, 10, 500],
  // ratioOrigins: [0.001, 0.999, 0.001, 0.015],
  numOrigins: [1, 10, 1, 2],
  ratioOriginsToOthers: [0.001, 0.999, 0.001, 0.2]
};

exports.draw = function(canvas) {
  var ctx = canvas.getContext('2d');
  var s = canvas.width;
  ctx.strokeStyle = 'rgba(0,0,0, 0.6)';
  ctx.lineWidth = 0.3;

  return function(n, m, o) {
    var pts = [];
    var i = n;
    while(i--) {
      pts.push({
        x: Math.random() * s + 1,
        y: Math.random() * s + 1
      });
    }

    var origins = indices(m, n);
    // var origins = indices(n * m, n);
    for(var i = 0; i < n; i++) {
      var a = pts[i];
      ctx.beginPath();
      ctx.arc(a.x, a.y, r, 0, tau, true);
      ctx.fill();
      ctx.closePath();
      if(origins.indexOf(i) !== -1) {
        indices(n * o, n).forEach(function(j) {
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(pts[j].x, pts[j].y);
        });
        ctx.stroke();
      }
    }
  };

}

function indices(n, max) {
  n = Math.floor(n);
  var arr = [];
  while(arr.length < n) {
    var i = Math.floor(Math.random() * max);
    if(arr.indexOf(i) === -1) arr.push(i);
  }
  return arr;
}
