AppModules.events = function (root) {
  var _eventMarkers = L.layerGroup();
  var _cache = {};
  var tmr, toggleDraw = function (e) {
      if (e.layer == _eventMarkers) {
        ({
          overlayremove: function () {
            if (tmr) clearInterval(tmr);
          },
          overlayadd: function () {
            if (!tmr) tmr = setInterval(_draw, 5e3);
            _draw();
          }
        }[e.type])();
      }
    };
  var _clearCache = function (now) {
    for (var i in _cache) {
      if (!now || _cache[i].time != now) {
        _eventMarkers.removeLayer(_cache[i].marker);
        delete _cache[i];
      }
    }
  };
  var expectedInd;
  var _draw = function (data, detail) {
    if (!data) {
      var expectedInd = root.maps.getIndex(root.tile.moving);
      var server = root.player.linker.server || 1021;
      self._expectedInd = expectedInd;
      if (root.tile.continent == 2 || !expectedInd) return;
      if(server > 3000) return;
      $.when(root.fetch("https://api.guildwars2.com/v1/events.json?world_id={s}&map_id={m}#", {
          s: server,
          m: expectedInd
        }),
        root.fetch('https://api.guildwars2.com/v1/event_details.json')).done(_draw);
    } else {
      detail = detail.events;
      var now = +new Date();
      var mapInd = root.maps.getIndex(root.tile.moving),
        map = root.maps.load(mapInd);
      if (self._expectedInd != mapInd) return console.log('event.draw: mapInd changed while fetching. Ignoring data');
      if (!map) return console.log('OOPS NO MAP. hence NO EVENT for you');
      for (var idx in data.events) {
        var uid = data.events[idx].event_id,
          event = detail[uid],
          status = data.events[idx].state,
          stage = {
            Inactive: 1,
            Warmup: 2,
            Fail: 1,
            Active: 4,
            Success: 1,
            Preparation: 3
          }[status];
        if (event) {
          var _c = _cache[uid] = _cache[uid] || {};
          var ll = root.geo.pos2ll(event.location.center, mapInd, 1);
          var radius = event.location.radius || 100;
          var polyArray = [];
          var isGroup = event.flags.join(',').indexOf('group_event') > -1;
          radius = radius / map.mRect[2] * map.cRect[2];
          switch (event.location.type) {
          case 'poly':
            for (var i in event.location.points)
              polyArray.push(root.geo.pos2ll(event.location.points[i], mapInd, 1));
          case 'sphere':
          case 'cylinder':
            var opt = {
              icn: isGroup ? 'group' : 'event',
              textClass: 'marker-event -leaflet-zoom-hide',
              radius: radius,
              stage: stage,
              mainText: '',
              subText: event.flags.join(',').replace('group_event', '[Group]') + '(' + status + ') ' + event.name
            };
            if (polyArray.length > 0) opt.poly = polyArray;
            if (!_c.marker) {
              _c.marker = L.labelMarker(ll, opt);
              _eventMarkers.addLayer(_c.marker);
            } else {
              _.assign(_c.marker.options.icon.options, {
                lastStage: _c.marker.options.icon.options.stage
              }, opt);
              _c.marker.update();
            }
            _c.time = now;
            _cache[uid] = _c;
            break;
          default:
            console.log('unknown event type:', event)
          }
        } else console.log('events.draw:Y U NO detail?', uid, data);
      }
      _clearCache(now);
    }
  }, self = {
      init: function () {
        root.on('overlayadd', toggleDraw);
        root.layerControl.addOverlay(_eventMarkers.addTo(root.map), 'Events');
        root.on('overlayremove', toggleDraw);
        root.on('mapChange', _draw);
        tmr = setInterval(_draw, 5000);
      }
    };
  return self;
};