AppModules.Options = function (self) {
  return {
    init: function () {
      delete self.Options.init;
      var floatPnl = $('<div id="float"></div>');
      var opts = ['<input type="checkbox" id="optFollow" value="1"> Follow player','<select id="optServer"><option value>Server</option></select>'];
      var optPnl = $('<div />', {
        id: 'optPnl'
      }).appendTo(floatPnl)
        .append('<ul><li>'+opts.join('</li><li>')+'</li></ul>');
      floatPnl.append('<p id="echo"></p>');
      $('body').on('change', '#float input,#float select', self.On.optChanged).append(floatPnl);
    }
  };
};