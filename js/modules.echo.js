AppModules.Echo = function (self) {
  var list = [];
  return function(msg){
    list.push((new Date()).toLocaleTimeString()+':'+msg);
    if(list.length>3) list=list.slice(-3);
    $('#echo').html('<p>'+list.join('<p>'));
  };
};