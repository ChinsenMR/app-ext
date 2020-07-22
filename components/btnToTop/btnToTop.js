// components/btnToTop/btnToTop.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
        type: Boolean,
        value: false
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 返回顶部
     */
    onToTop: function () {
      this.setData({
        show:false
      })
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    }
  }
})
