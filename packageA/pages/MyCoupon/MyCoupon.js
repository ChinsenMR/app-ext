// packageA/pages/MyCoupon/MyCoupon.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Topheard: [{
      Name: '可用',
      Num: ""
    }, {
      Name: '过期或已使用',
      Num: ""
    }],
    List:[],
    active: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  Select(e) {
    if (e.detail.index == 0) {
      this.setData({
        active: 0,
        List: []
      })
      this.InitDara(1)
    } else {
      this.setData({
        active: 1,
        List:[]
      })
      this.InitDara(4)
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.InitDara(1)
  },
  InitDara(usedType) {
    app.fg({
      url: '/api/MembersHandler.ashx?action=GetUserCoupons',
      data:{
        usedType: usedType
      }
    }).then(res => {
      console.log("kkkk", res)
      if (res.data.Status == "Success"){

         res.data.Data.forEach(v=>{
           let sh = v.StartTime.split("T")[1]
           let smonth  = v.StartTime.split("T")[0].split('-')[1]
           let sday = v.StartTime.split("T")[0].split('-')[2]
           v.StartTime = smonth + '.' + sday + " "+ sh


           let eh = v.ClosingTime.split("T")[1]
           let emonth = v.ClosingTime.split("T")[0].split('-')[1]
           let eday = v.ClosingTime.split("T")[0].split('-')[2]
           v.ClosingTime = emonth + '.' + eday + " " + eh

         })
        this.setData({
          'Topheard[0].Num': res.data.CanTotal,
          'Topheard[1].Num': res.data.CanNotTotal,
            List: res.data.Data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

 
})