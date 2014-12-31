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
        
        <section class="tabContent" v-show="selectedTab == 'area'">
          <ul>
              <li><a href="javascript:;" v-on="click: selectArea(35.658517,139.701334)">渋谷</a></li>
              <li><a href="javascript:;" v-on="click: selectArea(35.662836,139.731443)">六本木</a></li>
              <li><a href="javascript:;" v-on="click: selectArea(35.646690,139.710106)">恵比寿</a></li>
              <li><a href="javascript:;" v-on="click: selectArea(35.693840,139.703549)">新宿</a></li>
              <li><a href="javascript:;" v-on="click: selectArea(35.713768,139.777254)">上野</a></li>
              <li><a href="javascript:;" v-on="click: selectArea(35.443708,139.638026)">横浜</a></li>
              <li><a href="javascript:;" v-on="click: selectArea(35.728926,139.710380)">池袋</a></li>
              <li><a href="javascript:;" v-on="click: selectArea(35.630152,139.740440)">品川</a></li>
              <li><a href="javascript:;" v-on="click: selectArea(35.626446,139.723444)">五反田</a></li>
          </ul>
        </section>
        <section class="tabContent" v-show="selectedTab == 'star'">
          <ul>
            <li v-repeat="items" v-on="click: selectStarItem(this)" v-show="$index < 20">
              <div>{{$index + 1}}: {{company_name}}</div>
              <div>like_count: {{like_count}}</div>
            </li>
          </ul>
        </section>
    </div>
</template>

<script>
module.exports = {
    data: function(){
        return {
            title: "",
            selectedTab: "area",
            items: []
        }
    },

    methods: {
        selectArea: function(lat, lng){
            this.$root.onChangeArea(lat, lng);
        },

        selectStarItem: function(item){
            this.$root.onChangeSelection(item.id);
            this.$root.onChangeArea(item.lat, item.lng);
        }
    }
};
</script>