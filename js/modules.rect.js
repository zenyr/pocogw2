AppModules.Rect = function (self) {
  return {
    normalize: function (aRect) {
      if (isNaN(aRect[0])) {
        _.map(aRect, function (a) {
          return a + 0;
        });
      }
      return aRect;
    },
    fromArray: function (arrarr) { // left,top, width, height
      return [arrarr[0][0], arrarr[0][1], arrarr[1][0] - arrarr[0][0], arrarr[1][1] - arrarr[0][1]]
    },
    contains: function (aRect, pixel) {
      var p = {
        x: pixel.x || pixel[0],
        y: pixel.y || pixel[1]
      };
      return ((p.x >= aRect[0]) && (p.x < aRect[0] + aRect[2]) && (p.y >= aRect[1]) && (p.y < aRect[1] + aRect[3]));
    },
    toBounds: function (aRect) {
      self.Rect.normalize(aRect);
      return new google.maps.LatLngBounds(
        self.Geo.p2ll({
          x: aRect[0],
          y: aRect[1] + aRect[3]
        }),
        self.Geo.p2ll({
          x: aRect[0] + aRect[2],
          y: aRect[1]
        })
      );
    }
  }
};