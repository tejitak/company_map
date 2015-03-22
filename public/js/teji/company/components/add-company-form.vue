<template>

  <div class="form__content">
    <p class="form-description">住所とURLを入力してください。</p>
    <dl class="input-line">
      <dt class="label">住所</dt>
      <dd class="form-asset"><inpu type="text" class="input-text" placeholder="Your Company Address..." value="" /></dd>
    </dl>
    <dl class="input-line">
      <dt class="label">URL</dt>
      <dd class="form-asset"><inpu type="text" class="input-text" placeholder="Your Company URL..." value="" /></dd>
    </dl>
  </div>

</template>

<script>
module.exports = {
  data: function(){
    return {
    }
  }
};
</script>