const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // imgList: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    imgList: ['http://img.hmeshop.cn/hmeshop_jxy/images/big_pic@2x.png',
     'http://img.hmeshop.cn/hmeshop_jxy/images/big_pic@2x.png']
  },

  lifetimes: {
    attached() {
      console.log(this)
    }
  }, 

  /**
   * 组件的方法列表
   */
  methods: {
    close:function(){
      this.triggerEvent('closeModal',{closeM: true})
    }
  }
})
