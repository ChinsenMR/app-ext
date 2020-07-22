require("../../config.js");

const app = getApp();
console.log(app)
Page({
  data: {

    RequestUrl: app.getRequestUrl(),
    heigth: 180,
  },
  onLoad: function (n) {
    
    console.log('onLoad')
  },

  onReady: function () {
    console.log('onReady')
  },
  onShow: function () {


  },
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
 
  viewTap: function () {
    this.setData({
      text: "Set some data for updating view."
    });
  },
  customData: {
    hi: "MINA"
  }
});

var temp = {
  imageLoad: function (e) {
    console.log(e, '2222222sddddddddddd222');
    console.log('2222222sddddddddddd222');
    console.log('2222222sddddddddddd222');


  },
  setWidth(e) {
    console.log(e, 5555555555555);
  }
}
//导出，供外部使用
export default temp