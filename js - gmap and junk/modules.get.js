AppModules.Get = function (self) {
  var _tileSrcs = {}, _continent = 1;
  return {
    continent: function (__val) {
      if (__val) _continent = __val;
      return _continent;
    },
    zoom: function () {
      return self.map.getZoom();
    },
    maxZoom: function () {
      return self.Get.continent() == "1" ? 7 : 6;
    },
    server: function () {
      return self.Options.optServer || false
    },
    baseLayers: function () {
      return {
        "Tyria": self.Get.tileSrc(1),
        "The Mists": self.Get.tileSrc(2)
      };
    },
    tileSrc: function (continent) {
      if (!_tileSrcs[continent])
        _tileSrcs[continent] = L.tileLayer.functional(function (view) {
          var url = "https://tiles.guildwars2.com/{continent}/1/{z}/{y}/{x}.jpg"
            .replace('{continent}', continent)
            .replace('{z}', view.zoom)
            .replace('{x}', view.tile.row)
            .replace('{y}', view.tile.column);
          if (view.tile.column < 0 || view.tile.row < 0 || view.tile.column >= (1 << view.zoom) || view.tile.row >= (1 << view.zoom)) {
            return "http://placehold.it/256/000000/222222";
          } else if ((continent == "2") && (view.zoom > 2) && (view.tile.row <= (1 << view.zoom - 2) - 2)) {
            return "http://placehold.it/256/ffffff/888888";
          } else if ((continent == "2") && (view.zoom > 6)) {
            return "http://placehold.it/256/888888/ffffff/";
          } else return url;
        }, {
          attribution: '&copy; Arenanet'
        });
      return _tileSrcs[continent];
    },
    mapInd: function (force) {
      if (force || !self.Player.linker().mapInd) {
        var c = self.Geo.ll2p(self.map.getCenter()),
          itm, closest = {}, d;
        for (var scanning in self.Maps.raw) {
          itm = self.Maps.load(scanning);
          if (itm.continent != self.Get.continent())
            continue;
          if (!itm.isInstance || itm.continent == 2) {
            if (self.Rect.contains(itm.cRect, c)) {
              return scanning;
            } else {
              d = self.Rect.rDistance(itm.cRect, c);
              if (!closest.d || closest.d > d) {
                closest.m = scanning;
                closest.d = d;
              }
            }
          }
        }
        itm = null;
        return closest.m;
      } else return self.Player.linker().mapInd;
      return false;
    },
    chatCode: function (type, id) {
      return "[&" + btoa(String.fromCharCode(type) + String.fromCharCode(id % 256) + String.fromCharCode(Math.floor(id / 256)) + String.fromCharCode(0) + String.fromCharCode(0)) + "]";
    },
    mapNames: function () {}
  }
};