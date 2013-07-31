AppModules.Options = function (self) {
  var opt = {};

  var floatPnl = $('<div id="float" style="z-index:2;background:#fff;padding:2px;font-size:.5em;position:absolute;right:0;top:3em;"><p id="echo"></p></div>');
  var optPnl = $('<div />', {
    id: 'optPnl'
  }).appendTo(floatPnl).append('<ul><li><input type="checkbox" id="optFollow" value="1"> Follow player</li></ul>');
  $('body').on('change','#float input',self.On.optChanged).append(floatPnl);


  return opt;
};