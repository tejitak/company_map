<template>
    <section class="popup component__popup" v-class="loading: loading">
      <h1 class="title"><a v-attr="href: url" target="_blank"><span>{{title}}</span></a></h1>
      <div>{{url}}</div>
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
            url: "test://",
            loading: false
        }
    },

    paramAttributes: ["title", "url"],
    compile: function(){
      this.$set('url', url);
      console.log(['url:', url, this.url, this]);
    },
    methods: {
        close: function(){
            this.$dispatch("onPopupClose");
        }
    }
};
</script>