var AppModules = function(target){
  var mods = _.map('draw,fetch,geo,get,label,maps,rect,player,event,echo,options'.split(','), function (a) {
    return $.getScript('js/modules.' + a + '.js')
  });
  return $.Deferred(function($d){
    $.when.apply(this,mods).done(function(){
      for (var mod in AppModules)
      if (AppModules.hasOwnProperty(mod))
        target[mod] = AppModules[mod](target);
      $d.resolve();
    })
  }).fail(function(e){
      $d.reject(e);
  });
}