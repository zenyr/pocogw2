var AppModules = function (target) {
  return $.Deferred(function ($d) {
    for (var mod in AppModules)
      if (AppModules.hasOwnProperty(mod))
        target[mod] = AppModules[mod](target);
    $d.resolve();

    return;
    var names = 'draw,fetch,geo,get,label,maps,rect,player,event,echo,options',
      mods = _.map(names.split(','), function (a) {
        return $.getScript('js/modules.' + a + '.js')
      });
    /*$.when.apply(this,mods).done(function(){
      for (var mod in AppModules)
      if (AppModules.hasOwnProperty(mod))
        target[mod] = AppModules[mod](target);
      $d.resolve();
    })/.resolve();*/
  }).fail(function (e) {
    $d.reject(e);
  });
}