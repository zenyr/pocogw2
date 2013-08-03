!function (window) {
  var timeoutIDs = {},
    _setTimeout = window.setTimeout,
    _clearTimeout = window.clearTimeout,
    intervalIDs = {},
    _setInterval = window.setInterval,
    _clearInterval = window.clearInterval;

  window.getTimeout = timeoutIDs;
  window.setTimeout = function () {
    var id=_setTimeout.apply(window, arguments);
    timeoutIDs[id] = arguments;
    return id;
  };
  window.clearTimeout = function(id){
    _clearTimeout(id);
    delete timeoutIDs[id];
  };
  window.clearAllTimeouts = function () {
    for(var id in timeoutIDs) window.clearTimeout(id);
  };

  window.getInterval = intervalIDs;
  window.setInterval = function () {
    var id=_setInterval.apply(window, arguments);
    intervalIDs[id] = arguments;
    return id;
  };
  window.clearInterval = function(id){
    _clearInterval(id);
    delete intervalIDs[id];
  };
  window.clearAllIntervals = function () {
    for(var id in intervalIDs) window.clearInterval(id);
  };
}(this);