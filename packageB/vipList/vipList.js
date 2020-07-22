let app =  getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.data.imgurl,
    nav:['首页','会员转系','好先生','lss','好喜欢','你猜猜'],
    nums:0,
    list:[],//商品列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let arr = wx.getStorageSync('tab').TopMenus;
    wx.setNavigationBarTitle({
      title: options.name    // 其他页面传过来的标题名
    })
    this.setData({ tabIndex: options.tabIndex})
    this.tagid = options.tagid
    this.getList(options.tagid);
  },
  page:{
    index:1,
    size:10
  },
  total:1,
  tagid:'',
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  //获取商品列表
  getList(id){
    app.fg({
      url:'/api/ProductHandler.ashx?action=GetGradeProducts',
      data:{
        pageIndex:this.page.index,
        pageSize:this.page.size,
        tagIds:id
      }
    }).then(res=>{
      if (res.data.Result.Data.length !=0){
        let arr = res.data.Result.Data;
        console.log('商品列表数据', arr);
        let all = res.data.Result.TotalRecords;
        if (all / this.page.size < this.page.index) {
          this.total = 1
        } else {
          this.total = Math.ceil(all / this.page.size);
        }
        let newArr = [...this.data.list, ...arr];
        this.setData({
          list:newArr
        })
      }
    })
  },
  //跳转商品详情
  handleDetail(e){
    const { productid } = e.currentTarget.dataset;
    app.goTo(`/pages/goodsDetail/goodsDetail?p=${productid}`)
  },

  //切换导航栏
  handleNav(e){
    const {index} = e.currentTarget.dataset;
    this.setData({nums:index})
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
    this.page.index = 1;
    this.setData({
      list: []
    });
    this.getList(this.tagid);
    //  结束下拉刷新组件的显示
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.page.index >= this.total) {
      app.fa('没有更多数据了!')
    } else {
      this.page.index++
      this.getList(this.tagid)
    }
  },

 
})