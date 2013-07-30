var App = function () {
  var self = this;
  google.maps.visualRefresh = !0;
  self.init = function () {
    if(!self.On||!self.Get) return console.log('Err:Modules not initialized');
    delete self.init;
    self.popup = new google.maps.InfoWindow();
    var tile_size = new google.maps.Size(256, 256),
      $map = $('<div/>', {
        id: 'map'
      }).appendTo('body');
    self.map = new google.maps.Map($map[0], {
      zoom: 3,
      minZoom: 2,
      maxZoom: 7,
      center: new google.maps.LatLng(0, 0),
      streetViewControl: false,
      mapTypeId: "1",
      mapTypeControlOptions: {
        mapTypeIds: ["1", "2"]
      }
    });
    self.map.mapTypes.set("1", new google.maps.ImageMapType({
      maxZoom: 7,
      alt: "Tyria PvE",
      name: "Tyria",
      tileSize: tile_size,
      getTileUrl: self.Get.tileSrc
    }));
    self.map.mapTypes.set("2", new google.maps.ImageMapType({
      maxZoom: 6,
      alt: "The Mists PvP",
      name: "The Mists",
      tileSize: tile_size,
      getTileUrl: self.Get.tileSrc
    }));
    self.On.init()
  };
};