let app = getApp();
import {
  debounce
} from '../../utils/myutil'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.data.imgurl,
    list: [], //商品列表
    valueKey: '0', //输入框的值
    level: [], //代理等级
    isShow: false, //控制弹窗
    nums: -1,
    productid: '', //点击设置的商品id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getLevel();
    this.setData({
      tabIndex: options.tabIndex
    })
    this.getList();
  },
  page: { //页码对象
    index: 1,
    size: 10
  },
  total: 1, //总页码数
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  //获取商品列表
  getList() {
    app.fg({
      url: '/api/ProductHandler.ashx?action=GetProducts',
      data: {
        pageIndex: this.page.index,
        pageSize: this.page.size,
        SaleStatus: -1, //所有商品(包括上架和下架的)
      }
    }).then(res => {
      console.log("商品数据", res);
      if (res.data.Result.Status == "Success") {
        let arr = res.data.Result.Data;
        let all = res.data.Result.TotalRecords;
        if (all / this.page.size < this.page.index) {
          this.total = 1
        } else {
          this.total = Math.ceil(all / this.page.size);
        }
        let newArr = [...this.data.list, ...arr];
        this.setData({
          list: newArr
        })
      }
    })
  },
  //获取代理等级
  getLevel() {
    let newArr = [{
        id: "0",
        name: "固定金额"
      },
      {
        id: "1",
        name: "百分比"
      }
    ]
    app.fg({
      url: '/API/MembersHandler.ashx?action=GetReferralGrades',
      data: {
        NotKjLevel: false
      }
    }).then(res => {
      // console.log("代理等级",res);
      if (res.data.Status == "Success") {
        let arr = res.data.Data;
        arr.forEach(v => {
          v.title = '固定金额'
          v.value = '0'
          v.isCheck = false
          v.levels = newArr
        })
        this.setData({
          level: arr
        })
        this.getStore();
      }
    })
  },
  formSubmit(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },
  //获取直推奖励 //
  getStore() {
    let {
      level
    } = this.data;
    app.fg({
      url: '/api/KjAgentHandler.ashx?action=GetStoreSetConfig',
      data: {
        ProductId: this.data.productid, //	是	int	商品id
      }
    }).then(res => {
      // console.log('输出直推奖',res);
      if (res.data.Status == "Success") {
        console.log('0', level);
        let arr = res.data.Data;
        level.forEach(v => {
          arr.forEach(item => {
            if (v.GradeId === item.GradeId) {
              v.title = item.FirstType == '0' ? '固定金额' : '百分比'
              v.value = item.Commission || '0'
            }
          })
        })
        this.setData({
          level
        })
      } else {
        // app.fa(res.data.Message)
      }
    })
  },
  //显示修改百分比弹窗
  handleChange(e) {
    const {
      level
    } = this.data;
    const {
      index
    } = e.currentTarget.dataset;
    level.forEach((v, i) => {
      if (i == index) v.isCheck = !v.isCheck
    })
    this.setData({
      nums: index,
      isShow: true,
      level
    })
  },
  //选择弹窗的的值
  handleSeach(e) {
    const {
      level
    } = this.data;
    const {
      index,
      name
    } = e.currentTarget.dataset;
    level.forEach((v, i) => {
      if (i == index) {
        v.isCheck = false
        v.title = name
      }
    })
    this.setData({
      level
    })
  },
  //设置商品返利 // 
  setStore() {
    const {
      valueKey,
      level
    } = this.data;
    let arr = []
    level.forEach((item, index) => {
      let obj = {
        GradeId: item.GradeId,
        Commission: item.value || valueKey, //输入框的值
        FirstType: item.title == '固定金额' ? '0' : '1'
      }
      arr.push(obj)
    })
    // console.log("JSON.stringify(obj)", JSON.stringify(arr));
    let str = JSON.stringify(arr)
    app.fg({
      url: '/api/KjAgentHandler.ashx?action=StoreSetConfig',
      data: {
        ProductId: this.data.productid, //	是	int	商品id
        ConfigJson: str, //	是	string	json(FirstType: 0- 固定金额、1-百分比，Commission- 数值, GradeId等级ID)
      }
    }).then(res => {
      // console.log("设置返利的结果",res);
      if (res.data.Status == "Success") {
        app.fa(res.data.Message)
        setTimeout(() => {
          this.setData({
            isShow: false
          })
        }, 1500);
      }
    })
  },
  //打开设置弹窗
  handleSet(e) {
    const {
      productid
    } = e.currentTarget.dataset;
    this.setData({
      isShow: true,
      productid,
      // level:null
    })
    this.getLevel();

  },
  //关闭弹窗
  handleOff() {
    this.setData({
      isShow: false
    })
  },
  //输入框的值
  handleInput: debounce(function (e) { //防抖
    const {
      level
    } = this.data;
    const {
      index,
      gradeid
    } = e.currentTarget.dataset;
    const {
      value
    } = e.detail;
    level.forEach((v, i) => {
      if (i == index && gradeid == v.GradeId) v.value = value
    })
    this.setData({
      valueKey: value,
      level
    });
  }, 500),
  //跳转商品详情
  handleDetail(e) {
    const {
      productid
    } = e.currentTarget.dataset;
    app.goTo(`/pages/goodsDetail/goodsDetail?p=${productid}`)
  },
  //聚焦时清除输入框的默认值
  // handleFocus(e){
  //   const { level } = this.data;
  //   const { index } = e.currentTarget.dataset;
  //   level.forEach((v, i) => {
  //     if (i == index) v.value = ''
  //   })
  //   this.setData({
  //     level
  //   });
  // },

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
    this.getList();
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
      this.getList()
    }
  },

  
})