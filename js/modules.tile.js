// This does : Drawing base layer and build static world info.
AppModules.tile = function (root) {
  var $map;
  var _baseLayers = {};
  var _worldLayers = L.layerGroup();
  var __parseRealMaps = function (aData) {
    var nData = {}, realMapsAdd = {
        18: "Divinity's Reach",
        91: 'The Grove',
        139: 'Rata Sum',
        218: 'Black Citadel',
        326: 'Hoelbrak'
      };;
    _(aData).forEach(function (t) {
      nData[t.id] = t.name;
    });
    _.assign(nData, realMapsAdd);
    return nData;
  };
  var _getTile = function (continent) {
    var name = ['', 'Tyria', 'The Mists'][continent];
    if (!_baseLayers[name])
      _baseLayers[name] = L.tileLayer.functional(function (view) {
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
    return _baseLayers[name];
  };
  var _fillMaps = function (data, realMapsData) {
    if (!data) {
      $.when(root.fetch('https://api.guildwars2.com/v1/map_floor.json?continent_id={c}&floor={f}', {
          c: self.continent,
          f: self.continent == 1 ? 2 : 1
        }),
        root.fetch('https://api.guildwars2.com/v1/map_names.json')).done(_fillMaps);
    } else {
      realMapsData=__parseRealMaps(realMapsData);
      _worldLayers.clearLayers();
      for (var regionInd in data.regions) {
        var region = data.regions[regionInd];
        _worldLayers.addLayer(L.labelMarker(region.label_coord, {            textClass: 'marker-region',
            mainText: region.name,
            subText: regionInd==5?'Maguuma':''          }
        ));
        for (var ind in region.maps) {
          var map = _.assign({}, region.maps[ind]);
          var cRect = root.rect.fromArray(map.continent_rect);
          var mRect = root.rect.fromArray(map.map_rect);
          _.assign(map, {
            continent: self.continent,
            cRect: cRect,
            mRect: mRect,
            isInstance: !realMapsData[ind]
          });
          root.maps.save(ind, map);
          if (self.continent == 2 || realMapsData[ind]) {
            _worldLayers.addLayer(L.labelMarker(cRect, {
              textClass: 'marker-map',
              mainText: map.name,
              subText: (map.min_level + map.max_level ? (map.min_level == map.max_level ? map.max_level : map.min_level + '-' + map.max_level) : '')
            }));
          }
        } // each maps end
      } // each region end
    } // !!data end
  };
  var self = {
    _TEST: function (e) {
      //console.log('Clicked', e.latlng);
    },
    getBaseLayer: _getTile,
    continent: 1,
    maxZoom: function () {
      return self.continent == "1" ? 7 : 6;
    },
    drawPOI: function () {},
    onMoveEnd: function (e) {
      $map.removeClass('z1 z2 z3 z4 z5 z6 z7').addClass('z' + root.map.getZoom());
    },
    onBaseLayerChange: function (e) {
      self.continent = e.name == "Tyria" ? 1 : 2;
      root.map.options.maxZoom = self.continent == 1 ? 7 : 6;
      root.map.setZoom(Math.min(root.map.getZoom(), root.map.options.maxZoom));
      _fillMaps();
      root.on.trigger('mapChange');
      //TODO: self.Draw.worldMarkers();
    },
    init: function () {
      $map = $('#map');
      _fillMaps();
      root.layerControl.addBaseLayer(_getTile(1), 'Tyria');
      root.layerControl.addBaseLayer(_getTile(2), 'The Mists');
      root.layerControl.addOverlay(_worldLayers.addTo(root.map), 'Regions');
      root.on('baselayerchange', self.onBaseLayerChange);
      root.on('moveend', self.onMoveEnd);
      /*DBG*/
      root.on('click', self._TEST);
      /*DBG*/
    }
  };
  return self;
};