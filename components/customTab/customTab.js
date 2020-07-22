const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabType: String,  //必传值
    totalPrice: String,  // 商品总价  非传值
    goodsTotal: String, // 商品总条数  非传值
    pageType: Number // 页面类型
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
  },

  lifetimes: {
    attached(){
      
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
  }
})
