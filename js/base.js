$(function () {
  if (localStorage && !localStorage.ll) {
    localStorage.ll = !0;
    if (confirm('this thing is under heavy reconstruction. please use zenyr.github.io to use "working" one. this message is shown only once.')) location.href = '//zenyr.github.io';
  }
  var App = function () {
    var self = this;
    self.init = function () {
      if (!self.rect) return console.log('Err:Modules not initialized');
      delete self.init;
      self.popup = {}; //{TODO} new google.maps.InfoWindow();
      $map = $('<div/>', {
        id: 'map'
      }).appendTo('body').on('click','.marker-icon',function(e){
        console.log('MarkerClick',$(e.target).parent());
      });
      self.map = L.map('map', {
        center: new L.LatLng(0, 0),
        zoom: 3,
        minZoom: 2,
        maxZoom: 7,
        zoomControl: false,
        layers: [self.tile.getBaseLayer(1)]
      });
      self.layerControl = L.control.layers().addTo(self.map);
      for (var mod in self)
        if (_.isObject(self[mod]) && _.isFunction(self[mod].init))
          console.log('firing', mod, 'init'), self[mod].init(), delete self[mod].init;
    };
  };
  var app = window.app = new App;
  AppModules(app).done(app.init);
});
//////////// Better Random
+ function (window) {
  if (Math.random(1, 2) < 1) {
    var _r = Math.random;
    Math.random = function (a, b) {
      if (b - a <= 0) throw 'range error:' + b;
      if (a) {
        return b ? a + Math.random(b - a) : _r() * a;
      } else return _r();
    };
  }
  if (!window.rand) window.rand = Math.random;
}(this);
//////////// Should be moved someday
