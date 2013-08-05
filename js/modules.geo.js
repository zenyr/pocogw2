AppModules.geo = function (root) {
  var minMax = root.minMax = function (value, min, max) {
    return value < min ? min : value > max ? max : value;
  };
  var self= {
    a2ll: function (arr) {
      return self.p2ll(arr);
    },
    ll2p: function (ll) {
      var point = {},
        tiles = 1 << root.get.maxZoom(),
        sin_y = minMax(Math.sin(ll.lat() * (Math.PI / 180)), -0.9999, 0.9999);
      point.x = 128 + ll.lng() * (256 / 360);
      point.y = 128 + 0.5 * Math.log((1 + sin_y) / (1 - sin_y)) * -(256 / (2 * Math.PI));
      return L.point(Math.floor(point.x * tiles), Math.floor(point.y * tiles));
    },
    p2ll: function (point) {
      var size = (1 << root.get.maxZoom()) * 256,
        lat = (2 * Math.atan(Math.exp((point.y - size / 2) / -(size / (2 * Math.PI)))) - (Math.PI / 2)) * (180 / Math.PI),
        lng = (point.x - size / 2) * (360 / size);
      return L.latLng(lat, lng);
    },
    pos2ll: function (oXY, mapInd, isEvent) {
      if (oXY[0]) oXY = {
        x: oXY[0],
        y: oXY[1]
      };
      var map = mapInd || root.get.mapInd();
      var inch = !isEvent ? 39.3700787 : 1;
      map = map ? root.maps.load(map) : false;
      var result = {};
      if (map) {
        result.x = (oXY.x * inch - map.mRect[0]) / map.mRect[2];
        result.y = (oXY.y * inch - map.mRect[1]) / map.mRect[3];
        result.y = 1 - result.y;
        result.x = map.cRect[0] + map.cRect[2] * result.x;
        result.y = map.cRect[1] + map.cRect[3] * result.y;
        return self.p2ll(result);
      }
      return false;
    }
  };
  return self;
};