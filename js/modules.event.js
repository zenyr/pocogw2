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
          app.popup.setContent(itm.desc.replace('\n', '<br>'));
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
        val = $e.is(':checked');
      if (!id) return console.log('Unknown Option.', e);
      console.log('Optchanged-', id, val);
      self.Options[id] = val;
    },
    init: function () {
      self.Draw.worldMarkers();
      self.Player.poll();
      setInterval(self.Draw.eventMarkers, 5000);
      google.maps.event.addListener(self.map, "center_changed", self.On.centerChanged);
      google.maps.event.addListener(app.map, "click", self.On.mapClick);
    }
  }
};