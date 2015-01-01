<style lang="stylus">
.popup
  position relative
  width 240px
  z-index 150
  background-color #fff

  &.loading
    background-color #ddd

  .title
    font-weight bold
    font-size 22px

  .closeWrap
    position absolute
    top 20px
    right 20px

</style>

<template>
    <section class="popup component__popup" v-class="loading: loading">
      <h1 class="title">{{title}}</div>
      <content></content>
      <div class="closeWrap">
        <a href="javascript:;" v-on="click: close()" class="close" title="Close"></a>
      </div>
    </section>
</template>

<script>
module.exports = {
    data: function(){
        return {
            title: "",
            loading: false
        }
    },

    paramAttributes: ["title"],

    methods: {
        close: function(){
            this.$dispatch("onPopupClose");
        }
    }
};
</script>