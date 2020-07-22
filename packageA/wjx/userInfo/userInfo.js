import { debounce } from "../../../utils/myutil"
let app =  getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.data.imgurl,
    user:[
      {
        title:'姓名:',
        pla:'请输入姓名',
        val:'',
        name:'Name',
        type:'text',
        type2:'HeadUrl',
        dis: true,
        status:false,//是否显示上传二维码
      },
      {
        title: '手机号码:',
        pla: '请输入手机号码',
        val: '',
        name: 'tel',
        type: 'number',
        dis: true,
        status: false,//是否显示上传二维码
      },
      {
        title: '微信号:',
        pla: '请输入微信号',
        val: '',
        name: 'wechat',
        type: 'text',
        dis: true,
        status: false,//是否显示上传二维码
      },
      {
        title: '设置时间:',
        pla: '分销订单系统自动处理时间(默认1小时)',
        val: '',
        // name: 'SendGoodsLimitTime',
        name: 'time',
        type: 'number',
        dis: false,
        status: false,//是否显示上传二维码
      },
      {
        title: '微信二维码:',
        pla: '请上传微信二维码',
        val: '',
        name: 'codeVal',
        type: 'text',
        dis:true,
        status: true,//是否显示上传二维码
      },
    ],
    avatar: '',//保存的图片路径
    obj:{},//代理信息
    numVal:'',//默认设置时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  //获取代理信息
  getUserInfo(){
    let { user } = this.data;
    app.fg({
      url:'/API/MembersHandler.ashx?action=GetMyAgentInfo',
    }).then(res=>{
      // console.log("代理信息",res);
      if(res.data.Status=="Success"){
        let obj = res.data.Data;
        user.forEach(v=>{
          for(let key in obj){
            if (v.name == key){
              v.val = obj[key] || '无'
            } else if (key =='WxImage'){
              this.setData({
                avatar: obj[key]
              })
            } else if (v.type2 == key) {
              v.HeadUrl = obj[key]
            } 
          }
        })
        this.setData({
          user,
          obj,//代理信息
        })
      }
    })
  },
  //获取输入框的值
  handleInput: debounce(function(e){
    const {obj} = this.data;
    const {value} = e.detail;
    if (value > obj.MaxSendGoodsLimitTime){
      app.fa('超出最大设置时间,请重新输入!')
      return
    }else if(value < 0){
      app.fa('不能小于0小时,请重新输入!')
      return
    }
    this.setData({
      numVal: value
    })
  }),

  //删除图片
  handleDel(){
    this.setData({
      avatar:''
    })
  },

  //保存图片
  handleBC(){
    let { avatar, numVal,obj } = this.data;
    if (avatar==''){
      app.fa('请上传1张二维码图片!')
      return
    } else if (numVal > obj.MaxSendGoodsLimitTime){
      app.fa('超出最大设置时间!')
      return
    } else if (numVal < 0) {
      app.fa('不能小于0小时,请重新输入!')
      return
    }else{
      app.fg({
        url: '/API/MembersHandler.ashx?action=UpdateAgentInfo',
        data: {
          LicenseImg: avatar || '',	//是	string	营业执照
          WxImage: avatar || '',//	是	string	微信二维码
          CertImg: avatar || '',//否	string	相关资质
          SendGoodsLimitTime: numVal == '' ? obj.MaxSendGoodsLimitTime : numVal,
        }
      }).then(res => {
        console.log("保存代理信息", res);
        if (res.data.Status == "Success") {
          // app.fa('保存成功!')
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            });
          }, 1500);
        }else{
          app.fa(res.data.Message)
        }
      })
    }
  },


  // 上传二维码
  upAvatar() {
    wx.showNavigationBarLoading()
    wx.chooseImage({
      count: 1,
      success: res => {
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: app.data.url + '/AppShop/AppShopHandler.ashx?action=AppUploadImage',
          filePath: tempFilePaths[0],
          name: 'file',
          success: res2 => {
            wx.hideNavigationBarLoading()
            // console.log("输出上传图片的", JSON.parse(res2.data));
            this.setData({ 
              avatar: JSON.parse(res2.data).Result.ImageURL 
            })
          }
        })
      }
    })
  },
  //表单提交
  formSubmit: function (e) {
    // console.log('form发生了submit事件，携带数据为：', e.detail.value)
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