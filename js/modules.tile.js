// This does : Drawing base layer and build static world info.
AppModules.tile = function (root) {
  var worldLayers = L.layerGroup();
  var _tileSrcs = {};
  var self = {
    _worldLayers: worldLayers,
    _TEST: function (e) {
      for (var i = 0; i < 100; i++) {
        var l = ',event,group,jp,landmark,skill,target,tasks,unlock,vista,waypoint'.split(','),
          r = l[~~(Math.random() * l.length)];
        var marker = L.marker([Math.random() * 180 - 90, Math.random() * 360 - 180] || e && e.latlng || [0, 0], {
          icon: new L.LabelIcon({
            icn: r,
            mainText: 'hello the fucking',
            subText: r ? r : 'nope'
          })
        });
        worldLayers.addLayer(marker);
      }
    },
    continent: 1,
    baseLayers: function () {
      return {
        "Tyria": self.layer(1),
        "The Mists": self.layer(2)
      };
    },
    drawPOI: function () {},
    layer: function (continent) {
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
    onBaseLayerChange: function (e) {
      self.continent = e.name == "Tyria" ? 1 : 2;
      root.map.options.maxZoom = self.continent == 1 ? 7 : 6;
      root.map.setZoom(Math.min(root.map.getZoom(), root.map.options.maxZoom));
      //TODO: self.Draw.worldMarkers();
    },
    init: function () {
      worldLayers.addTo(root.map)
      root.map.on('baselayerchange', self.onBaseLayerChange);
      /*DBG*/
      root.map.on('click', self._TEST);
      /*DBG*/
    }
  };
  return self;
};