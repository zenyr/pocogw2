AppModules.player = function (root) {
  var marker, zooming=false, poll = function () {
      var interval = 3000;
      root.fetch('http://localhost:8428/gw2.json?' + (Math.random() + '').slice(2)).done(function (aData) {
        interval = 200;
        for (var a in self.linker) delete self.linker[a];
        aData.mapInd = aData.map;
        if(!root.maps.raw[aData.map]) return;
        aData.orgPos = aData.pos.join();
        aData.pos = root.geo.pos2ll({
          x: aData.pos[0],
          y: aData.pos[2]
        },aData.map);
        $.extend(self.linker, aData);
        try {
          marker = marker || L.playerMarker([0, 0]).addTo(root.map);
          marker.options.crot = aData.crot;
          marker.options.prot = aData.prot;
          marker._latlng = aData.pos;
          if(!zooming) {
            marker.update.call(marker);
            if(!root.tile.moving) 
              root.map.panTo(aData.pos);
          }
          //root.Options.setServer(data.server, true);
        } catch (e) {
          interval = 3000;
        }
      }).always(function () {
        setTimeout(poll, interval);
      });
    };
  var self = {
    linker:{},
    init: function () {
      poll();
      root.on('zoomstart',function(){zooming=1});
      root.on('zoomend',function(){zooming=0});
    }
  };
  return self;
};