const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: app.data.imgurl
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击关闭按钮
    closeFun: function () {
      this.triggerEvent('showModal3')
    }
  }
})
