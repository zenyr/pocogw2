AppModules.Echo = function (self) {
  var list = [];
  return function(msg){
    list.reverse();
    list.push((new Date()).toLocaleTimeString()+':'+msg);
    if(list.length>3) list=list.slice(-3);
    $('#echo').html('<p>'+list.reverse().join('<p>'));
  };
};