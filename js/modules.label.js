AppModules.Label = function (self) {
  var labels = {}, _Label = function (opt_options) {
      this.setValues(opt_options);
      var div = this.div_ = document.createElement('div');
      var main = this.main_ = document.createElement('span');
      var alt = this.alt_ = document.createElement('small');
      if (this.get('icon')) {
        this.set('alt', this.get('label'));
        this.set('label', '');
      }
      main.style.cssText = (this.get('css') || '');
      main.className = this.get('icon') ? 'icon ' + this.get('icon') : '';
      main.innerHTML = this.get('label') || '';
      main.title = this.get('desc');
      main.setAttribute('data-type', this.get('_type'));
      main.setAttribute('data-uid', this.get('_uid'));
      alt.innerHTML = this.get('alt') || '';
      div.appendChild(main);
      div.appendChild(alt);
      div.className = 'label';
      this.v_ = !1;
    }, add = function (type, uid, options) {
      var lbls = labels[type];
      options._type = type;
      options._uid = uid;
      if (!lbls) {
        lbls = {};
        labels[type] = lbls;
      }
      if (!lbls[uid]) {
        lbls[uid] = new(type == 'e' ? (options.type == 'poly' ? _PolyEvent : _Event) : _Label)(options);
      } else {
        delete options.map;
        lbls[uid].setValues(options);
      }
      lbls = null;
      return true;
    }, clear = function (type) {
      var lbls = labels[type] || [];
      for (var i in lbls) {
        lbls[i].setMap(null);
        lbls[i] = null;
        delete lbls[i];
      }
    }, get = function (type, uid) {
      return (labels[type] ? labels[type][uid] || !1 : !1);
    }, getFromElement = function (element) {
      return element ? get(element.getAttribute('data-type'), element.getAttribute('data-uid')) : !1;
    };
  _Label.prototype = new google.maps.OverlayView;
  _Label.prototype.onAdd = function () {
    var pane = this.getPanes().overlayMouseTarget;
    pane.appendChild(this.div_);
  };
  _Label.prototype.onRemove = function () {
    this.div_.removeChild(this.main_);
    this.div_.removeChild(this.alt_);
    this.main_ = null;
    this.alt_ = null;
    this.div_.parentNode.removeChild(this.div_);
    this.div_ = null;
    this.v_ = null;
  };
  _Label.prototype.draw = function () {
    var projection = this.getProjection();
    var position = projection.fromLatLngToDivPixel(this.get('position'));
    var div = this.div_;
    var min = this.min || 0;
    var max = this.max || 7;
    var sMin = this.sMin || min;
    var zoom = self.Get.zoom();
    var shouldVis = (zoom >= min) && (zoom <= max);
    if (this.v_ != shouldVis) {
      div.style.display = (shouldVis ? 'block' : 'none');
      this.v_ = shouldVis;
    }
    if (shouldVis) {
      div.style.left = ~~position.x + 'px';
      div.style.top = ~~position.y + 'px';
      div.className = 'label ' + (zoom >= sMin ? '' : ' hide-small')
    }
  };
  var _Event = function (opt_options) {
    this.setValues(opt_options);
    var div = this.div_ = document.createElement('div');
    div.innerHTML = '&nbsp';
    div.className = 'event-area';
    div.setAttribute('data-type', this.get('_type'));
    div.setAttribute('data-uid', this.get('_uid'));
    this.v_ = !1;
  };
  _Event.prototype = new google.maps.OverlayView;
  _Event.prototype.onAdd = function () {
    var pane = this.getPanes().overlayMouseTarget;
    pane.appendChild(this.div_);
    this.div_ = $(this.div_).attr('title', this.get('desc'));
  };
  _Event.prototype.onRemove = function () {
    this.div_.remove();
    this.div_ = null;
    this.v_ = null;
    this.flags = null;
  };
  _Event.prototype.draw = function () {
    var projection = this.getProjection();
    var position = projection.fromLatLngToDivPixel(this.get('position'));
    var div = this.div_;
    var status = this.get('status') || 0;
    var zoom = self.Get.zoom();
    var flags = this.get('flags') || [];
    div.css({
      display: 'block',
      borderColor: ['transparent', '#000', '#fff', '#fc2'][status],
      opacity: (0.2 + this.get('status') * 0.8/3)
    });
    if (flags[0])
      div.css({
        borderColor: '#a33'
      });
    this.v_ = !0;
    var r = this.radius / Math.pow(2, 7 - zoom);
    div.css({
      borderRadius: r / 2,
      left: position.x - r / 2,
      top: position.y - r / 2,
      width: r,
      height: r,
      zIndex: status - 4
    });
  };
  var _PolyEvent = function (opt_options) {
    this.setValues(opt_options);
    this.v_ = !1;
  };
  _PolyEvent.prototype = new google.maps.OverlayView;
  _PolyEvent.prototype.onAdd = function () {
    var status = this.get('status') || 0;
    var polyOptions = {
      strokeColor: ['transparent', '#000', '#fff', '#fc2'][status],
      strokeOpacity: (0.2 + status * 0.8/3),
      strokeWeight: 3,
      clickable: !1
    };
    polyOptions.fillOpacity = polyOptions.strokeOpacity * 0.2;
    this.poly = new google.maps.Polygon(polyOptions);
    var path = this.poly.getPath();
    for (var i in this.positions) {
      path.push(this.positions[i]);
    }
    this.poly.setMap(this.map);
    var div = document.createElement('div');
    this.div_ = $(div).css({
      opacity: polyOptions.strokeOpacity
    }).attr({
      title: this.get('desc'),
      'data-type': this.get('_type'),
      'data-uid': this.get('_uid')
    }).html(' ').addClass('event-poly-center').appendTo(this.getPanes().overlayMouseTarget);
  };
  _PolyEvent.prototype.onRemove = function () {
    this.poly.setMap(null);
    this.poly = null;
    this.flags = null;
    this.div_.remove();
    this.div_ = null;
    this.positions;
  };
  _PolyEvent.prototype.draw = function () {
    var projection = this.getProjection();
    var position = projection.fromLatLngToDivPixel(this.get('position'));
    this.div_.css({
      left: ~~position.x,
      top: ~~position.y
    });
  };
  return {
    add: add,
    clear: clear,
    get: get,
    getFromElement: getFromElement
  };
};