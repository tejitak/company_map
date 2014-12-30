<style lang="stylus">
.popup_content
  overflow auto
  max-height 360px

  .body
    padding 16px 0
    text-align center

</style>

<template>
  <div class="popup_content">
    <div class="body">
      <div>創業年: {{detail.found_year}}</div>
      <div>社員数: {{detail.employee_count}}</div>
      <a v-attr="href: detail.company_url">{{detail.company_url}}</a>
      <div>description: {{detail.description}}</div>
      <div>
        <a href="javascript:;" v-on="click: postStar(detail.id)">Star</a>
      </div>
      <div>
        star count: {{like_count}}
      </div>
    </div>
  </div>
</template>

<script>
module.exports = {
    data: function () {
        return {
            detail: {}
        }
    },

    methods: {
      postStar: function(id){
        var that = this;
        $.ajax({
            type: "POST",
            // url: "/api/v1/startups/:id/like",
            url: Vue.config.debug ? "/api/v1/startups/1" : "/api/v1/startups/" + id + "/like",
            dataType: "json",
            cache: false,
            success: function(res){
              that.detail = res;
              that.$root.refresh();
            },
            complete: function(){
              that.$root.refresh();
            }
        });
      }
    }
};
</script>