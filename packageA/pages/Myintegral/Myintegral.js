// packageA/pages/Myintegral/Myintegral.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    title: [{
      Name: '明细'
    }, {
      Name: '积分收入'
    }, {
      Name: '积分支出'
    }, ],
    alldata: {},
    List: [],
    pageIndex: 1
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
    this.InitData(0)
  },
  // 
  Selet(e) {
    this.setData({
      active: e.target.dataset.index,
      List: [],
      pageIndex: 1
    })
    let {
      active
    } = this.data
    if (active == 0) {
      this.InitData(0)
    }
    if (active == 1) {
      this.InitData(1)
    }
    if (active == 2) {
      this.InitData(2)
    }
  },
  InitData(PointType) {
    app.fg({
      url: '/API/AccountDetailHandler.ashx?action=GetPointDetails',
      data: {
        PointType: PointType,
        pageIndex: this.data.pageIndex,
        pageSize: 10
      }
    }).then(res => {
      console.log("====", res)
      if (res.data.Status == "Success") {
        if (res.data.Data.length > 0) {
          let list = this.data.List.concat(res.data.Data)
          this.setData({
            alldata: res.data,
            List: list
          })
        } else {
          wx.showToast({
            title: '到底了~~~',
            icon: 'none',
            duration: 1500,
            mask: true,
          });
            
        }
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
    let {
      active
    } = this.data
    this.data.pageIndex++
      if (active == 0) {
        this.InitData(0)
      }
    if (active == 1) {
      this.InitData(1)
    }
    if (active == 2) {
      this.InitData(2)
    }

  },

 
})