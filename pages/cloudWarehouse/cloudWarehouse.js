const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    hiddenState: true, // 显示状态
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    this.InitData()
  },
  InitData() {
    wx.showLoading({})
    app.fg({
      url: '/API/KjAgentHandler.ashx?action=GetProductInventory'
    }).then(res => {
      console.log("ssss", res)
      if (res.data.Status == "Faile") {
        wx.hideLoading()
        wx.showModal({
          title: res.data.Message,
          success(res) {
            if (res) {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })

      }
      if (res.data.Status == "Success") {
        res.data.Data.forEach(v => {
          v.show = true;
        });
        this.setData({
          list: res.data.Data
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

  showStatus: function(e) {
    let {
      index
    } = e.currentTarget.dataset.index
    this.setData({
      'list[index].show': !this.data.list[index].show
    })
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