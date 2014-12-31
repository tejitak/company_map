<style lang="stylus">
.tab
    .title-wrap
        display table
        
    .title
        display table-cell
        font-weight bold
        font-size 22px
        padding 10px 20px

</style>

<template>
    <div class="tab" v-class="">
        <header class="title-wrap" role="tab-trigger">
          <nav>
            <div class="title" v-class="Selected: selectedTab == 'area'"><a href="javascript:;" v-on="click: selectedTab = 'area'">エリア</a></div>
            <div class="title" v-class="Selected: selectedTab == 'star'"><a href="javascript:;" v-on="click: selectedTab = 'star'">スター</a></div>
          </nav>
        </header>
        
        <div class="tabContent" v-show="selectedTab == 'area'">
          <div v-repeat="locations">
            <a href="javascript:;" v-on="click: selectArea(lat, lng)">{{name}}</a>
          </div>
        </div>
        
        <div class="tabContent" v-show="selectedTab == 'star'">
          Filter <input type="text" v-model="searchText">
          <div v-repeat="items | orderBy 'like_count' -1 | filterBy searchText in company_name" v-on="click: selectStarItem(this)" v-show="$index < 20">
            <div>{{$index + 1}}: {{company_name}}</div>
            <div>like_count: {{like_count}}</div>
          </div>
        </div>
    </div>
</template>

<script>
module.exports = {
    data: function(){
        return {
            title: "",
            selectedTab: "area",
            searchText: "",
            items: [],
            locations: [
                {lat: 35.658517, lng: 139.701334, name: "渋谷"},
                {lat: 35.662836, lng: 139.731443, name: "六本木"},
                {lat: 35.646690, lng: 139.710106, name: "恵比寿"},
                {lat: 35.693840, lng: 139.703549, name: "新宿"},
                {lat: 35.713768, lng: 139.777254, name: "上野"},
                {lat: 35.443708, lng: 139.638026, name: "横浜"},
                {lat: 35.728926, lng: 139.710380, name: "池袋"},
                {lat: 35.630152, lng: 139.740440, name: "品川"},
                {lat: 35.626446, lng: 139.723444, name: "五反田"}
            ]
        }
    },

    methods: {
        selectArea: function(lat, lng){
            this.$dispatch("onPopupClose");
            this.$root.onChangeArea(lat, lng);
        },

        selectStarItem: function(item){
            var that = this;
            this.$root.onChangeArea(item.lat, item.lng, function(){
                that.$root.onChangeSelection(item.id);
            });
        }
    }
};
</script>