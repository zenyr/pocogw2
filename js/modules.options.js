AppModules.Options = function (self) {
  var $s;
  var fillOptServer = function () {
    $s.html('<option value>Select Server</option>');
    $.when(self.Fetch.servers()).done(function (d) {
      var a = {}, b = [],
        k;
      for (var i in d) a[d[i].name] = d[i].id;
      k = _.keys(a).sort();
      for (i in k) b.push('<option value="' + a[k[i]] + '">' + k[i] + '</option>');
      $s.append(b.join(''));
    });
  };
  var setOptServer = function (v,ignoreTrigger) {
    if (!$s.find('option[value=' + v + ']')[0]) return !1;
    $s.val(v);
    self.Options.lastDrag = +new Date();
    if(!ignoreTrigger) $s.trigger('change');
    return !0;
  }
  return {
    init: function () {
      delete self.Options.init;
      var floatPnl = $('<div id="float"></div>');
      var opts = ['<input type="checkbox" id="optFollow" value="1"> Follow player', '<select id="optServer"></select>'];
      var optPnl = $('<div />', {
        id: 'optPnl'
      }).appendTo(floatPnl)
        .append('<ul><li>' + opts.join('</li><li>') + '</li></ul>');
      floatPnl.append('<p id="echo"></p>');
      $('body').on('change', '#float input,#float select', self.On.optChanged).append(floatPnl);
      $s = $('#optServer');
      fillOptServer();
    },
    setServer: setOptServer
  };
};