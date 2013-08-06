AppModules.fetch = function (root) {
  var cache = {};
  window._cache = cache;
  var clearCache = function(tempOnly){
    var now = +new Date;
    for (var i in cache){
      if(tempOnly) 
        if ((i.indexOf('#')<0)||(now-cache[i].time < 1e4))
          continue;
      delete cache[i].data;
      delete cache[i];
    }
  };
  var fetcher = function (url, reqObj, force) {
    clearCache(1);
    var shallFetch,isStatic = url.indexOf('#')==-1;
    if (!_.isObject(reqObj)) {
      force = reqObj;
      reqObj = {};
    }
    for (var i in reqObj)
      url = url.replace('{' + i + '}', reqObj[i]);
    shallFetch = force || !cache[url] || (!isStatic&& (+new Date - cache[url].time > 5e3) );
    return $.Deferred(function ($d) {
      if (shallFetch) {
        $.getJSON(url.replace('#','')).done(function (data) {
          if(!isStatic) delete cache[url];
          cache[url] = {
            data:data,
            time:+new Date
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
  return fetcher;
};