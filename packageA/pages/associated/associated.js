import { bindAgent } from "../../../utils/requestApi";
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.kcj>0){
      wx.showToast({
        title:'您已是代理,无需重新绑定!!!',
        icon:'none'
      })
      setTimeout(()=>{
        wx.navigateBack({
          delta: 1
        })
      },1500)
    }
  },

  // 提交
  formSubmit: function (e) {
    let valObj = e.detail.value;
    console.log(valObj)
    bindAgent({
      Username: valObj.userName,//	是	string	代理账号
      Password: valObj.userPass, //	是	string	代理密码
      BindType:1,//
    }).then(res=>{
      console.log("输出res",res);
      if (res.data.statu=="true"){
        wx.showToast({
          title: '绑定成功',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
          success: (result) => {
            setTimeout(() => {
              // wx.navigateBack({
              //   delta: 1
              // });
              wx.navigateTo({
                url: '/pages/authorizationLogin/authorizationLogin',
              });
                
            }, 1500);
          },
          fail: () => {},
          complete: () => {}
        });
      }else{
        console.log("s输出", res.data.msg);
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1500,
          mask: false,
          success: (result) => {
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              });
            }, 1500);
          },
          fail: () => {},
          complete: () => {}
        });
          
       
      }
    })
    
  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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