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
    distance: function (aRect, pixel) {
      var p = {
        x: pixel.x || pixel[0],
        y: pixel.y || pixel[1]
      };
      return {x: Math.max(aRect[0]-p.x , p.x-aRect[0]-aRect[2],0),y: Math.max(aRect[1]-p.y , p.y-aRect[1]-aRect[3],0)}
    },
    rDistance:function(aRect,pixel){
      var d = self.Rect.distance(aRect,pixel);
      return Math.sqrt(d.x*d.x+d.y*d.y);
    },
    minDistance:function(aRect,pixel){
      var d = self.Rect.distance(aRect,pixel);
      return Math.max(d.x,d.y);
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