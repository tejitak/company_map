<template>

  <section class="addcompany-content modal-content">
    <i class="modal-overlay" v-on="click: close()"></i>
    
    <div class="modal-body pahse-start">
      <header class="modal-header">
        <h1 class="heading-1">会社の登録</h1>
        <div class="closeWrap functions">
          <div class="route">
            <i class="circle on"></i>
            <i class="circle"></i>
            <i class="circle"></i>
          </div>
          <a href="javascript:;" v-on="click: close()" class="close" title="Close">
            <i class="icon-close">X</i>
          </a>
        </div>
      </header>
      <main class="modal-main">
        <!-- <vue-add-company></vue-add-company> -->
      </main>
      <footer class="modal-footer settelments">
        <button class="submit ok">OK</button>
      </footer>
    </div>
    
    <!-- modal-body phase-confirm -->
    <!-- modal-body phase-end -->
    
    <div class="modal-error">
      <p class="error-text">おっと、URLが正しい形式ではないようです…</p>
      <p class="error-text">おっと、住所が未記入ですよ…</p>
      <p class="error-text">おっと、URLが未記入のようです…</p>
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