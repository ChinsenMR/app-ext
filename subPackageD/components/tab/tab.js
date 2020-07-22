
const app = getApp();



Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsTotal: String || String,
    totalPrice: String || String,
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    isComfirmIng: false,
    isDefault: null, //判断是否为默认tab样式
  },

  ready() {
    if (wx.getStorageSync('tab').WapTheme == 'fruit') this.setData({
      isDefault: 1
    })
    else this.setData({
      isDefault: 2
    })
    
  },

  /**
   * 组件的方法列magnitude表
   */
  methods: {

    placeOrder() {

      // let {
      //   goodsList
      // } = this.data;
      // let sku = [];
      // goodsList.forEach(item => {
      //   if (item.status) sku.push(item)
      // })
      // const orderData = {
      //   sku,
      //   totalPrice: this.data.totalPrice,
      //   goodsTotal: this.data.goodsTotal
      // }
      // wx.setStorageSync('orderData', orderData)
      // if (sku.length == 0) {
      //   wx.showToast({
      //     icon: 'none',
      //     title: '请选择商品'
      //   })
      //   return;
      // }
      wx.navigateTo({
        url: `/subPackageD/pages/pointStore/confirmOrder`,
      })
    },


    // 跳转掌柜页面
    handleMagnitude() {
      wx.redirectTo({
        url: '/packageA/pages/shopkeeperList/shopkeeperList',
        success: (result) => {

        },

      });

    },

    // 跳转升级页面
    handleUpgrade() {
      wx.navigateTo({
        url: '/packageC/pages/upgradeMember/upgradeMember',
        success: (result) => {

        },
      });
    },


    // 回首页
    goIndex() {
      console.log("触发了");
      wx.redirectTo({
        url: '/pages/moduleHome/moduleHome',
      })
    },

  }
})

