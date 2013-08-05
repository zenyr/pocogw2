// This does : Drawing base layer and build static world info.
AppModules.tile = function (root) {
  var $map;
  var _baseLayers = {};
  var _worldLayers = L.layerGroup();
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
      _worldLayers.clearLayers();
      for (var regionInd in data.regions) {
        var region = data.regions[regionInd];
        _worldLayers.addLayer(L.marker(root.geo.a2ll(region.label_coord), {
          icon: new L.LabelIcon({
            textClass: 'marker-region',
            mainText: region.name,
            subText: ''
          })
        }));
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
          if (realMapsData[ind]) {
            _worldLayers.addLayer(L.marker(root.geo.a2ll([cRect[0] + cRect[2] / 2, cRect[1] + cRect[3] / 2]), {
              icon: new L.LabelIcon({
                textClass: 'marker-map',
                mainText: map.name,
                subText: (map.min_level + map.max_level ? (map.min_level == map.max_level ? map.max_level : map.min_level + '-' + map.max_level) : '')
              })
            }));
            continue;
            self.Label.add('m', map.name, {
              map: self.map,
              position: self.Geo.p2ll({
                x: cRect[0] + cRect[2] / 2,
                y: cRect[1] + cRect[3] / 2
              }),
              label: '<i>' + map.name + '</i>',
              alt: (map.min_level + map.max_level ? (map.min_level == map.max_level ? map.max_level : map.min_level + '-' + map.max_level) : ''),
              max: 6,
              min: 3,
              css: 'color:#ff8;font-size:1.5em'
            });
          }
        } // each maps end
      } // each region end
    } // !!data end
  };
  var self = {
    _fillMaps: _fillMaps,
    _TEST: function (e) {
      console.log('Clicked', e.latlng);
      for (var i = 0; i < 1; i++) {
        var l = ',event,group,jp,landmark,skill,target,tasks,unlock,vista,waypoint'.split(','),
          r = l[~~(Math.random() * l.length)];
        var marker = L.marker(e.latlng || [Math.random() * 180 - 90, Math.random() * 360 - 180] || e && e.latlng || [0, 0], {
          icon: new L.LabelIcon({
            icn: r,
            mainText: 'hello this is a random',
            subText: r ? r : 'nope'
          })
        });
        _worldLayers.addLayer(marker);
      }
    },
    getBaseLayer: _getTile,
    continent: 1,
    maxZoom: function () {
      return self.continent == "1" ? 7 : 6;
    },
    drawPOI: function () {},
    onMoveEnd: function (e) {
      $map.removeClass('z1 z2 z3 z4 z5 z6 z7').addClass('z' + root.map.getZoom());
      //console.log(root.map.getCenter());
    },
    onBaseLayerChange: function (e) {
      console.log('FOOOO');
      self.continent = e.name == "Tyria" ? 1 : 2;
      root.map.options.maxZoom = self.continent == 1 ? 7 : 6;
      root.map.setZoom(Math.min(root.map.getZoom(), root.map.options.maxZoom));
      _fillMaps();
      //TODO: self.Draw.worldMarkers();
    },
    init: function () {
      $map = $('#map');
      _getTile(1), _getTile(2), _fillMaps();
      root.baseLayers = _baseLayers;
      root.layers['Regions'] = _worldLayers.addTo(root.map);
      root.map.on('baselayerchange', self.onBaseLayerChange);
      root.map.on('moveend', self.onMoveEnd);
      /*DBG*/
      root.map.on('click', self._TEST);
      /*DBG*/
    }
  };
  return self;
};