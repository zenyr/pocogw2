$(function () {
  var app = window.app = new App();
  AppModules(app).done(app.init).fail(function () {
    alert('Something went wrong. Might because of temporary change on dev channel. If this persists please flag an issue.');
  });

});