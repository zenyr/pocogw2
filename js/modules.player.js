AppModules.Player = function (self) {
  var data={},map,pos=[0,0,0],lastFetch;
  var poll = function(){
    var interval = 3000;
    self.Fetch.linker().done(function(aData){
      interval = 100;
      data = aData;
    }).always(function(){
      setTimeout(poll,interval);
    });
  };
  var markerClear = function(){};
  var markerSet = function(oXY){
  
  };
var _marker = function (opt_options) {
  var that = this;
  this.setValues(opt_options);
  var span = document.createElement('span');
  var crot = this.crot = document.createElement('img');
  var prot = this.prot = document.createElement('img');
  var div = this.div = document.createElement('div');
  this.v = false;
  crot.src = 'images/icon-crot.png';
  crot.className = 'crot';
  prot.src = 'images/icon-prot.png';
  prot.className = 'prot';
  this.input = {};
  this.deg = {};
  span.appendChild(crot);
  span.appendChild(prot);
  div.appendChild(span);
  div.className = 'marker';
  div.style.cssText = 'position: absolute; display: none;color:red;';
};
_marker.prototype = new google.maps.OverlayView;
_marker.prototype.onAdd = function () {
  var pane = this.getPanes().overlayLayer;
  pane.appendChild(this.div_);
  // Ensures the label is redrawn if the text or position is changed.
};
// Implement onRemove
_marker.prototype.onRemove = function(){
  this.div = this.crot = this.prot = this.input = this.deg = null;
};
// Implement draw
_marker.prototype.draw = function () {
  var that = this;
  var projection = this.getProjection();
  var position = projection.fromLatLngToDivPixel(this.get('pos'));
  var div = this.div;
  var shouldVis = position.x * position.y != 0;
  var getDeg = function (type, target) {
    target = target || 0;
    var lastIn = that.input[type] || 0;
    var lastDeg = that.deg[type] || 0;
    var diff = target - lastIn;
    that.input[type] = target;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    that.deg[type] = lastDeg + diff;
  };
  if (this.v != shouldVis) {
    div.style.display = (shouldVis ? 'block' : 'none');
    this.v = shouldVis;
  }
  if (shouldVis) {
    div.style.left = position.x + 'px';
    div.style.top = position.y + 'px';
    getDeg('c', this.get('crot'));
    getDeg('p', this.get('prot'));
    this.prot.style.transform = this.prot.style.webkitTransform = 'rotate(' + (-this.deg['p'] || 0) + 'deg)';
    this.crot.style.transform = this.crot.style.webkitTransform = 'rotate(' + (-this.deg['c'] || 0) + 'deg)';
  }
};


  //setTimeout(poll,1000);
  return {
    server:data.server,
    map:data.map,
    pos:data.pos
  }
};