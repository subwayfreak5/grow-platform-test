goog.provide('app.Main');

goog.require('goog.dom');

app.Main = function() {
  // Constructor
  this.init_();
};

var app = app.Main;

//All functions/methods go in this function
app.prototype.init_ = function() {
  console.log('Arrived');

  var newHeader = goog.dom.createDom('h1', {'style': 'background-color:#000;color:#fff;'},
    'Hello world!');
  goog.dom.appendChild(document.body, newHeader);
};

app.CssClasses = {
  FOO: 'bar'
}

//app.CssClasses.FOO

goog.addSingletonGetter(app.Main);
goog.exportSymbol('app.Main', app.Main);

new app.Main();
