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
    if (this.options['radius'])
      this.range = $(L.DomUtil.create('div', 'marker-range', div));
    if (this.options['poly']) {
      this.poly = L.polygon(this.options['poly']).on('click', function (e) {
        e.target._owner.fire('click');
      });
    }
    return div;
  },
  //you could change this to add a shadow like in the normal marker if you really wanted
  createShadow: function () {
    return null;
  }
});
L.labelMarker = function (ll, iOpt, mOpt) {
  if (!ll.lat) {
    if (ll[2]) ll = app.rect.midPoint(ll);
    ll = app.geo.a2ll(ll);
  }
  var _mOpt = _.assign({
    riseOnHover: true,
    riseOffset: 100,
    icon: new L.LabelIcon(iOpt)
  }, mOpt),
    marker = L.marker(ll, _mOpt);
  marker.bindPopup(null, {
    closeButton: false
  });
  marker._update = marker.update;
  marker.update = function () {
    //marker.onPaint
    if (this._icon) {
      var inner = this.options.icon;
      this.setPopupContent((inner.options.subText || inner.options.mainText || ''));
      if (inner.range) {
        var z = this._map.getZoom();
        var r = ~~ (inner.options.radius / Math.pow(2, 7 - z));
        inner.range.css({
          width: r,
          height: r,
          left: -r / 2,
          top: -r / 2
        });
      }
      if (!this.$icon)
        this.$icon = $(this._icon);
      if (inner.options.stage) {
        var stage = inner.options.stage;
        var lastStatus = inner.options.lastStage || 9;
        var isChanged = lastStatus != stage;
        var isElevated = lastStatus < stage && stage > 3;
        var bColor = ['#000', '#000', '#fff', '#fc2'][stage - 1];
        if (inner.options.icn == 'group') {
          var cA = bColor.split('');
          cA[2] = ~~ (_.parseInt(cA[2], 16) / 2);
          cA[3] = ~~ (_.parseInt(cA[3], 16) / 2);
          bColor = cA.join('');
        }
        this.options.zIndexOffset = 1 + stage * 10;
        this.$icon.css({
          opacity: stage / 4
        });
        if (inner.range) {
          inner.range.css({
            borderWidth: stage - 1,
            borderColor: bColor
          }).toggleClass('event-elevated', isElevated);
        }
        if (inner.poly) {
          if (!inner.poly._owner) inner.poly._owner = this;
          inner.poly.options.weight = stage - 1;
          inner.poly.options.color = bColor;
          inner.poly.options.fillOpacity = stage / 60;
          inner.poly.addTo(this._map);
        }
        if (isChanged)
          this.$icon.find('.sub-text').text(inner.options['subText']);
      } else {
        this.options.zIndexOffset = this.$icon ? 1000 : 1;
      }
    }
    return this._update.apply(this, arguments);
  };
  marker._onRemove = marker.onRemove;
  marker.onRemove = function () {
    //marker.onRemove
    this.off().unbindPopup();
    var inner = this.options.icon;
    if (inner.range) {
      inner.range.remove();
      delete inner.range;
    }
    if (inner.poly) {
      inner.poly.off();
      delete inner.poly._owner;
      this._map.removeLayer(inner.poly);
      delete inner.poly;
    };
    delete this.$icon;
    return this._onRemove.apply(this, arguments);
  };
  return marker;
};