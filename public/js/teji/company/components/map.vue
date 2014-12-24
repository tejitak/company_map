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
        initPos: {}, 
        items: []
      }
    },

    created: function(){
        this.$watch("items", this.refresh);
    },

    ready: function(){
        var map = this._map = new google.maps.Map(document.getElementById("map_canvas"), {
            center: new google.maps.LatLng(this.initPos.lat, this.initPos.lng),
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        this._infowin = new google.maps.InfoWindow({});
        google.maps.event.addListener(map, 'dragend', function(){
            //TODO: call updateMakers when the center position is changeds
        });
        this._markers = new google.maps.MVCArray();
    },

    methods: {
        filterItems: function(){
            // TODO: impl with filters
            /*var filtered = [];
            var latlngBounds = this._map.getBounds();
            var swLatlng = latlngBounds.getSouthWest();
            var neLatlng = latlngBounds.getNorthEast();
            this.items.forEach(function(item, i){
                var lat = item.lat, lng = item.lng;
                if(swLatlng.lat() <= lat && lat <= neLatlng.lat() && swLatlng.lng() <= lng && lng <= neLatlng.lng()){
                    filtered.push(item);
                }
            });*/
            // sort by job count for z-index

            // return filtered;
            return this.items;
        },

        refresh: function(){
            var that = this, map = this._map, items = this.items;
            if(!map || !items){ return; }
            // TODO: clear makers
            this.clearMarkers();
            // TODO: show markers in only displayed range
            var displayedItems = this._displayedItems = this.filterItems();
            displayedItems.forEach(function(item, i){
                that.addMaker(item);
            });
        },

        addMaker: function(item){
            if(!item){ return; }
            var that = this, map = this._map;
            // TODO: dup check

            var iconSize = item.job_count * 10;
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
            this._currentIds.push(item.id);
        },

        clearMarkers: function(){
            this._currentIds = [];
            this._markers.forEach(function(marker, i){
                marker.setMap(null);
            });
            this._markers = [];
        }
    }
}
</script>