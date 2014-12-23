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
        //TODO: call updateMakers when the center position is changeds
    },

    methods: {
        filterItems: function(){
            // TODO: impl with filters

            // sort by job count for z-index

            return this.items;
        },

        refresh: function(){
            var that = this, map = this._map, items = this.items;
            if(!items){ return; }
            // TODO: clear maker

            // TODO: show markers in only displayed range
            var displayedItems = this._displayedItems = this.filterItems();
            displayedItems.forEach(function(item, i){
                that.addMaker(item);
            });
        },

        addMaker: function(item){
            if(!item){ return; }
            var that = this, map = this._map;
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
        }
    }
}
</script>