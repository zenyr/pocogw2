AppModules.Fetch = function (self) {
  var realMapsAdd = {
    18: "Divinity's Reach",
    91: 'The Grove',
    139: 'Rata Sum',
    218: 'Black Citadel',
    326: 'Hoelbrak'
  };
  var lastZoneEvents, lastRealMaps, lastWorld, lastServer, lastMapInd, lastContinent, lastZoneEventsTime = 0;
  var lastEventNames, lastServers;
  return {
    eventNames: function () {
      return $.Deferred(function ($d) {
        if (!lastEventNames) {
          $.getJSON('https://api.guildwars2.com/v1/event_details.json').done(function (data) {
            var nData = {};
            _.assign(nData, data.events);
            lastEventNames = nData;
            $d.resolve(nData);
          }).error(function (err) {
            $d.reject(err)
          });
        } else {
          $d.resolve(lastEventNames);
        }
      });
    },
    zoneEvents: function (force, server, mapInd) {
      server = server || self.Player.server || 1021;
      mapInd = mapInd || 1;
      self.Echo('fetch.zoneEvents requested as '+server+', '+mapInd);
      return $.Deferred(function ($d) {
        if (!server) {
          $d.reject('ignoring fetch.zoneEvent');
        } else if (!lastZoneEvents || force || (server != lastServer) || (mapInd != lastMapInd) || (new Date() - lastZoneEventsTime > 4e3)) {
          lastZoneEvents = null;
          $.getJSON("https://api.guildwars2.com/v1/events.json?world_id=" + server + "&map_id=" + mapInd).
          done(function (data) {
            self.Echo('New event info Fetched.');
            lastZoneEvents = data;
            lastServer = server;
            lastMapInd = mapInd;
            lastZoneEventsTime = +new Date();
            $d.resolve(data);
          }).error(function (err) {
            $d.reject(err)
          });
        } else {
          $d.resolve(lastZoneEvents);
        }
      });
    },
    realMaps: function () {
      return $.Deferred(function ($d) {
        if (!lastRealMaps) {
          $.getJSON('https://api.guildwars2.com/v1/map_names.json').done(function (data) {
            var nData = {};
            _(data).forEach(function (t) {
              nData[t.id] = t.name;
            });
            _.assign(nData, realMapsAdd);
            lastRealMaps = nData;
            $d.resolve(nData);
          }).error(function (err) {
            $d.reject(err)
          });
        } else {
          $d.resolve(lastRealMaps);
        }
      });
    },
   linker : function(){
      if(self.Options.optFollow){
        return new $.getJSON('http://localhost:8428/gw2.json?'+(Math.random()+'').slice(2));
      } else {
        var $d = $.Deferred();
        setTimeout($d.reject,0);
        return $d;
      }
    },
   servers: function () {
      return $.Deferred(function ($d) {
        if (!lastServers) {
          $.getJSON('https://api.guildwars2.com/v1/world_names.json').done(function (data) {
            lastServers = data;
            $d.resolve(data);
          }).error(function (err) {
            $d.reject(err)
          });
        } else {
          $d.resolve(lastServers);
        }
      });
    },
    world: function (continent) {
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
      return $.Deferred(function ($d) {
        if (!lastWorld || lastContinent != continent) {
          $.getJSON("https://api.guildwars2.com/v1/map_floor.json?continent_id=" + continent + "&floor=" + (continent == 1 ? 2 : 1) /*floor1 glitch..*/ ).
          done(function (data) {
            injectJP(data);
            lastWorld = data;
            lastContinent = continent;
            $d.resolve(data);
          }).error(function (err) {
            $d.reject(err)
          });
        } else {
          $d.resolve(lastWorld);
        }
      });
    }
  }
};