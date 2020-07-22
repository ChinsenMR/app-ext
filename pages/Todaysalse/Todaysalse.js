// pages/Commingsale/Commingsale.js
import { getProductsList} from '../../utils/requestApi.js'
const app =getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: app.data.imgurl,  //小图标
    goodslist: [],   //商品列表
    pageIndex:1,
    CatetoryId:"",// 分类id
    totoalpage:"",
    notime:false , //不需要时间
    searchVal:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
       console.log("品牌id", options)
       this.setData({
          CatetoryId: options.CatetoryId
       })
       this.getdata(options.CatetoryId,this.data.searchVal)
  },
 // 获取即将开售商品列表
  getdata(CatetoryId,val){
     let _this =this
     getProductsList({
        action:'GetProducts',
        pageSize:10,
        pageIndex:_this.data.pageIndex,
        CatetoryId: CatetoryId,
        Keywords:val?val:""
     }).then(res=>{
        console.log("今日特卖",res)
         
          if (res.data.Result.Status=="Success"){
          _this.setData({
             goodslist: _this.data.goodslist.concat(res.data.Result.Data),
             totoalpage: res.data.Result.TotalRecords
          })
          wx.hideLoading();
        }
           
     })    
 },
 
  //搜索
  onSearch(e){
     wx.showLoading({
          title: '搜索中~',
          mask: true,
          success: (result) => {
               
          },
          fail: () => {},
          complete: () => {}
     });
       
     const {value} = e.detail;
     this.setData({
       goodslist:[],
       searchVal:value
     })
     this.getdata(this.data.CatetoryId,value);

     console.log(value);
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
       if(this.data.goodslist.length<this.data.totoalpage){
            this.data.pageIndex++
            this.getdata()
       }else{
            wx.showToast({
                 title: '到底啦~~',
            })
       }
    
  },

})