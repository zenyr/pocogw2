var App = function () {
  var self = this;
  self.init = function () {
    if(!self.On||!self.Get) return console.log('Err:Modules not initialized');
    delete self.init;
    self.popup = {};//{TODO} new google.maps.InfoWindow();
      $map = $('<div/>', {
        id: 'map'
      }).appendTo('body');
    self.map = L.map('map',{
      center: new L.LatLng(0,0),
      zoom: 3,
      minZoom: 2,
      maxZoom: 7,
      layers: [self.Get.tileSrc(1)/*,self.Get.tileSrc(2)*/],
//        inertia:false
    });
    L.control.layers(self.Get.baseLayers()).addTo(self.map);
    self.On.init()
  };
};