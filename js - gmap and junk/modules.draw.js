AppModules.Draw = function (self) {
  return {
    eventMarkers: function (force, data, names) {
      if (!data) {
        $.when(self.Fetch.zoneEvents(force, self.Player.linker().server, self.Get.mapInd(1)), self.Fetch.eventNames()).done(function (dat1, dat2) {
          self.Draw.eventMarkers(force, dat1, dat2);
        }).fail(function (a) {
          self.Echo('draw.eventMarkers failed:' + a);
        });
      } else {
        var now = +new Date();
        var mapInd = self.Get.mapInd(1),
          map = self.Maps.load(mapInd);
        if (!map) return console.log('OOPS NO MAP. hence NO EVENT for you');
        for (var idx in data.events) {
          var uid = data.events[idx].event_id,
            event = names[uid],
            status = data.events[idx].state,
            skip = {
              Inactive: 1,
              Warmup: 2,
              Fail: 1,
              Active: 4,
              Success: 1,
              Preparation: 3
            }[status] - 1;
          if ( /*skip > 1 &&*/ event) {
            var ll = self.Geo.pos2ll(event.location.center, mapInd, 1);
            var radius = event.location.radius || 1000;
            var polyArray = [];
            radius = radius / map.mRect[2] * map.cRect[2];
            switch (event.location.type) {
            case 'poly':
              polyArray = [];
              for (var i in event.location.points)
                polyArray.push(self.Geo.pos2ll(event.location.points[i], mapInd, 1));
              //TODO : Poly events.. :/ 
            case 'sphere':
            case 'cylinder':
              self.Label.add('e', uid, { // sector-name
                map: self.map,
                position: ll,
                type: event.location.type,
                positions: polyArray,
                flags: event.flags,
                status: skip,
                label: event.name,
                desc: event.flags.join(',').replace('group_event', '[Group]') + '(' + status + ') ' + event.name,
                radius: radius,
                time: now
              });
              break;
            default:
              console.log('unknown event type:', event)
            }
          }
        }
        self.Label.clear('e', now);
      }
    },
    mapMarkers: function (map) {
      var types = {
        skill_challenges: 'skill',
        points_of_interest: 'poi',
        tasks: 'tasks'
      };
      map = map || self.Maps.load(self.Get.mapInd(1));
      if (!map) return;
      self.Label.clear('s');
      self.Label.clear('i');
      for (var sector in map.sectors) {
        sector = map.sectors[sector];
        self.Label.add('s', sector.name, { // sector-name
          map: self.map,
          position: self.Geo.a2ll(sector.coord),
          label: '<i>' + sector.name + '</i>',
          alt: sector.level || '',
          max: 7,
          min: 6,
          css: 'font-size:1.1em;color:silver;'
        });
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
          self.Label.add('i', itm.name || itm.task_id || Math.random(), {
            map: self.map,
            position: self.Geo.a2ll(itm.coord),
            icon: _type,
            label: itm.name || (_objText ? _objText + ' ' + itm.level : _type),
            alt: itm.objective || itm.level || '',
            desc: (itm.objective ? itm.objective : itm.name || _type) + (itm.poi_id ? '\nChat code: ' + self.Get.chatCode(4, itm.poi_id) : ''),
            max: 7,
            sMin: 6,
            min: 4,
            css: 'color:#dff;'
          });
        } // itm,type
    }, // draw.mapMarkers
    worldMarkers: function (data, realMapsData) {
      if (!data) {
        $.when(self.Fetch.world(self.Get.continent()), self.Fetch.realMaps()).done(function (dat1, dat2) {
          self.Draw.worldMarkers(dat1, dat2);
        });
      } else {
        self.Label.clear('r');
        self.Label.clear('m');
        for (var regionInd in data.regions) {
          var region = data.regions[regionInd];
          self.Label.add('r', region.name, {
            map: self.map,
            position: self.Geo.a2ll(region.label_coord),
            label: region.name,
            css: 'color:tan;font-size:1.7em'
          });
          for (var ind in region.maps) {
            var map = _.assign({}, region.maps[ind]);
            var cRect = self.Rect.fromArray(map.continent_rect);
            var mRect = self.Rect.fromArray(map.map_rect);
            _.assign(map, {
              continent: self.Get.continent(),
              cRect: cRect,
              mRect: mRect,
              isInstance: !realMapsData[ind]
            });
            self.Maps.save(ind, map);
            if (realMapsData[ind]) {
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
    }
  }
};