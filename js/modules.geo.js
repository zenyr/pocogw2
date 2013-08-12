AppModules.geo = function (root) {
  var minMax = root.minMax = function (value, min, max) {
    return value < min ? min : value > max ? max : value;
  };
  var self = {
    a2ll: function (arr) {
      return self.p2ll(arr);
    },
    ll2p: function (ll) {
      return root.map.project(ll, root.tile.maxZoom());
    },
    p2ll: function (point) {
      var result = root.map.unproject(point, root.tile.maxZoom());
      if (result.lng > 180) result.lng -= 360;
      if (result.lng < -180) result.lng += 360;
      return result;
    },
    pos2ll: function (oXY, mapInd, isEvent) {
      if (oXY[0]) oXY = {
        x: oXY[0],
        y: oXY[1]
      };
      var map = mapInd || root.maps.getIndex();
      var inch = !isEvent ? 39.3700787 : 1;
      map = map ? root.maps.load(map) : false;
      var result = {};
      if (map) {
        result.x = (oXY.x * inch - map.mRect[0]) / map.mRect[2];
        result.y = (oXY.y * inch - map.mRect[1]) / map.mRect[3];
        result.y = 1 - result.y;
        result.x = map.cRect[0] + map.cRect[2] * result.x;
        result.y = map.cRect[1] + map.cRect[3] * result.y;
        result = L.point(result.x,result.y);
        return self.p2ll(result);
      }
      return false;
    }
  };
  return self;
};