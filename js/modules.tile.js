// This does : Drawing base layer and build static world info.
AppModules.tile = function (root) {
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
  var _testFloor = function (llb, floor) {
    var c = self.continent,
      r = [],
      mllb;
    for (var m in root.maps.raw) {
      m = root.maps.raw[m];
      try {
        if (c != m.continent) continue;
        p1 = root.map.unproject(L.point([m.cRect[0] + 1, m.cRect[1]] + 1));
        p2 = root.map.unproject(L.point([m.cRect[2] + 1, m.cRect[3]] + 1));
        mllb = L.latLngBounds([p1, p2]);
        if (mllb.intersects(llb))
          r.push(m);
      } catch (e) {
        console.log('testfloor', e.message, m.cRect);
      }
    }
    return r;
  };
  root._testFloor = _testFloor;
  var _getTile = function (continent) {
    var name = ['', 'Tyria', 'The Mists'][continent];
    if (!_baseLayers[name])
      _baseLayers[name] = L.tileLayer.functional(function (view) {
        var f = window.f == undefined ? 1 : window.f;
        if (view.tile.column < 0 || view.tile.row < 0 || view.tile.column >= (1 << view.zoom) || view.tile.row >= (1 << view.zoom)) {
          return "http://placehold.it/256/000000/222222";
        } else if ((continent == "2") && (view.zoom > 2) && (view.tile.row <= (1 << view.zoom - 2) - 2)) {
          return "http://placehold.it/256/ffffff/888888";
        } else if ((continent == "2") && (view.zoom > 6)) {
          return "http://placehold.it/256/888888/ffffff/";
        } else if (false && root.tile['done' + continent] && !_testFloor(view.bounds, f).length > 0) {
          return "http://placehold.it/256/ff8800/ffffff/";
        }
        return "https://tiles.guildwars2.com/{continent}/{f}/{z}/{y}/{x}.jpg"
          .replace('{f}', f) //DBG
        .replace('{continent}', continent)
          .replace('{z}', view.zoom)
          .replace('{x}', view.tile.row)
          .replace('{y}', view.tile.column);;
      }, {
        attribution: '&copy; Arenanet'
      });
    return _baseLayers[name];
  };
  var _fillMaps = function (data, realMapsData) {
    if (!data) {
      $.when(root.fetch.map(self.continent), root.fetch('https://api.guildwars2.com/v1/map_names.json')).done(_fillMaps);
    } else {
      var injectJP = function (data) {
        var jp = {"15":[{"coord":[13172,13674],"floor":1,"name":"Demongrub Pits","type":"jp"}],"17":[{"coord":[14334,9658],"floor":1,"name":"Fawcett's Bounty","type":"jp"}],"19":[{"coord":[28450,15484],"floor":1,"name":"Loreclaw Expanse","type":"jp"}],"20":[{"coord":[31126,15205],"floor":1,"name":"Behem Gauntlet","type":"jp"},{"coord":[30798,12335],"floor":1,"name":"Craze's Folly","type":"jp"}],"21":[{"coord":[28844,16805],"floor":1,"name":"Branded Mine","type":"jp"}],"22":[{"coord":[25982,10715],"floor":1,"name":"Pig Iron Quarry","type":"jp"}],"23":[{"coord":[12797,15959],"floor":1,"name":"The Collapsed Observatory","type":"jp"}],"24":[{"coord":[16529,14234],"floor":1,"name":"Swashbuckler's Cove","type":"jp"},{"coord":[15377,14278],"floor":1,"name":"Not So Secret","type":"jp"}],"25":[{"coord":[27387,13050],"floor":1,"name":"Chaos Crystal Cavern","type":"jp"}],"26":[{"coord":[19819,17925],"floor":1,"name":"Tribulation Rift Scaffolding","type":"jp"},{"coord":[19717,18031],"floor":1,"name":"Tribulation Caverns","type":"jp"}],"27":[{"coord":[18091,17112],"floor":1,"name":"Griffonrook Run","type":"jp"}],"28":[{"coord":[22025,13485],"floor":1,"name":"Shamans Rookery","type":"jp"}],"29":[{"coord":[20588,20956],"floor":1,"name":"Coddler’s Cove","type":"jp"},{"coord":[21145,18936],"floor":1,"name":"Only Zuhl","type":"jp"}],"30":[{"coord":[22105,9057],"floor":1,"name":"Shattered Ice Ruins","type":"jp"}],"31":[{"coord":[21458,12335],"floor":1,"name":"King Jalis's Refuge","type":"jp"}],"32":[{"coord":[26189,13069],"floor":1,"name":"Crimson Plateau","type":"jp"},{"coord":[25154,12240],"floor":1,"name":"Grendich Gamble","type":"jp"},{"coord":[25555,13377],"floor":1,"name":"Wall Breach Blitz","type":"jp"}],"34":[{"coord":[10870,19112],"floor":1,"name":"Dark Reverie","type":"jp"},{"coord":[11014,19353],"floor":1,"name":"Morgan's Leap","type":"jp"},{"coord":[9398,18590],"floor":1,"name":"Spekks's Laboratory","type":"jp"},{"coord":[10625,19987],"floor":1,"name":"Spelunker's Delve","type":"jp"}],"35":[{"coord":[9214,18995],"floor":1,"name":"Goemm's Lab","type":"jp"}],"39":[{"coord":[17951,21645],"floor":1,"name":"Conundrum Cubed","type":"jp"},{"coord":[20726,23414],"floor":1,"name":"Hidden Garden","type":"jp"}],"50":[{"coord":[16302,14617],"floor":1,"name":"Troll's End","type":"jp"},{"coord":[17423,14656],"floor":1,"name":"Urmaug's Secret","type":"jp"},{"coord":[17342,15613],"floor":1,"name":"Weyandt's Revenge","type":"jp"}],"51":[{"coord":[16340,24466],"floor":1,"name":"Vizier's Tower","type":"jp"}],"53":[{"coord":[17558,22002],"floor":1,"name":"Hexfoundry Unhinged","type":"jp"}],"62":[{"coord":[11160,28777],"floor":1,"name":"Buried Archives","type":"jp"}],"65":[{"coord":[13627,24811],"floor":1,"name":"Antre of Adjournment","type":"jp"},{"coord":[13611,25047],"floor":1,"name":"Scavenger's Chasm","type":"jp"}],"73":[{"coord":[15718,16409],"floor":1,"name":"Professor Portmatt's Lab","type":"jp"}],"873":[{"coord":[13922,20481],"floor":1,"name":"Under New Management","type":"jp"},{"coord":[12798,19463],"floor":1,"name":"Skipping Stones","type":"jp"}]};
        for (var regionInd in data.regions)
          for (var mapInd in data.regions[regionInd].maps) {
            if (!jp[mapInd]) continue;
            var map = data.regions[regionInd].maps[mapInd];
            //console.log('map..',mapInd,':',map.name);          
            while (jp[mapInd].length > 0)
              map.points_of_interest.push(jp[mapInd].pop());
            map = null;
          }
      };
      realMapsData = __parseRealMaps(realMapsData);
      injectJP(data);
      _worldLayers.clearLayers();
      for (var regionInd in data.regions) {
        var region = data.regions[regionInd];
        _worldLayers.addLayer(L.labelMarker(region.label_coord, {
          textClass: 'marker-region',
          mainText: region.name,
          subText: regionInd == 5 ? 'Maguuma' : ''
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
          if (self.continent == 2 || realMapsData[ind] || window.F) {
            _worldLayers.addLayer(L.labelMarker(cRect, {
              textClass: 'marker-map',
              mainText: map.name,
              subText: ind + '/' + map.default_floor || (map.min_level + map.max_level ? (map.min_level == map.max_level ? map.max_level : map.min_level + '-' + map.max_level) : '')
            }));
          }
        } // each maps end
      } // each region end
      self['done' + self.continent] = !0;
    } // !!data end
  };
  var movingTmr;
  var self = {
    _TEST: function (e) {
      var p = root.geo.ll2p(e.latlng),
        a = root.maps.getIndex(1, 1);
      var b = _(a).map(app.maps.load).map(function (n, i) {
        return a[i] + ':' + n.name + ',' + n.default_floor
      });
      //      console.log(b.value());
    },
    getBaseLayer: _getTile,
    continent: 1,
    maxZoom: function () {
      return self.continent == "1" ? 7 : 6;
    },
    drawPOI: function () {},
    onMoveEnd: function (e) {
      root.$map.removeClass('z2 z3 z4 z5 z6 z7').addClass('z' + Math.max(2, root.map.getZoom()));
    },
    onDrag: function (e) {
      if(e.type=='mousemove' && !self.moving) return;
      self.moving = 1, clearTimeout(movingTmr), movingTmr = setTimeout(function () {
        self.moving = 0;
      }, 3000)
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
      _fillMaps();
      root.layerControl.addBaseLayer(_getTile(1), 'Tyria');
      root.layerControl.addBaseLayer(_getTile(2), 'The Mists');
      root.layerControl.addOverlay(_worldLayers.addTo(root.map), 'Regions');
      root.on('baselayerchange', self.onBaseLayerChange);
      root.on('moveend', self.onMoveEnd);
      root.on('keydown,mousemove,dragstart,drag,dragend', self.onDrag);
      root.on.trigger('moveend');
      /*DBG*/
      root.on('click', self._TEST);
      /*DBG*/
    }
  };
  return self;
};