AppModules.fetch = function (self) {
  var cache = {};
  window._cache = cache;
  var fetcher = function (url, reqObj, force) {
    var shallFetch;
    if (!_.isObject(reqObj)) {
      force = reqObj;
      reqObj = {};
    }
    for (var i in reqObj)
      url = url.replace('{' + i + '}', reqObj[i]);
    shallFetch = force || !cache[url];
    return $.Deferred(function ($d) {
      if (shallFetch) {
        $.getJSON(url).done(function (data) {
          cache[url] = data;
          $d.resolve(data);
        }).error(function (err) {
          $d.reject(err)
        });
      } else {
        $d.resolve(cache[url]);
      }
    });
  };
  fetcher.clearCache = function(){
    for (var i in cache){
      delete cache[i];
    }
  };
  return fetcher;
};