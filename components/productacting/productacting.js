// components/productacting/productacting.js
const app = getApp()
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
    productdata: [
    //   {
    //   name: "领券中心",
    //   imgurl: app.data.imgurl + "icon_linquanzhongxin@2x.png"
    // },
    //  {
    //   name: "积分商城",
    //   imgurl: app.data.imgurl + "icon_jifenshangcheng@2x.png"
    // },
     {
      name: "9.9元包邮",
      imgurl: app.data.imgurl + "icon_9.9@2x.png"
    }, {
      name: "每日爆款",
      imgurl: app.data.imgurl + "icon_baokuan@2x.png"
    }, {
      name: "买一送一",
      imgurl: app.data.imgurl + "icon_faxianhaohuo1@2x.png"
    }]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    junpactive(e) {
      console.log(e)
      switch (e.currentTarget.dataset.index+1) {
        case 0:
          wx.navigateTo({
            url: '/pages/VoucherCenter/VoucherCenter',
          })
          break;
          // case 1:
          // wx.navigateTo({
          //      url: '/pages/integralShop/integralShop',
          // })
          // break;

        case 1:
          wx.navigateTo({
            url: '/pages/nighpackge/nighpackge',
          })
          break;
        case 2:
          wx.navigateTo({
               url: '/pages/recommendDaily/recommendDaily',
          })
          break;
        case 3:
          wx.navigateTo({
               url: '/pages/buyOneFree/buyOneFree',
          })
          break;
      }
    }
  }
})