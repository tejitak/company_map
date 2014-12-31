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
  <div class="tab component__tab" v-class="">
    <header class="tabHeader title-wrap" role="tab-trigger">
      <nav>
        <div class="tab-trigger title" v-class="Selected: selectedTab == 'area'"><a href="javascript:;" v-on="click: selectedTab = 'area'">エリア</a></div>
        <div class="tab-trigger title" v-class="Selected: selectedTab == 'star'"><a href="javascript:;" v-on="click: selectedTab = 'star'">企業</a></div>
      </nav>
    </header>

    <section class="tabContent tabArea" v-show="selectedTab == 'area'">
      <ul class="component__list" function="scroll-1">
        <li class="item" v-repeat="locations">
          <a href="javascript:;" v-on="click: selectArea(lat, lng)">{{name}}</a>
        </li>
      </ul>
    </section>

    <section class="tabContent tabCompany" v-show="selectedTab == 'star'">

      <header class="component__filter" role="filter">
        <label for="filter-input">Filter</label>
        <input id="filter-input" type="text" placeholder="Company Name..." v-model="searchText" />
      </header>

      <ul class="component__list" function="scroll-2">
        <li class="item" v-repeat="items | orderBy 'like_count' -1 | filterBy searchText in company_name" v-on="click: selectStarItem(this)" v-show="$index < 50">
          <dl>
            <dt>
              <span class="ranking">{{$index + 1}}:</span>
              <strong class="company-name">{{company_name}}</strong>
            </dt>
            <dd>
              <i>★</i>
              <strong class="like-count">{{like_count}}</strong>
            </dd>
          </dl>
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
            searchText: "",
            items: [],
            locations: [
                {lat: 35.658517, lng: 139.701334, name: "渋谷"},
                {lat: 35.662836, lng: 139.731443, name: "六本木"},
                {lat: 35.646690, lng: 139.710106, name: "恵比寿"},
                {lat: 35.693840, lng: 139.703549, name: "新宿"},
                {lat: 35.466188, lng: 139.622715, name: "横浜"},
                {lat: 35.728926, lng: 139.710380, name: "池袋"},
                {lat: 35.630152, lng: 139.740440, name: "品川"},
                {lat: 35.626446, lng: 139.723444, name: "五反田"},
                {lat: 34.702485, lng: 135.495951, name: "大阪"},
                {lat: 33.591346, lng: 130.39906, name: "福岡"}
            ]
        }
    },

    methods: {
        selectArea: function(lat, lng){
            this.$dispatch("onPopupClose");
            this.$root.onChangeArea(lat, lng);
            if(util.isMobileScreen()){
              this.$dispatch("onNavigationClose");
            }
        },

        selectStarItem: function(item){
            var that = this;
            this.$root.onChangeArea(item.lat, item.lng, function(){
                that.$root.onChangeSelection(item.id);
            });
            if(util.isMobileScreen()){
              this.$dispatch("onNavigationClose");
            }
        }
    }
};
</script>