var createForm = require('./form');
var query = require('query');
var each = require('each');
var delegate = require('delegate');
var fValue = require('form-value');
var querystring = require('querystring');
var page = require('page');
var create = document.createElement.bind(document);

var body = document.body;
var cur = {
  canvas: query('canvas'),
  form: query('form'),
  pre: query('pre')
};

// drawings
var drawings = {
  pinwheel: require('./pinwheel'),
  graph: require('./graph')
};

page('*', function(ctx) {
  var q = querystring.parse(ctx.querystring);
  if(q.name && drawings[q.name]) {
    selectDrawing(q.name);
  } else {
    return page('/?name=pinwheel');
  }
});
page.start();

// if(window.location.search === '/') {
//   page('/?name=pinwheel');
// }

function selectDrawing(key) {
  var drawing = drawings[key];
  var conf = {fields: toFormConfig(drawing.config)};
  conf.legend = key;
  var form = createForm(conf);

  var canvas = create('canvas');
  var ctx = canvas.getContext('2d');
  canvas.width = canvas.height = 500;
  var drawFn = drawing.draw(canvas);
  var l1 = Object.keys(drawing.config).length;
  var l2 = drawFn.length;
  if(l1 !== l2) {
    throw Error('argument length mismatch, expected ' + l2 + ' and got ' + l1);
  }

  var pre = create('pre');
  pre.textContent = drawing.draw.toString();

  body.replaceChild(form, cur.form);
  body.replaceChild(canvas, cur.canvas);
  body.replaceChild(pre, cur.pre);

  cur.form = form;
  cur.canvas = canvas;
  cur.pre = pre;

  var formValues = fValue(form);

  var onchange = function() {
    var vals = formValues();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0,0, canvas.width, canvas.height);
    drawFn.apply(null, values(vals));
    // window.location.search = querystring.stringify(vals);
  };
  delegate.bind(form, 'input', 'change', onchange);
  onchange();
}

// make [min, max, step, default]
// into {min: n, max: n, step: n, default: n}
function toFormConfig(config) {
  var indexToKey = ['min', 'max', 'step', 'value'];
  var ret = {};
  each(config, function(name, arr) {
    var obj = {};
    arr.forEach(function(num, i) {
      obj[indexToKey[i]] = num;
    });
    obj.type = 'range';
    ret[name] = obj;
  });
  return ret;
}


function values(obj) {
  var arr = [];
  each(obj, function(k, v) {
    arr.push(v);
  });
  return arr;
}
