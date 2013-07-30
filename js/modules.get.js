AppModules.Get = function (self) {
  return {
    continent: function () {
      return self.map.getMapTypeId();
    },
    zoom: function () {
      return self.map.getZoom();
    },
    maxZoom: function () {
      return self.Get.continent() == "1" ? 7 : 6;
    },
    tileSrc: function (coords, zoom) {
      var mapId = self.map.getMapTypeId();
      if (coords.y < 0 || coords.x < 0 || coords.y >= (1 << zoom) || coords.x >= (1 << zoom)) {
        return "http://placehold.it/256/000000/222222";
      } else if ((mapId == "2") && (zoom > 2) && (coords.y <= (1 << zoom - 2) - 2)) {
        return "http://placehold.it/256/ffffff/888888";
      }
      return "https://tiles.guildwars2.com/" + mapId + "/1/" + zoom + "/" + coords.x + "/" + coords.y + ".jpg";
    },
    mapInd: function (force) {
      if (force || !self.Player.map) {
        var c = self.Geo.ll2p(self.map.getCenter()),
          itm;
        for (var scanning in self.Maps.raw) {
          itm = self.Maps.raw[scanning];
          if (!itm.isInstance) {
            if (self.Rect.contains(itm.cRect, c)) {
              return scanning;
            }
          }
        }
        itm = null;
      } else return self.Player.map;
      return false;
    },
    chatCode: function (type, id) {
      return "[&" + btoa(String.fromCharCode(type) + String.fromCharCode(id % 256) + String.fromCharCode(Math.floor(id / 256)) + String.fromCharCode(0) + String.fromCharCode(0)) + "]";
    },
    mapNames: function () {}
  }
};