AppModules.Maps = function (self) {
  var maps = {}, save = function (ind, raw) {
      if (!maps[ind]) maps[ind] = _.cloneDeep(raw);
      return self.Maps.load(ind);
    }, load = function (ind) {
      return maps[ind];
    };
  return {
    save: save,
    load: load,
    raw: maps
  };
};