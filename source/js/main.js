goog.provide('app.Main');

goog.require('goog.dom');

app.Main = function() {
  // Constructor
  this.init_();
};

//All functions/methods go in this function
app.Main.prototype.init_ = function() {
  console.log('Arrived');

  var newHeader = goog.dom.createDom('h2', {'style': 'background-color:#000'},
    'Hello world!');
  goog.dom.appendChild(document.body, newHeader);
};

// app.Main.Main.CssClasses = {
//   FOO: 'bar'
// }

//app.CssClasses.FOO

goog.addSingletonGetter(app.Main);
goog.exportSymbol('app.Main', app.Main);

new app.Main();
