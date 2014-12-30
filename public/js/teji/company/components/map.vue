<style lang="stylus">
#map_canvas
    width 100%
    height 100%
    
</style>

<template>
  <div id="map_canvas"></div>
</template>

<script>
module.exports = {
    data: function () {
        return {
            initPos: {lat: 0, lng: 0}, 
            items: []
        }
    },

    created: function(){
        this._lazy = true;
        // google.maps.event.addDomListener(window, 'load', this.refresh);
        this.$watch("items", this.refresh);
        this.$on("changeArea", this.onChangeArea);
    },

    ready: function(){
        var that = this;
        var map = this._map = new google.maps.Map(document.getElementById("map_canvas"), {
            center: new google.maps.LatLng(this.initPos.lat, this.initPos.lng),
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: google.maps.ControlPosition.TOP_RIGHT
            },
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
        this._infowin = new google.maps.InfoWindow({});
        // the center position is changed by drag
        // google.maps.event.addListener(map, 'dragend', function(){
        //     that.appendCurrentAreaMakers();
        // });
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
            console.log("filtered");
            console.log(filtered);
            return filtered;
        },

        refresh: function(){
            var that = this, map = this._map, items = this.items;
            if(!map || !items || items.length == 0){ return; }
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
            // var iconSize = item.job_count * 10;
            var iconSize = 48;
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(item.lat, item.lng),
                icon: new google.maps.MarkerImage(item.logo_url, null, null, null, new google.maps.Size(iconSize, iconSize)),
                zIndex: 10,
                map: map
            });
            google.maps.event.addListener(marker, 'mouseover', function() {
                that._infowin.setContent("<div>" + item.name + "</div><div>" + item.address + "</div><div>" + item.company_url + "</div>");
                that._infowin.open(map, marker);
            });
            google.maps.event.addListener(marker, 'mouseout', function() {
                that._infowin.close();
            });
            google.maps.event.addListener(marker, 'click', function() {
                that.$dispatch("onMapMarkerClick", item);
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

        onChangeArea: function(pos){
            if(!this._map){ return; }
            this._map.panTo(new google.maps.LatLng(pos.lat, pos.lng));
        }
    }
}
</script>