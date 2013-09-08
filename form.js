var each = require('each');
var attr = require('attr');
var link = require('input-link');
var create = document.createElement.bind(document);

module.exports = makeForm;

function makeForm(config) {

  var form = create('form');
  var fieldset = create('fieldset');
  var legend = create('legend');

  legend.textContent = config.legend;
  fieldset.appendChild(legend);
  form.appendChild(fieldset);

  each(config.fields, function(name, attrs) {
    var div = create('div');
    var label = create('label');
    var input = create('input');
    var span = create('span');

    var labelString = attrs.label;

    delete attrs.label;
    attrs.name = name;
    attr(label, 'for', name);
    label.textContent = labelString || name;
    attr(input, attrs);

    link(input, span);

    label.appendChild(span);
    div.appendChild(label);
    div.appendChild(input);
    fieldset.appendChild(div);
  });

  return form;
}