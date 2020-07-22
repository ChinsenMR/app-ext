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
    imgUrl: app.data.imgurl,
    hiddenModal: true,  //显示弹框  商品服务保障
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showModal:function(){
      this.setData({
        hiddenModal: !this.data.hiddenModal
      })
    }
  }
})
