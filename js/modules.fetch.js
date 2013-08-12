AppModules.fetch = function (root) {
  var cache = {};
  var clearCache = function (tempOnly) {
    var now = +new Date;
    for (var i in cache) {
      if (tempOnly)
        if ((i.indexOf('#') < 0) || (now - cache[i].time < 1e4))
          continue;
      delete cache[i].data;
      delete cache[i];
    }
  };
  var fetcher = function (url, reqObj, force) {
    clearCache(1);
    var shallFetch, isStatic = url.indexOf('#') == -1;
    if (!_.isObject(reqObj)) {
      force = reqObj;
      reqObj = {};
    }
    for (var i in reqObj)
      url = url.replace('{' + i + '}', reqObj[i]);
    shallFetch = force || !cache[url] || (!isStatic && (+new Date - cache[url].time > 5e3));
    return $.Deferred(function ($d) {
      if (shallFetch) {
        $.getJSON(url.replace('#', '')).done(function (data) {
          if (!isStatic) delete cache[url];
          cache[url] = {
            data: data,
            time: +new Date
          };
          $d.resolve(data);
        }).error(function (err) {
          $d.reject(err)
        });
      } else {
        $d.resolve(cache[url].data);
      }
    });
  };
  fetcher.clearCache = clearCache;
  fetcher.map = function (continent) {
    return $.Deferred(function ($d) {
      fetcher('https://api.guildwars2.com/v1/continents.json').done(function (d) {
        if (!localStorage || !localStorage.getItem('floorCache' + continent)) {
          var fs = d.continents[continent].floors.join(',').split(',');
          var ct = d.continents[continent].name;
          var fl = fs.length;
          fs.sort();
          var o = {};
          var p = L.popup().setLatLng([0, 0]);
          root.map.openPopup(p);
          var run = function () {
            var f = fs.pop();
            p.setContent('<p>Receiving data: ' + ct + ' Floor ' + (f + '').replace('-', 'B') + ' (' + ~~((fl - fs.length) / fl * 100) + '%)</p>');
            fetcher('https://api.guildwars2.com/v1/map_floor.json?continent_id={c}&floor={f}', {
              c: continent,
              f: f
            }).done(function (d) {
              if (!d.regions) $.reject('Invalid map_floor data');
              for (var r in d.regions )
              for (var m in d.regions[r].maps) {
                if(typeof d.regions[r].maps[m].floor != 'object') d.regions[r].maps[m].floor= [];
                d.regions[r].maps[m].floor.push(f);
                console.log(d.regions[r].maps[m]);
              }
              $.extend(true, o, d);
              if (fs.length > 0) {
                run();
              } else {
                $d.resolve(o);
                if (localStorage) localStorage.setItem('floorCache' + continent, /**/ LZString.compress /**/ (JSON.stringify(o)));
                root.map.closePopup(p);
              }
            });
          };
          run();
        } else {
          $d.resolve(JSON.parse( /**/ LZString.decompress /**/ (localStorage.getItem('floorCache' + continent))));
        }
      });
    });
  };
  return fetcher;
};