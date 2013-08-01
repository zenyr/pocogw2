AppModules.Player = function (self) {
  var data = {}, map, pos = [0, 0, 0],
    lastFetch;
  var poll = function () {
    var interval = 3000;
    self.Fetch.linker().done(function (aData) {
      interval = 200;
      for (var a in data) delete data[a];
      $.extend(data, aData);
      data.mapInd = data.map;
      data.pos = self.Geo.pos2ll({
        x: data.pos[0],
        y: data.pos[2]
      });
      try {
        markerSet(data);
        self.Options.setServer(data.server,true);
      } catch (e) {
        interval = 3000;
      }
    }).always(function () {
      setTimeout(poll, interval);
    });
  };
  var marker;
  var markerClear = function () {};
  var markerSet = function (o) {
    if (!marker) {
      marker = new _marker($.extend({}, o, {
        map: self.map
      }));
    } else {
      delete o.map;
      marker.setValues(o);
      marker.draw();
      if (self.Options.optFollow && (new Date() - self.Options.lastDrag > 2000))
        self.map.panTo(o.pos);
    }
  };
  var _marker = function (opt_options) {
    var that = this;
    this.setValues(opt_options);
    var span = document.createElement('span');
    var crot = this._crot = document.createElement('img');
    var prot = this._prot = document.createElement('img');
    var div = this.div = $(document.createElement('div'));
    this.v = false;
    crot.src = 'img/icon-crot.png';
    crot.className = 'crot';
    prot.src = 'img/icon-prot.png';
    prot.className = 'prot';
    this.input = {};
    this.deg = {};
    span.appendChild(crot);
    span.appendChild(prot);
    div.append(span).addClass('marker');
  };
  _marker.prototype = new google.maps.OverlayView;
  _marker.prototype.onAdd = function () {
    var pane = this.getPanes().overlayLayer;
    this.div.appendTo(pane);
  };
  _marker.prototype.onRemove = function () {
    this.div.remove();
    this.div = this._crot = this._prot = this.input = this.deg = null;
  };
  _marker.prototype.draw = function () {
    var that = this;
    var projection = this.getProjection();
    var position = projection.fromLatLngToDivPixel(this.get('pos'));
    if (!position) return;
    var div = this.div;
    var shouldVis = position.x * position.y != 0;
    var getDeg = function (type, target) {
      target = target || 0;
      var lastIn = that.input[type] || 0;
      var lastDeg = that.deg[type] || 0;
      var diff = target - lastIn;
      that.input[type] = target;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      that.deg[type] = lastDeg + diff;
    };
    if (this.v != shouldVis) {
      div.css({
        display: shouldVis ? 'block' : 'none'
      });
      this.v = shouldVis;
    }
    if (shouldVis) {
      div.css({
        left: position.x,
        top: position.y
      });
      getDeg('c', this.get('crot'));
      getDeg('p', this.get('prot'));
      this._prot.style.transform = this._prot.style.webkitTransform = 'rotate(' + (-this.deg['p'] || 0) + 'deg)';
      this._crot.style.transform = this._crot.style.webkitTransform = 'rotate(' + (-this.deg['c'] || 0) + 'deg)';
    }
  };
  return {
    linker: function () {
      return data
    },
    poll: poll
  }
};