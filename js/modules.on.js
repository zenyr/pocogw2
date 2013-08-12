AppModules.on = function (root) {
  var evt = {};
  var main = function (whens, cbk) {
    whens = whens instanceof Array?[whens]:whens.split(',');
    for (var when in whens){
      when = whens[when];
      var a = evt[when] || [];
      if (!evt[when]) {
        root.map.on(when, function (e) {
          main.trigger(when, e)
        });
      }
      a.push(cbk);
      evt[when] = a;
    }
  };
  main.trigger = function (when, e) {
    var a = evt[when] || [];
    for (var i in a)
      if (a[i].call(this, e) === false) break;
  };
  return main;
};