// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyWord: '',
    showClosed: false,
    showMenu: -1,
    isEmpty: true, // 搜索数据是否为空
    isShowSearchBar: true, // 是否显示搜索和搜索记录
    proList: [],
    dataLength: 0,
    page: 1,
    sort: 'saleprice', // 筛选类型
    thePriceOrder: 'asc', // asc升序，desc降序
    theAddedTimeOrder: 'asc',
    theSaleCountOrder: 'asc',
    theVCountOrder: 'asc',
    theOrder: 'asc',
    goodsCard: false //false搜索，true商品名片
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.card) {
      wx.setNavigationBarTitle({
        title: '选择商品名片',
      })
      this.setData({
        goodsCard: options.card
      })
    }
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
    this.setData({
      proList:[]
    })
    this.getDataList('asc')
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
    if (this.data.dataLength === 10) {
      this.data.page++
      this.getDataList(this.data.theOrder)
    }
  },



  /**
   * 热搜
   * */
  onHotSearch: function (e) {
    console.log(e)
    if (e.target.dataset.kw) {
      this.setData({
        showClosed: true,
        keyWord: e.target.dataset.kw
      })
    }
  },

  /**
   * 清空输入框
   * */
  onClearInput: function (e) {
    this.setData({
      showClosed: false,
      keyWord: ''
    })
  },

  /** 
   * 输入事件处理函数，用于判断是否显示closed-icon及获取search关键字
   */
  onInput: function (e) {
    console.log(e)
    this.data.keyWord = e.detail.value.replace(/\s/g, "")
    if (e.detail.value != "") {
      this.setData({
        showClosed: true
      })
    } else {
      this.setData({
        showClosed: false
      })
    }
  },

  /**
   * input获取焦点事件处理函数
   * */
  onFocus: function (e) {
    this.setData({
      isShowSearchBar: true
    })
  },

  /**
   * 搜索按钮
   * */
  onSearch: function (e) {
    console.log(this.data.keyWord)
    this.data.proList = []
    this.data.page = 1
    if (this.data.keyWord) {
      this.setData({
        isShowSearchBar: false
      })
      wx.showLoading({
        title: '加载中...',
      })
      this.getDataList('asc')
    } else {
      wx.showToast({
        title: '请输入关键字',
        icon: 'none'
      })
    }
  },
  /**
   * 展开
   * */
  onPlus: function (e) {
    console.log(e)
    if (this.data.showMenu == e.target.dataset.num) {
      this.data.showMenu = -1
      this.setData({
        showMenu: -1
      })
    } else {
      this.data.showMenu = e.target.dataset.num
      this.setData({
        showMenu: e.target.dataset.num
      })
    }
  },

  /**
   * 修改升降序
   * */
  changeTheOrder: function (data) {
    switch (data) {
      case 'saleprice':
        this.data.thePriceOrder = this.data.thePriceOrder == 'asc' ? 'desc' : 'asc'
        return this.data.thePriceOrder
      case 'addedDate':
        this.data.theAddedTimeOrder = this.data.theAddedTimeOrder == 'asc' ? 'desc' : 'asc'
        return this.data.theAddedTimeOrder
      case 'showsaleCounts':
        this.data.theSaleCountOrder = this.data.theSaleCountOrder == 'asc' ? 'desc' : 'asc'
        return this.data.theSaleCountOrder
      case 'VistiCounts':
        this.data.theVCountOrder = this.data.theVCountOrder == 'asc' ? 'desc' : 'asc'
        return this.data.theVCountOrder
    }
  },

  /**
   * 选择筛选项
   * */
  onSelectSort: function (e) {
    if (this.data.sort == e.currentTarget.dataset.type) {
      this.data.theOrder = this.changeTheOrder(e.currentTarget.dataset.type)
    } else {
      this.data.page = 1
      this.data.sort = e.currentTarget.dataset.type
      this.data.thePriceOrder = 'asc'
      this.data.theAddedTimeOrder = 'asc'
      this.data.theSaleCountOrder = 'asc'
      this.data.theVCountOrder = 'asc'
      this.data.theOrder = 'asc'
    }

    this.data.proList = []
    this.setData({
      sort: this.data.sort,
      thePriceOrder: this.data.thePriceOrder,
      theAddedTimeOrder: this.data.theAddedTimeOrder,
      theSaleCountOrder: this.data.theSaleCountOrder,
      theVCountOrder: this.data.theVCountOrder
    })
    if (this.data.isEmpty) {
      return
    }
    this.getDataList(this.data.theOrder)
  },

  /**
   * 进入详情页
   * */
  onToDetailPage: function (e) {
    if (this.data.goodsCard) {
      wx.setStorage({
        key: 'CardId',
        data: JSON.stringify({
          ProductId: e.currentTarget.dataset.id,
          ProductName: e.currentTarget.dataset.name,
          ProductImg: e.currentTarget.dataset.img,
          ProductPrice: e.currentTarget.dataset.price,
          type: 'goodsCard'
        })
      })
      wx.showModal({
        title: '提示',
        content: '是否发送该商品名片',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateBack({
              delta: 1
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/productDetail/productDetail?id=' + e.currentTarget.dataset.id,
      })
    }
  },

  /**
   * 获取商品列表
   * */
  getDataList: function (data) {
    var _this = this
    wx.request({
      url: getApp().data.url + '/apI/VshopProcess.ashx/ProcessRequest',
      data: {
        action: 'GetSearch',
        categoryId: '',
        sort: this.data.sort,
        order: data,
        keyWord: this.data.keyWord,
        page: this.data.page,
        size: 10
      },
      success: function (res) {
        wx.hideLoading()
        console.log(res.data)
        if (res.data.Status === 'success') {
          _this.data.dataLength = res.data.data.length
          _this.data.proList = _this.data.proList.concat(res.data.data)
          _this.setData({
            proList: _this.data.proList,
            isEmpty: _this.data.proList.concat(res.data.data).length ? false : true
          })
        } else {
          console.log('数据出错')
          wx.showToast({
            title: res.data.errorMsg,
            icon: 'none'
          })
          _this.data.dataLength = 0
          _this.setData({
            isEmpty: _this.data.proList.length ? false : true
          })
        }
      },
      fail: function (e) {
        _this.setData({
          isEmpty: _this.data.proList.length ? false : true
        })
        wx.hideLoading()
      }
    })
  }
})