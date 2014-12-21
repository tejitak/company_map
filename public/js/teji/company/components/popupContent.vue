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