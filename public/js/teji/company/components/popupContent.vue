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
      <a v-attr="href: company_url">{{company_url}}</a>
      <ul>
        <li v-repeat="detail.job_list">
          <a v-attr="href: url">{{title}}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
module.exports = {
    data: function () {
        return {
            company_url: "",
            detail: {
                job_list: []
            }
        }
    }
};
</script>