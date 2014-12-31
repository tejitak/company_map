<style lang="stylus">
#map_canvas
    width 100%
    height 100%
    
    .customMarker
        border none
        position absolute
        padding-Left 0px
        cursor pointer

        img
            border-radius 18px
            -webkit-border-radius 18px
            -moz-border-radius 18px
            box-shadow: 0px 0px 0px 8px rgba(3,169,264,0.6);
        
        &.selected
            z-index 9999 
            
            img
                box-shadow: 0px 0px 0px 8px rgba(255,82,82,0.6);
</style>

<template>
  <div id="map_canvas"></div>
</template>

<script>
function CustomMarker(options) {
    var o = options || {};
    this._latlng = o.position;
    this._imagePath = o.imagePath;
    this._w = o.width;
    this._h = o.height;
    this._zIndex = o.zIndex;
    this.setMap(o.map);
}

CustomMarker.prototype = new google.maps.OverlayView();

CustomMarker.prototype.draw = function() {
    var that = this;
    var div = this._div;
    if (!div) {
        div = this._div = document.createElement('DIV');
        // div.style.width = this._w + 4 + "px";
        // div.style.height = this._h + 4 + "px";
        div.className = "customMarker";
        div.style.zIndex = this._zIndex;
        var img = document.createElement("img");
        img.src = this._imagePath;
        img.width = this._w;
        img.height = this._h;
        div.appendChild(img);
        google.maps.event.addDomListener(div, "click", function(event) {
            google.maps.event.trigger(that, "click");
        });
        this.getPanes().overlayImage.appendChild(div);
    }
    var point = this.getProjection().fromLatLngToDivPixel(this._latlng);
    if (point) {
        var $div = $(div);
        div.style.left = (point.x - $div.width() / 2) + "px";
        div.style.top = (point.y - $div.height() / 2) + "px";
    }
};

CustomMarker.prototype.remove = function() {
    if (this._div) {
        this._div.parentNode.removeChild(this._div);
        this._div = null;
    }
};

CustomMarker.prototype.getPosition = function() {
    return this._latlng;
};

CustomMarker.prototype.setSelected = function(selected) {
    if (this._div) {
        selected ? $(this._div).addClass("selected") : $(this._div).removeClass("selected");
    }
};

module.exports = {
    data: function () {
        return {
            initPos: {lat: 0, lng: 0}, 
            items: []
        }
    },

    created: function(){
        this._lazy = true;
        this._markerSize = 36;

        this.$watch("items", this.refresh);
        this.$on("changeSelection", this.onChangeSelection);
        this.$on("changeArea", this.onChangeArea);
    },

    ready: function(){
        var that = this;
        var MY_MAPTYPE_ID = 'StartMap_style';

        var map = this._map = new google.maps.Map(document.getElementById("map_canvas"), {
            center: new google.maps.LatLng(this.initPos.lat, this.initPos.lng),
            zoom: 16,
            // mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeId: MY_MAPTYPE_ID,
            mapTypeControl: false,
            panControl: true,
            panControlOptions: {
                position: google.maps.ControlPosition.TOP_RIGHT
            },
            zoomControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.LARGE,
                position: google.maps.ControlPosition.TOP_RIGHT
            },
            scaleControl: true,
            streetViewControl: true,
            streetViewControlOptions: {
                position: google.maps.ControlPosition.TOP_RIGHT
            }
        });
        var customMapType = new google.maps.StyledMapType([{
                "stylers": [{"hue": "#0069b2"}, {"saturation": -70}],
                "elementType": "all",
                "featureType": "all"
            }], {
                name: 'Start Map'
            }
        );
        map.mapTypes.set(MY_MAPTYPE_ID, customMapType);
        // the center position is changed by changing zoom
        google.maps.event.addListener(map, 'zoom_changed', function() {
            that.appendCurrentAreaMakers();
        });
        // the center position is changed by selecting area or drag end
        google.maps.event.addListener(map, 'idle', function(){
            that.appendCurrentAreaMakers();
        });
        this._markers = new google.maps.MVCArray();
        this._displayedIds = [];
    },

    methods: {
        filterItems: function(){
            var filtered = [];
            if(this._lazy){
                var latlngBounds = this._map.getBounds();
                if(!latlngBounds){
                    // map is not loaded yet
                    return [];
                }
                var swLatlng = latlngBounds.getSouthWest();
                var neLatlng = latlngBounds.getNorthEast();
                this.items.forEach(function(item, i){
                    var lat = item.lat, lng = item.lng;
                    if(swLatlng.lat() <= lat && lat <= neLatlng.lat() && swLatlng.lng() <= lng && lng <= neLatlng.lng()){
                        filtered.push(item);
                    }
                });
            }else{
                filtered = this.items;
            }
            // console.log(filtered);
            return filtered;
        },

        refresh: function(){
            var that = this, map = this._map, items = this.items;
            if(!map || !items || items.length == 0){ return; }
            this.resize();
            // clear makers
            this.clearMarkers();
            // show markers in only displayed range
            this.appendCurrentAreaMakers();
        },

        appendCurrentAreaMakers: function(){
            var that = this;
            this.filterItems().forEach(function(item, i){
                that.addMaker(item);
            });
        },

        addMaker: function(item){
            if(!item){ return; }
            var that = this, map = this._map;
            // TODO: dup check
            if(this._displayedIds.indexOf(item.id) !== -1){
                return;
            }
            var ms = this._markerSize;
            var gLatLng = new google.maps.LatLng(item.lat, item.lng);
            // var marker = new google.maps.Marker({position: gLatLng, icon: new google.maps.MarkerImage(item.logo_url, null, null, new google.maps.Point(ms / 2, ms / 2), new google.maps.Size(ms, ms)), zIndex: item.like_count, map: map});
            var marker = new CustomMarker({position: gLatLng, map: map, imagePath: item.logo_url, width: ms, height: ms, zIndex: item.like_count});

            google.maps.event.addListener(marker, 'click', function() {
                that.$dispatch("onMapMarkerClick", item.id);
            });
            this._markers.push(marker);
            this._displayedIds.push(item.id);
        },

        clearMarkers: function(){
            this._displayedIds = [];
            this._markers.forEach(function(marker, i){
                marker.setMap(null);
            });
            this._markers = [];
        },

        onChangeSelection: function(id){
            // set selected class to custom marker
            var index = this._displayedIds.indexOf(id);
            if(index === -1 || !this._markers[index]){ return; }
            this._markers.forEach(function(marker, i){
                marker.setSelected(i === index);
            });
        },

        onChangeArea: function(pos, cb){
            if(!this._map){ return; }
            this._map.panTo(new google.maps.LatLng(pos.lat, pos.lng));
            // register one time callback
            if(cb){
                google.maps.event.addListenerOnce(this._map, 'idle', cb);
            }
        },

        resize: function(gLatLng){
            var map = this._map;
            if(map){
                google.maps.event.trigger(map, 'resize');
                map.setCenter(gLatLng || new google.maps.LatLng(this.initPos.lat, this.initPos.lng));
            }
        }
    }
}
</script>