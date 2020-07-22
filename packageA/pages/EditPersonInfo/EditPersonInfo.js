import { getpersondata, getMemberData } from '../../../utils/requestApi.js'
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      { t: '用户名', p: '请输入用户名', v: '', m:'UserName' },
      { t: '昵称', p: '请输入昵称', v: '', m: 'NickName' },
      { t: '姓名', p: '请输入姓名', v: '', m: 'realName' },
      { t: '性别', p: '请选择性别', v: '', m: 'Gender' },
      { t: '生日', p: '请输入生日', v: '', m: 'BirthDate' },
      { t: '地区', p: '请输入地址', v: '', m: 'Address' },
      { t: '个人描述', p: '请输入个人描述', v: '', m: 'PerDescribe' },
      { t: 'QQ', p: '请输入QQ号码', v: '', m: 'QQ' }
    ],
    sexArr: ['男','女'],
    avatar: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
  
  // 初始化页面数据
  initData(){
    let { list, avatar } = this.data;
    wx.showLoading({ title: '加载中...' })
    getMemberData().then(res =>{
      wx.hideLoading()
      if(res.data.Status == 'Success') {
        avatar = res.data.Data.picture
        list.forEach(item =>{
          Object.getOwnPropertyNames(res.data.Data).forEach(item2 =>{
            if (item.m == item2) {
              if (item.m == 'Gender') item.v = res.data.Data[item2] == 0? '男' : '女'
              else if (item.m == 'BirthDate') item.v = res.data.Data[item2] ? res.data.Data[item2].split('T')[0] : ''
              else item.v = res.data.Data[item2]
            }
          })
        })
      }
      this.setData({ list, avatar })
    })
  },

  // 选择picker
  onPicker(e){
    let { list, sexArr } = this.data;
    let { type } = e.currentTarget.dataset;
    if (type == '性别') {
      list.forEach(item =>{
        if (item.t == type) item.v = sexArr[e.detail.value]
      })
    }else{
      list.forEach(item => {
        if (item.t == type) item.v = e.detail.value
      })
    }
    this.setData({ list })
  },

  // 上传头像
  upAvatar(){
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
            this.setData({ avatar: JSON.parse(res2.data).Result.ImageURL })
          }
        })
      }
    })
  },

  // 提交保存
  onSubmit(e){
    wx.showLoading({ title: '保存中...' })
    let { UserName, NickName, realName, Gender, BirthDate, Address, PerDescribe, QQ } = e.detail.value;
    getpersondata({
      picture: this.data.avatar,
      gender: Gender == '男'? 0:1,
      birthday: BirthDate,
      realName: realName,
      nickname: NickName,
      address: Address,
      qq: QQ,
      perDescribe: PerDescribe,
      region: Address
    }).then(res =>{
      wx.hideLoading()
      wx.showToast({ icon: 'none', title: res.data.Result.Message })
      if (res.data.Result.Status == 'Success') {
        setTimeout(() =>{
          wx.navigateBack({ delta: 1 })
        }, 1000)
      }
    })
  },
  //获取输入框的值
  handleInput(e){
    let { list } = this.data
    console.log("输出++++",e);
    list.forEach((item, index)=>{
      if (item.m == e.target.dataset.name){
        list[index].v = e.detail.value
      }
    })
    this.setData({ list })
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