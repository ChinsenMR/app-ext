import {setClearHistory,getSearcHistory,getProductsDataList} from "../../utils/requestApi"
let timeId = -1;
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    searchVal: '', //搜索值
    hiddenKey: false, //显示搜索关键词
    hiddenResult: true,  //显示搜索结果
    hiddenDrawer: true,  //显示筛选抽屉 
    popularKeyword: [],  //热门
    historyKeyword: [],  //历史搜索
    CommodityList:[],  // 商品列表
    sortAction:0, // 排序字段 排序方式 0倒序1升序
    priceObj:{},  // 价格高低对象
  },
  pageSize:10,   // 每页数量
  pageIndex: 1, // 当前第几页
  searchPriceBegin:'',//	否	int	最低价格
  searchPriceEnd:'',	//否	int	最高价格
  MarketPrice:'', // 市场价
  SortBy:'',
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    //从历史缓存中读取历史搜索记录
    wx.getStorage({
      key: 'historyValue',
      success(res) {
        that.setData({
          historyKeyword: JSON.parse(res.data)
        })
      }
    })
    
    let str = wx.getStorageSync('homeTitle');
    wx.setNavigationBarTitle({
      title: str 
    })

    that.getHotHistoryData();
    //that.getCommodityList(that.data.searchVal); //获取商品列表
  },

  //获取商品列表根据各种id
    getCommodityList(val){
    let that= this;
    let searchVal = val;
    let data = {
      pageSize: that.pageSize,
      pageIndex: that.pageIndex,
      Keywords: searchVal,
      searchPriceBegin:this.searchPriceBegin,	
      searchPriceEnd:this.searchPriceEnd,
      SortBy: this.SortBy
    }
    getProductsDataList(data).then(res=>{
      let commodArr = res.data.Result.Data;
      // res.data.Result.TotalRecords>0
     console.log(res)
     console.log(res.statusCode)
      if(res.statusCode==200){
        
        if (commodArr.length > 0){
          //搜索有数据的情况
          let CommodityList = this.data.CommodityList;
          commodArr.forEach(item => {
            CommodityList.push(item);
          })
          that.setData({
            CommodityList: CommodityList
          })
        }else{
          //搜索不到数据
          if(this.pageIndex === 1){
            wx.showToast({
              title: '无当前商品',
              icon:'none'
            })
          }else{
            wx.showToast({
              title: '到底啦~~',
              icon:'none'
            })
          }
          
        }
        
      }
    })
  },

  // 获取组件传过来的值:价格筛选
  getSortNum(e) {
    // let searchVal =this.data.searchVal;
    // let sortStr =e.detail
    this.SortBy = 'MarketPrice';
    this.setData({
      CommodityList:[]
    })
    this.getCommodityList(this.data.searchVal)

  },



  // 获取热门和历史关键词
  getHotHistoryData(){
    let that =this;
    getSearcHistory().then(res=>{
      let {HistoryData = [],HotData} =res.data.Result;
      //去除空值和undefined
      HotData = HotData.filter( item => item);
      //长度不超过10
      if (HotData.length > 10){
        HotData.splice(10, HotData.length-10)
      }
      that.setData({
        popularKeyword: HotData
      })
    })
  },

  // 删除历史
  clearHistory:function(){
    this.setData({ historyKeyword: [] })
    wx.removeStorageSync('historyValue')
  },

  //点击搜索
  onSearch:function(e){
    if (e.detail.value == ''){
      wx.showToast({
        icon: 'none',
        title: '搜索词为空'
      })
      return;
    }
    let historyValue = this.data.historyKeyword;

    //过滤重复关键词
    if (historyValue.indexOf(e.detail.value) == -1) {
      historyValue.unshift(e.detail.value);
    }
    //过滤空格
    historyValue = historyValue.filter( item => item.trim());
    //长度不超过10
    if (historyValue.length > 10){
      historyValue.splice(10, historyValue.length-10)
    }

    //设置历史搜索记录
    wx.setStorage({key: 'historyValue',data: JSON.stringify(historyValue)})
    let searchVal = e.detail.value;
    this.setData({
      historyKeyword: historyValue,
      searchVal: e.detail.value,
      hiddenKey: true,
      hiddenResult: false,
      CommodityList: [],//清空上次搜索数据
      minPrice:'',//组件筛选最低价格清空
      maxPrice: ''//组件筛选最高价格清空
    })
    this.pageIndex = 1;//搜索页数重制为1
    this.searchPriceBegin = '';//重置筛选最低价格
    this.searchPriceEnd = '';//重置筛选最高价格
    this.SortBy = '';//重置价格筛选
    this.getCommodityList(searchVal);
  },
  
  

  //点击取消搜索
  cancelSearch:function(){
    // if (this.data.searchVal == ''){return}
    this.setData({
      hiddenKey: false,
      hiddenResult: true,
      searchVal: ''
    })
    
    // 当paran == true 是  表示用户点击取消搜索按钮  还原搜索结果页面的默认设置
    this.selectComponent('#search-result').moreStore(true);
  },
  

  // 打开 或者 关闭 Drawer
  openDrawer:function(e){
    console.log("高低价格",e)
    // 确认筛选
    if (e.detail && e.detail.comfirm){
      this.searchPriceBegin = e.detail.minprice || '';//筛选最低价
      this.searchPriceEnd = e.detail.maxprice || '';//筛选最高价
      this.pageIndex = 1;//页数1
      this.setData({
        CommodityList: []//清空之前搜索
      })
      this.getCommodityList(this.data.searchVal);
    }
    //重置
    if(e.detail && e.detail.reset){
      this.searchPriceBegin = '';//筛选最低价
      this.searchPriceEnd =  '';//筛选最高价
      this.pageIndex = 1;//页数1
      this.setData({
        CommodityList: []//清空之前搜索
      })
      this.getCommodityList(this.data.searchVal);
    }
    this.setData({
      hiddenDrawer: !this.data.hiddenDrawer,
    })
  },
  
  //点击热门关键词  搜索
  onPopular:function(e){
    console.log("热门id",e)
    this.setData({
      searchVal: this.data.popularKeyword[e.currentTarget.dataset.id] 
    })
    this.onSearch({ detail: { value: this.data.searchVal }});
  },

  //点击历史关键词  搜索
  onHistory:function(e){
    this.setData({
      searchVal: this.data.historyKeyword[e.currentTarget.dataset.id] 
    })
    this.onSearch({ detail: { value: this.data.searchVal } });
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
    this.pageIndex = this.pageIndex + 1;
    console.log(this.pageIndex)
    this.getCommodityList(this.data.searchVal);
  },


})