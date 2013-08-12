L.playerMarker = function (ll) {
  var marker = L.marker(ll, {
    shadowUrl: null,
    keyboard: !1,
    clickable: !1,
    icon: L.divIcon({
      className: 'marker-player',
      iconSize: L.point(93, 86),
      html: '<div id="prot"></div><div id="crot"></div>'
    })
  });

  marker.input={};
  marker.deg = {};
  marker._update = marker.update;
  marker.update = function () {
    if(!this.$prot){
      this.$prot = $('#prot');
      this.$crot = $('#crot'); 
    }
    var that = this;
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
    getDeg('c', this.options.crot);
    getDeg('p', this.options.prot);
    this.$prot.css('transform','rotate(' + (-this.deg['p'] || 0) + 'deg)');
    this.$crot.css('transform','rotate(' + (-this.deg['c'] || 0) + 'deg)');
    return this._update.apply(this, arguments);
  };
  marker._onRemove = marker.onRemove;
  marker.onRemove = function () {
    this.off().unbindPopup();
    return this._onRemove.apply(this, arguments);
  };
  return marker;
};
///////////////////////////////////////////
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
  }
});
L.labelMarker = function (ll, iOpt, mOpt) {
  if (!ll.lat) {
    if (ll[2]) ll = app.rect.midPoint(ll);
    ll = app.geo.a2ll(ll);
  }
  var _mOpt = _.assign({
    keyboard: false,
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
        this.options.zIndexOffset = 1 + stage * 100;
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
          inner.poly.options.weight = stage - 1;
          inner.poly.options.color = bColor;
          inner.poly.options.fillOpacity = stage / 60;
          if (!inner.poly._owner) {
            inner.poly._owner = this;
            inner.poly.addTo(this._map);
          } else {
            inner.poly.setStyle({
              borderWidth: stage - 1,
              borderColor: bColor
            });
          }
        }
        if (isChanged)
          this.$icon.find('.sub-text').text(inner.options['subText']);
      } else {
        this.options.zIndexOffset = this._icon ? 1000 : 1;
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
//////////////////////
var LZString = {
  _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  _f: function (r) {
    return String.fromCharCode(r)
  },
  compressToBase64: function (r) {
    var e, o, a, t, i, s, h, n = "",
      c = 0
    for (r = this.compress(r); c < 2 * r.length;) 0 == c % 2 ? (e = r.charCodeAt(c / 2) >> 8, o = 255 & r.charCodeAt(c / 2), a = c / 2 + 1 < r.length ? r.charCodeAt(c / 2 + 1) >> 8 : 0 / 0) : (e = 255 & r.charCodeAt((c - 1) / 2), (c + 1) / 2 < r.length ? (o = r.charCodeAt((c + 1) / 2) >> 8, a = 255 & r.charCodeAt((c + 1) / 2)) : o = a = 0 / 0), c += 3, t = e >> 2, i = (3 & e) << 4 | o >> 4, s = (15 & o) << 2 | a >> 6, h = 63 & a, isNaN(o) ? s = h = 64 : isNaN(a) && (h = 64), n = n + this._keyStr.charAt(t) + this._keyStr.charAt(i) + this._keyStr.charAt(s) + this._keyStr.charAt(h)
    return n
  },
  decompressFromBase64: function (r) {
    var e, o, a, t, i, s, h, n, c = "",
      f = 0,
      d = 0,
      C = this._f
    for (r = r.replace(/[^A-Za-z0-9\+\/\=]/g, ""); d < r.length;) i = this._keyStr.indexOf(r.charAt(d++)), s = this._keyStr.indexOf(r.charAt(d++)), h = this._keyStr.indexOf(r.charAt(d++)), n = this._keyStr.indexOf(r.charAt(d++)), o = i << 2 | s >> 4, a = (15 & s) << 4 | h >> 2, t = (3 & h) << 6 | n, 0 == f % 2 ? (e = o << 8, 64 != h && (c += C(e | a)), 64 != n && (e = t << 8)) : (c += C(e | o), 64 != h && (e = a << 8), 64 != n && (c += C(e | t))), f += 3
    return this.decompress(c)
  },
  compressToUTF16: function (r) {
    var e, o, a, t = "",
      i = 0,
      s = this._f
    for (r = this.compress(r), e = 0; e < r.length; e++) switch (o = r.charCodeAt(e), i++) {
    case 0:
      t += s((o >> 1) + 32), a = (1 & o) << 14
      break
    case 1:
      t += s(a + (o >> 2) + 32), a = (3 & o) << 13
      break
    case 2:
      t += s(a + (o >> 3) + 32), a = (7 & o) << 12
      break
    case 3:
      t += s(a + (o >> 4) + 32), a = (15 & o) << 11
      break
    case 4:
      t += s(a + (o >> 5) + 32), a = (31 & o) << 10
      break
    case 5:
      t += s(a + (o >> 6) + 32), a = (63 & o) << 9
      break
    case 6:
      t += s(a + (o >> 7) + 32), a = (127 & o) << 8
      break
    case 7:
      t += s(a + (o >> 8) + 32), a = (255 & o) << 7
      break
    case 8:
      t += s(a + (o >> 9) + 32), a = (511 & o) << 6
      break
    case 9:
      t += s(a + (o >> 10) + 32), a = (1023 & o) << 5
      break
    case 10:
      t += s(a + (o >> 11) + 32), a = (2047 & o) << 4
      break
    case 11:
      t += s(a + (o >> 12) + 32), a = (4095 & o) << 3
      break
    case 12:
      t += s(a + (o >> 13) + 32), a = (8191 & o) << 2
      break
    case 13:
      t += s(a + (o >> 14) + 32), a = (16383 & o) << 1
      break
    case 14:
      t += s(a + (o >> 15) + 32, (32767 & o) + 32), i = 0
    }
    return t + s(a + 32)
  },
  decompressFromUTF16: function (r) {
    for (var e, o, a = "", t = 0, i = 0, s = this._f; i < r.length;) {
      switch (o = r.charCodeAt(i) - 32, t++) {
      case 0:
        e = o << 1
        break
      case 1:
        a += s(e | o >> 14), e = (16383 & o) << 2
        break
      case 2:
        a += s(e | o >> 13), e = (8191 & o) << 3
        break
      case 3:
        a += s(e | o >> 12), e = (4095 & o) << 4
        break
      case 4:
        a += s(e | o >> 11), e = (2047 & o) << 5
        break
      case 5:
        a += s(e | o >> 10), e = (1023 & o) << 6
        break
      case 6:
        a += s(e | o >> 9), e = (511 & o) << 7
        break
      case 7:
        a += s(e | o >> 8), e = (255 & o) << 8
        break
      case 8:
        a += s(e | o >> 7), e = (127 & o) << 9
        break
      case 9:
        a += s(e | o >> 6), e = (63 & o) << 10
        break
      case 10:
        a += s(e | o >> 5), e = (31 & o) << 11
        break
      case 11:
        a += s(e | o >> 4), e = (15 & o) << 12
        break
      case 12:
        a += s(e | o >> 3), e = (7 & o) << 13
        break
      case 13:
        a += s(e | o >> 2), e = (3 & o) << 14
        break
      case 14:
        a += s(e | o >> 1), e = (1 & o) << 15
        break
      case 15:
        a += s(e | o), t = 0
      }
      i++
    }
    return this.decompress(a)
  },
  compress: function (r) {
    var e, o, a, t = {}, i = {}, s = "",
      h = "",
      n = "",
      c = 2,
      f = 3,
      d = 2,
      C = "",
      p = 0,
      k = 0,
      l = this._f
    for (a = 0; a < r.length; a += 1)
      if (s = r.charAt(a), t.hasOwnProperty(s) || (t[s] = f++, i[s] = !0), h = n + s, t.hasOwnProperty(h)) n = h
      else {
        if (i.hasOwnProperty(n)) {
          if (n.charCodeAt(0) < 256) {
            for (e = 0; d > e; e++) p <<= 1, 15 == k ? (k = 0, C += l(p), p = 0) : k++
            for (o = n.charCodeAt(0), e = 0; 8 > e; e++) p = p << 1 | 1 & o, 15 == k ? (k = 0, C += l(p), p = 0) : k++, o >>= 1
          } else {
            for (o = 1, e = 0; d > e; e++) p = p << 1 | o, 15 == k ? (k = 0, C += l(p), p = 0) : k++, o = 0
            for (o = n.charCodeAt(0), e = 0; 16 > e; e++) p = p << 1 | 1 & o, 15 == k ? (k = 0, C += l(p), p = 0) : k++, o >>= 1
          }
          c--, 0 == c && (c = Math.pow(2, d), d++), delete i[n]
        } else
          for (o = t[n], e = 0; d > e; e++) p = p << 1 | 1 & o, 15 == k ? (k = 0, C += l(p), p = 0) : k++, o >>= 1
        c--, 0 == c && (c = Math.pow(2, d), d++), t[h] = f++, n = s + ""
      }
    if ("" !== n) {
      if (i.hasOwnProperty(n)) {
        if (n.charCodeAt(0) < 256) {
          for (e = 0; d > e; e++) p <<= 1, 15 == k ? (k = 0, C += l(p), p = 0) : k++
          for (o = n.charCodeAt(0), e = 0; 8 > e; e++) p = p << 1 | 1 & o, 15 == k ? (k = 0, C += l(p), p = 0) : k++, o >>= 1
        } else {
          for (o = 1, e = 0; d > e; e++) p = p << 1 | o, 15 == k ? (k = 0, C += l(p), p = 0) : k++, o = 0
          for (o = n.charCodeAt(0), e = 0; 16 > e; e++) p = p << 1 | 1 & o, 15 == k ? (k = 0, C += l(p), p = 0) : k++, o >>= 1
        }
        c--, 0 == c && (c = Math.pow(2, d), d++), delete i[n]
      } else
        for (o = t[n], e = 0; d > e; e++) p = p << 1 | 1 & o, 15 == k ? (k = 0, C += l(p), p = 0) : k++, o >>= 1
      c--, 0 == c && (c = Math.pow(2, d), d++)
    }
    for (o = 2, e = 0; d > e; e++) p = p << 1 | 1 & o, 15 == k ? (k = 0, C += l(p), p = 0) : k++, o >>= 1
    for (;;) {
      if (p <<= 1, 15 == k) {
        C += l(p)
        break
      }
      k++
    }
    return C
  },
  decompress: function (r) {
    var e, o, a, t, i, s, h, n, c = [],
      f = 4,
      d = 4,
      C = 3,
      p = "",
      k = "",
      l = 0,
      b = this._f,
      g = {
        string: r,
        val: r.charCodeAt(0),
        position: 32768,
        index: 1
      }
    for (o = 0; 3 > o; o += 1) c[o] = o
    for (t = 0, s = Math.pow(2, 2), h = 1; h != s;) i = g.val & g.position, g.position >>= 1, 0 == g.position && (g.position = 32768, g.val = g.string.charCodeAt(g.index++)), t |= (i > 0 ? 1 : 0) * h, h <<= 1
    switch (e = t) {
    case 0:
      for (t = 0, s = Math.pow(2, 8), h = 1; h != s;) i = g.val & g.position, g.position >>= 1, 0 == g.position && (g.position = 32768, g.val = g.string.charCodeAt(g.index++)), t |= (i > 0 ? 1 : 0) * h, h <<= 1
      n = b(t)
      break
    case 1:
      for (t = 0, s = Math.pow(2, 16), h = 1; h != s;) i = g.val & g.position, g.position >>= 1, 0 == g.position && (g.position = 32768, g.val = g.string.charCodeAt(g.index++)), t |= (i > 0 ? 1 : 0) * h, h <<= 1
      n = b(t)
      break
    case 2:
      return ""
    }
    for (c[3] = n, a = k = n;;) {
      for (t = 0, s = Math.pow(2, C), h = 1; h != s;) i = g.val & g.position, g.position >>= 1, 0 == g.position && (g.position = 32768, g.val = g.string.charCodeAt(g.index++)), t |= (i > 0 ? 1 : 0) * h, h <<= 1
      switch (n = t) {
      case 0:
        if (l++ > 1e4) return "Error"
        for (t = 0, s = Math.pow(2, 8), h = 1; h != s;) i = g.val & g.position, g.position >>= 1, 0 == g.position && (g.position = 32768, g.val = g.string.charCodeAt(g.index++)), t |= (i > 0 ? 1 : 0) * h, h <<= 1
        c[d++] = b(t), n = d - 1, f--
        break
      case 1:
        for (t = 0, s = Math.pow(2, 16), h = 1; h != s;) i = g.val & g.position, g.position >>= 1, 0 == g.position && (g.position = 32768, g.val = g.string.charCodeAt(g.index++)), t |= (i > 0 ? 1 : 0) * h, h <<= 1
        c[d++] = b(t), n = d - 1, f--
        break
      case 2:
        return k
      }
      if (0 == f && (f = Math.pow(2, C), C++), c[n]) p = c[n]
      else {
        if (n !== d) return null
        p = a + a.charAt(0)
      }
      k += p, c[d++] = a + p.charAt(0), f--, a = p, 0 == f && (f = Math.pow(2, C), C++)
    }
  }
}