<style lang="stylus">
.popup
  position relative
  overflow auto
  max-height 400px
  max-width 280px
  padding 20px
  background-color #fff

  .closeWrap
    position absolute
    top 16px
    right 16px

  .close
    display block
    width 32px
    height 32px
    background-repeat no-repeat
    background-image url(unquote('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAA21BMVEUAAABUbnpMZG9UbnpUbnpUbnpMZG9MZG9MZG9UbnpUbnpUbnpUbnpUbnpMZG9MZG9MZG9MZG9MZG9UbnpUbnpUbnpMZG9MZG9MZG9UbnpMZG9MZG9MZG9MZG9Vb3tLY25UbXlMZG9TbXhNZXBUbnpUbnpMZG9MZG9MZG9UbnpUbnpUbnpMZG9MZG9MZG9UbnpUbnpTbXhMZG9MZG9UbnpUbnlUbnpVb3tLY25UbnpMZG9UbnpUbnpMZG9MZG9UbnpUbnpUbnpMZG9MZG9UbnpMZG9TbXhNZXD///9uCJN+AAAARHRSTlMAAAAGNAoLLwYFceZ6BwmH5WQE5PV5hvbgCfNwCG8HCH2J+fl9+vlyBQiJ+/t8B4b2+PV583JvBgaHei/i3ywEZHDhXLNq3lYAAAABYktHREjwAtTqAAAA0klEQVQ4y93SZw6CMBiAYVpwKyqCiltxKzhwg7hA738jFWihCT2A9l/zPqHNRxnmjxZguRgItjCeSEKip9KZbA4LyOcLRSEsAFeyRQkJyJcrTjVBADkrYuH2Wr1BnpGTkPB6k7xDSFA6Fq02pSPR6dK6L3oKtX+n1R88X8PRmNIZMJnOnq+5qtE+IC+W9kpx1nq0cPtmq64pwuu7/UGPFn5nAdQiBe6fUUcJEDuijsSJ+FnAMHH3xdkiwOVq3tjgwWin+0Mgz2ANOfzkeIs27t9cb3YPIZqx7iqsAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE0LTEyLTEwVDE1OjU3OjQxKzA4OjAwRI/yxAAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxNC0xMi0xMFQxNTo1Nzo0MSswODowMDXSSngAAABNdEVYdHNvZnR3YXJlAEltYWdlTWFnaWNrIDYuOC44LTcgUTE2IHg4Nl82NCAyMDE0LTAyLTI4IGh0dHA6Ly93d3cuaW1hZ2VtYWdpY2sub3JnWaRffwAAABh0RVh0VGh1bWI6OkRvY3VtZW50OjpQYWdlcwAxp/+7LwAAABh0RVh0VGh1bWI6OkltYWdlOjpIZWlnaHQAMTI4Q3xBgAAAABd0RVh0VGh1bWI6OkltYWdlOjpXaWR0aAAxMjjQjRHdAAAAGXRFWHRUaHVtYjo6TWltZXR5cGUAaW1hZ2UvcG5nP7JWTgAAABd0RVh0VGh1bWI6Ok1UaW1lADE0MTgxOTgyNjHyncNZAAAAEXRFWHRUaHVtYjo6U2l6ZQA5NDRCQjvWo/4AAABidEVYdFRodW1iOjpVUkkAZmlsZTovLy9ob21lL2Z0cC8xNTIwL2Vhc3lpY29uLmNuL2Vhc3lpY29uLmNuL2Nkbi1pbWcuZWFzeWljb24uY24vcG5nLzExODE3LzExODE3NTcucG5nepplUQAAAABJRU5ErkJggg=='))
</style>

<template>
<div class="popup" v-show="displayed">
    <content></content>
    <div class="closeWrap">
      <a href="javascript:;" v-on="click: displayed = false" class="close" title="Close"></a>
    </div>
</div>
</template>

<script>
  module.exports = {
    data: function () {
      return {
        displayed: false
      }
    }
  }
</script>