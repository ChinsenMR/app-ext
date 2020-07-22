const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    totalPrice: Number,  // 商品总价  非传值
    goodsTotal: Number, // 商品总条数  非传值
    storeList: Object,
    magnitude: Object,
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    isDefault: null, //判断是否为默认tab样式
  },

  ready(){
    if (wx.getStorageSync('tab').WapTheme == 'fruit') this.setData({ isDefault: 1 })
    else this.setData({ isDefault: 2 })
  },

  /**
   * 组件的方法列magnitude表
   */
  methods: {
    placeOrder:function(){
      let { storeList } = this.data;
      let sku = [];
      storeList.CartItemInfo.forEach(item =>{
        if (item.status) sku.push(item.SkuID)
      })
      if (sku.length == 0){
        wx.showToast({
          icon: 'none',
          title: '请选择商品'
        })
        return;
      }
      wx.navigateTo({
        url: `../confirmationOfOrder/confirmationOfOrder?sku=${sku.join(',')}`,
      })
    },


    // 跳转掌柜页面
    handleMagnitude(){
      wx.redirectTo({
        url: '/packageA/pages/shopkeeperList/shopkeeperList',
        success: (result) => {
          
        },
        
      });
        
    },

    // 跳转升级页面
    handleUpgrade(){
      wx.navigateTo({
        url: '/pages/upgradeMember/upgradeMember',
        success: (result) => {
          
        },
      });
    },
    

    // 回首页
    goIndex(){
      console.log("触发了");
      wx.redirectTo({
        url: '/pages/moduleHome/moduleHome',
      })
    },

  }
})
