AppModules.Echo = function (self) {
  var list = [];
  return function(msg){
    list.push(msg);
    if(list.length>3) list=list.slice(-3);
    $('#echo').html('<p>'+list.join('<p>'));
  };
};