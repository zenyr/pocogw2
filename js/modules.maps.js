AppModules.maps = function (root) {
    var _mapMarkers = L.layerGroup();
    var _sectorMarkers = L.layerGroup();
  var maps = {}, save = function (ind, raw) {
      if (!maps[ind]) maps[ind] = _.cloneDeep(raw);
      return self.load(ind);
    }, load = function (ind) {
      if(!ind) ind = index(1);
      return maps[ind];
    }, index = function (force) {
      /*DBG*/if (!root.player) root.player = {};
      /*DBG*/if (!root.player.linker) root.player.linker = {};
      if (force || !root.player.linker.mapInd) {
        var c = root.geo.ll2p(root.map.getCenter()),
          itm, closest = {}, d;
        for (var scanning in maps) {
          itm = maps[scanning];
          if (itm.continent != root.tile.continent)
            continue;
          if (!itm.isInstance || itm.continent == 2) {
            if (root.rect.contains(itm.cRect, c)) {
              return scanning;
            } else {
              d = root.rect.rDistance(itm.cRect, c);
              if (!closest.d || closest.d > d) {
                closest.m = scanning;
                closest.d = d;
              }
            }
          }
        }
        itm = null;
        return closest.m;
      } else return root.player.linker.mapInd;
      return false;
    }, _draw = function (map) {
      var types = {
        skill_challenges: 'skill',
        points_of_interest: 'poi',
        tasks: 'tasks'
      };
      map = map || root.maps.load(index(1));
      if (!map) return console.log('maps.draw: !map');
      _mapMarkers.clearLayers();
      _sectorMarkers.clearLayers();
      for (var sector in map.sectors) {
        sector = map.sectors[sector];
        _sectorMarkers.addLayer(L.labelMarker(sector.coord,{
            textClass: 'marker-sector',
            mainText: sector.name,
            subText:sector.level || ''
          }));
      }
      for (var type in types)
        for (var ind in map[type]) {
          var itm = map[type][ind];
          var _type = types[type];
          var _objText, _obj;
          if (itm.type) _type = itm.type;
          if (itm.objective) {
            var _skip = 'Help Assist sure on at the and in up for with of to how How off his her their against into'.split(' ');
            var i = 3;
            _skip = _.object(_skip, _skip);
            _objText = [];
            _obj = itm.objective.split(' ').reverse();
            while (i--) {
              while (_skip[_obj[_obj.length - 1]]) _obj.pop();
              _objText.push(_obj.pop());
            }
            _objText = _objText.join(' ').replace(/\.|,/, '').split('');
            _objText[0] = _objText[0].toUpperCase();
            _objText = _objText.join('');
          }
          _mapMarkers.addLayer(L.labelMarker(itm.coord,{
              icn: _type,
              mainText: itm.name || (_objText ? _objText + ' ' + itm.level : _type),
              subText: (itm.objective ? itm.objective :'') + (itm.poi_id ? '\nChat code: ' + chatCode(4, itm.poi_id) : '')
            }));
        } // itm,type
    }, // draw.mapMarkers
    chatCode= function (type, id) {
      return "[&" + btoa(String.fromCharCode(type) + String.fromCharCode(id % 256) + String.fromCharCode(Math.floor(id / 256)) + String.fromCharCode(0) + String.fromCharCode(0)) + "]";
    },
    lastMap,
    onMoveEnd = function (e) {
      var cMap = index(1);
      if (lastMap != cMap) {
        lastMap = cMap;
        root.on.trigger('mapChange');
      }
    },
    self = {
      save: save,
      load: load,
      getIndex: index,
      raw: maps,
      init: function () {
        root.on('moveend', onMoveEnd);
        root.on('mapChange', _draw);
        $map.on('mouseleave','.leaflet-popup-content-wrapper',function(){root.map.closePopup()});
        root.layerControl.addOverlay(_sectorMarkers.addTo(root.map), 'Sectors');
        root.layerControl.addOverlay(_mapMarkers.addTo(root.map), 'POI');
      }
    };
  return self;
};