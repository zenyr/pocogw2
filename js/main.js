$(function () {
  var app = window.app = new App();
  AppModules(app).done(app.init).fail(function(){
    alert('Something went wrong. Might because of temporary testing');
  });

  $('body').append('<div style="z-index:2;background:#fff;padding:2px;font-size:.5em;position:absolute;right:0;top:3em;">one willion twoops</div>');
});