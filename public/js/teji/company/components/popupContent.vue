<style lang="stylus">
.popup_content
  overflow auto
  max-height 360px


</style>

<template>
  <div class="popup_content">
    <div class="company_data">
      <dl>
        <dt class="hidden">創業年</dt>
        <dd>{{detail.foundation_date}}設立</dd>
      </dl>
      <dl>
        <dt>社員数</dt>
        <dd>{{detail.employee_count}}</dd>
      </dl>
      <a v-attr="href: detail.company_url">{{detail.company_url}}</a>
    </div>
    
    <div class="description" v-show="detail.description">
      {{detail.description}}
    </div>
    
    <div class="stars">
      <button class="add_star" v-on="click: postStar(detail.id)">Star</button>
      <figure class="star_count">
        <figcaption class="star">★</figcaption>
        <strong>{{detail.like_count}}</strong>
      </figure>
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
        if(this._requesting){ return; }
        this._requesting = true;
        $.ajax({
            type: "POST",
            url: Vue.config.debug ? "/api/v1/startups/1" : "/api/v1/startups/" + id + "/like",
            dataType: "json",
            cache: false,
            success: function(res){
              that.detail = res;
              // increment count in client side to update star ranking
              that.$root.getItemById(id).like_count++;
            },
            complete: function(){
              that._requesting = false;
            }
        });
      }
    }
};
</script>