// packageA/pages/fuCombina/fuCombina.js
import { CombinationGradesList,addToCart} from "../../../utils/requestApi.js";
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalPrice:'',//总价格
    RList:[],//组合购请求数据
    chooseIndex:null,//选择了哪一个
    imgurl:'https://hmqy.oss-cn-hangzhou.aliyuncs.com/hmeshopV3/xiezp/'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    CombinationGradesList().then(res => {
      if (res.data.Status === 'Success'){
        this.setData({
          RList: res.data.RList
        })
      }else{
        wx.showToast({
          title: res.data.Message,
          icon:'none'
        })
      }
      
    })
  },
  //选择组合购
  choose(e){
    let index = e.currentTarget.dataset.index;
    let arr = index.split('_');
    let first = arr[0];
    let seconend = arr[1];
    let totalPrice = this.data.RList[first].CGList[seconend].GroupAmount
    this.setData({
      chooseIndex:index,
      totalPrice: totalPrice
    })
  },
  addCart(){
    let index = this.data.chooseIndex;
    let arr = index.split('_');
    let RList = this.data.RList;
    let CombinationId = RList[arr[0]].CombinationId;
    let GroupId = RList[arr[0]].CGList[arr[1]].GroupId;
    console.log(CombinationId, GroupId)
    addToCart({
        CombinationId: CombinationId,
        GroupId: GroupId
    }).then( res => {
      if (res.data.Status === 'Success'){
        this.setData({
          chooseIndex:null,
          totalPrice:null
        })
        wx.navigateTo({
          url: '/pages/cart/cart',
        })
      }else{
        wx.showToast({
          title: res.data.Message,
          icon:'none'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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