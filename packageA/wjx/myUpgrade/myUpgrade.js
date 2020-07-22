let app = getApp();
import { getMyAgent} from "../../../utils/requestApi"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    obj:{},
    xgImg:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCation();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  //获取资质数据
  getCation() {
    getMyAgent().then(res=>{
      console.log("输出资质信息", res); //CertImg
      if (res.data.Status == "Success") {
        let certimg = res.data.Data.CertImg;
        this.setData({
          obj: res.data.Data,
          xgImg: certimg.split(',')[1]
        })
      }
    })
    
/*     wx.request({
      url: app.data.url+'/API/MembersHandler.ashx?action=GetMyAgent',
      data: {},
      header: { Cookie: wx.getStorageSync('cookie')},
      method: 'GET',
      success: (result) => {
        console.log("s++++++++++++", result);
      },
      fail: () => {},
      complete: () => {}
    }); */
      
    
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  
})