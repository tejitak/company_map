<template>
  <section class="add-company modal">
    
    <div class="add-company__content">
      <div class="form__content">
        <dl class="input-line">
          <dt class="label">URL</dt>
          <dd class="form-asset"><inpu type="text" class="input-text" value="" /></dd>
        </dl>
        <dl class="input-line">
          <dt class="label">住所</dt>
          <dd class="form-asset"><inpu type="text" class="input-text" value="" /></dd>
        </dl>
      </div>
      <div class="settelments">
        <button class="submit ok">追加する</button>
        <button class="submit cancel">キャンセル</button>
      </div>
    </div>
    
    <div class="closeWrap">
      <a href="javascript:;" v-on="click: close()" class="close" title="Close"></a>
    </div>
  </section>
</template>

<script>
module.exports = {
  data: function(){
    return {
    }
  },

  methods: {
    close: function(){
      this.$dispatch("onAddCompanyModalClose");
    }
  }
};
</script>