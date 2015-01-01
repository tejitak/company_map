<template>
  <div class="popup_content">
    <div class="scroll_container" function="scroll">
      <div class="company_data">
        <dl class="item">
          <dt class="hidden">創業年</dt>
          <dd class="count">{{detail.foundation_date}}設立</dd>
        </dl>
        <dl class="item">
          <dt class="label">社員数</dt>
          <dd class="count">{{detail.employee_count}}</dd>
        </dl>
        <a v-attr="href: detail.company_url" target="_blank" class="goto-url"><i class="icon"></i></a>
      </div>

      <div class="description" v-show="detail.description">
        <p>
          {{detail.description}}
        </p>
      </div>
    </div>
    
    <div class="stars">
      <button class="add_star" v-on="click: postStar(detail.id)"><i class="icon"></i><span>STAR</span></button>
      <figure class="star_count">
        <figcaption class="star">★</figcaption>
        <strong class="count">{{detail.like_count}}</strong>
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