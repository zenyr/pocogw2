AppModules.On = function (self) {
  var lastMap, isPopOpen, logXY = false;
  return {
    mapClick: function (e) {
      if (isPopOpen) {
        app.popup.close();
        isPopOpen = !1;
      } else {
        var itm = app.Label.getFromElement(document.elementFromPoint(e.pixel.x, e.pixel.y));
        if (itm) {
          var txt = [];
          txt.push(itm.desc.replace('\n', '<br>'));
          if (itm.wiki) txt.push('<a href="'+itm.wiki+'">wiki</a>');
          app.popup.setContent(txt.join('<br>'));
          app.popup.setPosition(itm.position);
          app.popup.open(app.map);
          isPopOpen = !0;
        } else {}
        var p = app.Geo.ll2p(e.latLng);
        if (logXY) {
          var map = app.Get.mapInd();
          if (!map) return;
          var s = 'if(!jp[' + map + '])jp[' + map + ']=[];jp[' + map + '].push({coord: [' + p.x + ',' + p.y + '],floor: 1,name: "JumpingPuzzle",type: "jp"})';
          console.log(s);
        }
      }
    },
    centerChanged: function (e) {
      var newMap = self.Get.mapInd(1);
      if (newMap && self.Get.mapInd(1) != lastMap) {
        self.Draw.mapMarkers();
        self.Draw.eventMarkers();
        lastMap = newMap;
      };
    },
    optChanged: function (e) {
      var $e = $(e.target),
        id = $e.attr('id'),
        val = $e.is(':checked'),
        callbacks = {
          optServer: self.Draw.eventMarkers
        };
      if ($e.is('select')) {
        val = $e.find(':selected').val();
      }
      if (!id) return console.log('Unknown Option.', e);
      console.log('Optchanged-', id, val);
      if (callbacks[id]) callbacks[id]();
      self.Options[id] = val;
    },
    mapDragged: function (e) {
      self.Options.lastDrag = +new Date();
    },
    init: function () {
      self.Draw.worldMarkers();
      self.Player.poll();
      self.Options.init();
      setInterval(self.Draw.eventMarkers, 5000);
      google.maps.event.addListener(self.map, "center_changed", _.debounce(self.On.centerChanged, 200));
      google.maps.event.addListener(app.map, "click", self.On.mapClick);
      google.maps.event.addListener(app.map, "drag", self.On.mapDragged);
      delete self.On.init;
    }
  }
};