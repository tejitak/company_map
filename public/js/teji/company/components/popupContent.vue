<style lang="stylus">
.popup_content
  .title
    font-weight bold
    font-size 24px

  .body
    padding 8px 0
</style>

<template>
  <div class="popup_content">
    <div class="title">{{name}}</div>
    <div class="body">
      <a href="{{company_url}}">{{company_url}}</a>
      <ul>
        <li v-repeat="job_list">
          <a href="{{url}}">{{title}}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  module.exports = {
    data: function () {
      return {
        name: "", 
        company_url: "",
        job_list: []
      }
    },
    methods: {
    }
  }
</script>