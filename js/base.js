$(function () {
  if (localStorage && !localStorage.ll) {
    localStorage.ll = !0;
    if (confirm('this thing is under heavy reconstruction. please use zenyr.github.io to use "working" one. this message is shown only once.')) location.href = '//zenyr.github.io';
  }
  var App = function () {
    var self = this;
    self.layers = {};
    self.init = function () {
      if (!self.rect) return console.log('Err:Modules not initialized');
      delete self.init;
      self.popup = {}; //{TODO} new google.maps.InfoWindow();
      $map = $('<div/>', {
        id: 'map'
      }).appendTo('body');
      self.map = L.map('map', {
        center: new L.LatLng(0, 0),
        zoom: 3,
        minZoom: 2,
        maxZoom: 7,
        zoomControl: false,
        layers: [self.tile.getBaseLayer(1)]
      });
      for (var mod in self)
        if (_.isObject(self[mod]) && _.isFunction(self[mod].init))
          console.log('firing', mod, 'init'), self[mod].init(), delete self[mod].init;
      self.layerControl = L.control.layers(self.baseLayers, self.layers).addTo(self.map);
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
L.LabelIcon = L.Icon.extend({
  options: {
    mainText: '',
    subText: '',
    textClass: '',
    icn: '',
    shadowUrl: null,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  },
  createIcon: function () {
    var type = this.options['icn'],
      tClass = (this.options['textClass'] || '') + ' ';
    if (type) {
      this.options['iconUrl'] = 'img/icon-' + type + '.png';
      if ('waypoint,landmark'.indexOf(type) > -1) this.options['iconSize'] = [23, 23];
      if ('unlock,vista'.indexOf(type) > -1) this.options['iconSize'] = [23, 21];
      if ('skill'.indexOf(type) > -1) this.options['iconSize'] = [19, 23];
      if ('tasks'.indexOf(type) > -1) this.options['iconSize'] = [23, 19];
      this.options['iconAnchor'] = [~~this.options['iconSize'][0] / 2, ~~this.options['iconSize'][1] / 2];
    };
    var div = L.DomUtil.create('div', tClass + 'marker' + (type ? '-icon marker-' + type : ' marker-text')),
      i;
    if (this.options['iconUrl'])
      i = this._createImg(this.options['iconUrl']), div.appendChild(i), this._setIconStyles(i, 'icon');
    if (this.options['mainText'])
      L.DomUtil.create('div', 'main-text', div).innerHTML = this.options['mainText'];
    if (this.options['subText'])
      L.DomUtil.create('div', 'sub-text', div).innerHTML = this.options['subText'];
    return div;
  },
  //you could change this to add a shadow like in the normal marker if you really wanted
  createShadow: function () {
    return null;
  }
});