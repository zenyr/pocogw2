AppModules.events = function (root) {
  var _eventMarkers = L.layerGroup();
  var _cache = {};
  var _clearCache = function (now) {
    for (var i in _cache) {
      if (!now || _cache[i].time != now) {
        _eventMarkers.removeLayer(_cache[i].marker);
        delete _cache[i];
      }
    }
  };
  var _draw = function (data, detail) {
    if (!data) {
      if(root.tile.continent == 2 || !root.maps.getIndex(1)) return;
      $.when(root.fetch("https://api.guildwars2.com/v1/events.json?world_id={s}&map_id={m}#", {
          s: 1021 || root.player.linker.server,
          m: root.maps.getIndex(1)
        }),
        root.fetch('https://api.guildwars2.com/v1/event_details.json')).done(_draw);
    } else {
      detail = detail.events;
      var now = +new Date();
      var mapInd = root.maps.getIndex(),
        map = root.maps.load(mapInd);
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
            //TODO : Poly events.. :/ 
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
            if (!_c.marker) {
              _c.marker = L.labelMarker(ll, opt);
              _eventMarkers.addLayer(_c.marker);
            } else {
              _.assign(_c.marker.options.icon.options,{lastStage:_c.marker.options.icon.options.stage}, opt);
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
        root.layerControl.addOverlay(_eventMarkers.addTo(root.map), 'Events');
        root.on('mapChange',_draw);
        setInterval(_draw, 5000);
      }
    };
  return self;
};