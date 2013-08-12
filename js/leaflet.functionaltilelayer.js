L.TileLayer.Functional = L.TileLayer.extend({
  _tileFunction: null,
  initialize: function (tileFunction, options) {
    this._tileFunction = tileFunction;
    L.Util.setOptions(this, options);
  },
  getTileUrl: function (tile,tilePoint) {
    // Note: bbox code untested; pulled from TileLayer.WMS
    var map = this._map,
      tileSize = this.options.tileSize,
      zoom = this._map.getZoom(),      
      nw = tilePoint.multiplyBy(tileSize),
      se = nw.add(L.point(tileSize, tileSize)),
      se = map.unproject(se, zoom),
      nw = map.unproject(nw, zoom),
      bnd = L.latLngBounds([nw,se]),
      view = {
        bounds: bnd,
        bbox: bnd.toBBoxString(),
        width: tileSize,
        height: tileSize,
        zoom: zoom,
        tile: {
          row: tilePoint.y,
          column: tilePoint.x
        },
        subdomain: this._getSubdomain(tilePoint)
      };
    return this._tileFunction(view);
  },
  _loadTile: function (tile, tilePoint) {
    var tileUrl = this.getTileUrl(tile,tilePoint);
    tile._layer = this;
    tile.onload = this._tileOnLoad;
    tile.onerror = this._tileOnError;
    if (typeof tileUrl === "string") {
      tile.src = tileUrl;
    } else if (tileUrl) {
      // assume jQuery.Deferred
      tileUrl.done(function (tileUrl) {
        tile.src = tileUrl;
      });
    }
  }
});
L.tileLayer.functional = function (tileFunction, options) {
  return new L.TileLayer.Functional(tileFunction, options);
};