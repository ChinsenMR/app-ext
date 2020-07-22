// pages/member/code/code.js
const app =  getApp();

Component({

  properties:{
    show:Boolean,
    swiper:Array
  },
  /**
   * 页面的初始数据
   */
  data: {
    index:0,//swiper默认第一张
    wx_img:"http://img.hmeshop.cn/jxyh5/icon_wechat@2x.png",
    download_img:"http://img.hmeshop.cn/jxyh5/icon_xiazai@2x.png",
    hidden:false,//是否隐藏,
    tabHide:true
  },

  methods:{
    move() { },
    //取消code
    cancel(e) {
      let that =this;
      that.setData({
        show: false
      })
      that.triggerEvent('tabShow')
    },
    
    //swiper改变
    change(e){
      let index = e.detail.current;
      this.setData({
        index:index
      })
    },
    save(){
      let save = wx.getStorageSync('save');//用户是否拒绝过
      let saveImg = () => {
        let url =this.data.swiper[this.data.index].url;
        wx.downloadFile({
          url: url,
          success: res => {
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function (data) {
                wx.showToast({
                  title: "保存成功",
                  icon: "success",
                  duration: 2000
                });
                if (save) {
                  wx.removeStorageSync('save')
                }
              },
              fail: data => {
                wx.setStorageSync('save', 'fail')
              }
            })
          },
          fail: err => {
            wx.showToast({
              title: '下载图片失败',
              icon: 'none'
            })
          }
        })
      }
      //打开用户设置
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.writePhotosAlbum']){
            wx.removeStorageSync('save')
            saveImg()
          }else{
            if(!save){
              saveImg()
            }else{
              //拒绝过授权，再次保存让用户开启授权
              wx.openSetting({
                success: res => {
                  console.log(res)
                }
              })
            }
            
          }
        }
      })
    }
  }
})