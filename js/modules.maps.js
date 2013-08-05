AppModules.maps = function (root) {
  var maps = {}, save = function (ind, raw) {
      if (!maps[ind]) maps[ind] = _.cloneDeep(raw);
      return self.load(ind);
    }, load = function (ind) {
      return maps[ind];
    }, index = function (force) {
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
    }, self = {
      save: save,
      load: load,
      getIndex: index,
      raw: maps
    };
  return self;
};