AppModules.On = function (self) {
  var lastMap, isPopOpen;
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
        var map = app.Get.mapInd();
        if (!map) return;
        var s = 'if(!jp[' + map + '])jp[' + map + ']=[];jp[' + map + '].push({coord: [' + p.x + ',' + p.y + '],floor: 1,name: "JumpingPuzzle",type: "jp"})';
        //console.log(s);
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
    init: function () {
      self.Draw.worldMarkers();
      google.maps.event.addListener(self.map, "center_changed", self.On.centerChanged);
      google.maps.event.addListener(app.map, "click", self.On.mapClick);
    }
  }
};