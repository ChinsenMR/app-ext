import { getCartList, clearGoods, changeGoodsNum } from '../../utils/requestApi.js';
const app = getApp();
let touchDotX = 0;//X按下时坐标
let touchDotY = 0;//y按下时坐标
let interval;//计时器
let time = 0;//从按下到松开共多少时间*100
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    tabIndex: '',//底部导航栏的索引值
    storeList:{},//购物车数据
    totalPrice: 0,  // 总价
    goodsTotal: 0, //商品条数
    selectAllStatus: false, // 全选
    magnitudeObj:{},  //等于判断数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ tabIndex: options.tabIndex })
    this.getStorId()
  },

  //获取门店信息id
  getStorId(){
    const {StoreId,BrandLevel} = wx.getStorageSync("userInfo");
    // console.log(StoreId+"==============="+BrandLevel);
    let obj ={
      StoreId: StoreId ? StoreId : 0,
      BrandLevel: BrandLevel ? BrandLevel : 0,
    }

    console.log(obj)
    this.setData({
      magnitudeObj:obj
    })
      
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let user = wx.getStorageSync("userInfo");
    console.log(user);
    this.initData();
  },

  
  
  // 初始化页面数据
  initData:function(){
    wx.showLoading({
      title: '加载中...',
    })
    getCartList().then(res =>{ 
      if (res.data.Status == "Success"){
        console.log("初始化数据",res);
        wx.hideLoading()
        let { CartItemInfo } = res.data.Data
        CartItemInfo.forEach(item =>{
          item.status = false;
          item.clearStatus = false;
          item.Quantity = parseInt(item.Quantity);
          item.ItemAdjustedPrice = parseFloat(item.ItemAdjustedPrice);
          item.MemberPrice = parseFloat(item.MemberPrice);
        })
        this.setData({ 
          storeList: res.data.Data,
          totalPrice: 0,
          goodsTotal: 0,
          selectAllStatus: false
        })
        app.data.cartNum = res.data.Data.RecordCount
      }
    })
  },

  // 改变商品的数量
  changeNum:function(e){
    let { storeList } = this.data;
    let { id, num } = e.currentTarget.dataset;
    let type = e.currentTarget.dataset.type;
    storeList.CartItemInfo.forEach(item => {
      if (item.SkuID == id) {
        if (type == 'reduce') {
          if (item.Quantity != 1) item.Quantity -= 1;
        }else {
          this.changeGoods(item.SkuID, item.Quantity).then(res =>{
            if (res) item.Quantity += 1;
          })
        }
        this.changeGoods(item.SkuID, item.Quantity);
        this.setData({ storeList })
        this.goodsSum()
      }
    })
  },
  
  //改变商品的数量  发起请求
  changeGoods:function(id,num){
    return changeGoodsNum({
      SkuID: id,
      Quantity: num
    }).then(res =>{
      if (res.data.Status == 'Faile'){
        wx.showToast({
          icon: 'none',
          title: res.data.Message,
        })
        return false;
      } 
      else return true
    })
  },


  // 全选
  selectAll:function(){
    let { storeList, selectAllStatus } = this.data;
    storeList.CartItemInfo.forEach(item => {
      item.status = !selectAllStatus
    })
    this.setData({
      storeList,
      selectAllStatus: !selectAllStatus
    })
    this.goodsSum()
  },

  //单选
  selelctSingle: function (e){
    let { storeList } = this.data;
    let l = 0; // 选择项的长度
    let id = e.currentTarget.dataset.id;
    storeList.CartItemInfo.forEach(item =>{
      if (item.SkuID == id){
        item.status = !item.status;
        this.setData({ storeList })
      }
      if (item.status) l++;
      else l--;
    })
    if (l == storeList.CartItemInfo.length) this.setData({ selectAllStatus:true })
    else this.setData({ selectAllStatus: false })
    this.goodsSum();
  },

  // 计算价格
  goodsSum:function(){
    let { storeList, goodsTotal } = this.data;
    goodsTotal = 0;
    let totalPrice = 0;
    storeList.CartItemInfo.forEach(item => {
      if(item.status){
        goodsTotal ++;
        totalPrice += item.Quantity * item.MemberPrice;
      }
      this.setData({ totalPrice: totalPrice.toFixed(2), goodsTotal })
    })
  },

  // 触摸开始事件
  touchStart: function (e) {
    touchDotX = e.touches[0].pageX; // 获取触摸时的原点
    touchDotY = e.touches[0].pageY;
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      time++;
    }, 100);
  },

  // 触摸结束事件
  touchEnd: function (e) {
    let { storeList } = this.data;
    let id = e.currentTarget.dataset.id;
    let touchMoveX = e.changedTouches[0].pageX;
    let touchMoveY = e.changedTouches[0].pageY;
    let tmX = touchMoveX - touchDotX;
    let tmY = touchMoveY - touchDotY;
    if (time < 20) {
      let absX = Math.abs(tmX);
      let absY = Math.abs(tmY);
      if (absX > 2 * absY) {
        storeList.CartItemInfo.forEach(item => {
          if (id == item.SkuID) {
            if (tmX < -5) item.clearStatus = true;
            else item.clearStatus = false;
            this.setData({ storeList })
          }
        })
      }
     
    }
    clearInterval(interval); // 清除setInterval
    time = 0;
  },

  //删除商品
  clear:function(e){
    let { id, num } = e.currentTarget.dataset;
    clearGoods({
      SkuIDs: id,
      Quantity: num
    }).then(res =>{
      console.log(res)
      this.initData();
    })

  },

  //获取优惠券
  getCoupon:function(){
    this.selectComponent("#coupon").showModal();
  },
  //跳转首页
  handleGo(){
    let arr = wx.getStorageSync('tab').TopMenus;
    console.log("购物车",arr);
    arr.forEach(v=>{
      if(v.Name=='首页'){
        app.goTo(`/${v.Content2}`,1)
      }
    })
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