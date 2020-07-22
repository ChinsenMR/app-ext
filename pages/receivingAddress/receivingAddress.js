import {
  getAddressList,
  setdefaultAddress,
  deletedAddress
} from "../../utils/requestApi.js"

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl:app.data.imgurl,
    delBtnWidth: 180,
    isEmpty: false,
    listData: [],
    list: [],
    startX: ""
  },
  initEleWidth() {
    var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
    // console.log(delBtnWidth)
    this.setData({
      delBtnWidth: delBtnWidth
    });
  },
  delItem: function(e) {
    //获取列表中要删除项的下标
    var index = e.currentTarget.dataset.index;
    console.log(index)
    var list = this.data.list;
    //移除列表中下标为index的项
    list.splice(index, 1);
    //更新列表的状态
    this.setData({
      list: list
    });
  },
  getEleWidth: function(w) {
    var real = 0;
    try {
      var res = wx.getSystemInfoSync().windowWidth; //以宽度750px设计稿做宽度的自适应
      var scale = (750 / 2) / (w / 2);
      real = Math.floor(res / scale);
      return real;
    } catch (e) {
      return false;
      // Do something when catch error
    }
  },
  touchS: function(e) {
    if (e.touches.length == 1) {
      // console.log(e.touches[0].clientX)
      this.setData({
        //设置触摸起始点水平方向位置
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function(e) {
    if (e.touches.length == 1) {
      //手指移动时水平方向位置
      // console.log(e.touches[0].clientX)
      var moveX = e.touches[0].clientX;
      //手指起始点位置与移动期间的差值
      var disX = this.data.startX - moveX;
      var delBtnWidth = this.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) { //如果移动距离小于等于0，说明向右滑动，文本层位置不变
        txtStyle = "transform: translateX(0)";
      } else if (disX > 0) { //移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "transform: translateX(-" + disX + "px)";
        if (disX >= delBtnWidth) {
          //控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "transform: translateX(-" + delBtnWidth + "px)";
        }
      }
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = this.data.list;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        list: list
      });
    }
  },
  touchE: function(e) {
    if (e.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "transform:translateX(-" + delBtnWidth + "px)" : "transform:translateX(0)";
      //获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = this.data.list;
      list[index].txtStyle = txtStyle;
      //更新列表的状态
      this.setData({
        list: list
      });
    }
  },
  goadd: function() {
    console.log('添加收货地址')
    wx.removeStorage({
      key: 'address',
      success(res) {
        console.log(res)
      }
    })

    wx.navigateTo({    
      url: '/pages/newAddress/newAddress',
    })
  },
  clickEdit: function(e) {
    console.log(e.currentTarget.dataset.index, '取下标取数据')
  },
  clickBianji(e) { //点击编辑
    console.log(e.currentTarget.dataset.index, '编辑')
    console.log(this.data.listData[e.currentTarget.dataset.index], '点击当前')
    wx.setStorage({
      key: "address",
      data: JSON.stringify(this.data.listData[e.currentTarget.dataset.index])
    })
    wx.navigateTo({
      url: '/pages/newAddress/newAddress?type=modify',
    })
  },
  clickdel(e) {
    wx.showLoading({
      title: '正在尝试删除地址',
    })
    // console.log(e.currentTarget.dataset.index,'删除')
    // this.data.listData[e.currentTarget.dataset.index].ShippingId
    console.log(this.data.listData[e.currentTarget.dataset.index].ShippingId, '删除的当前shpipiD')
    deletedAddress({
      shippingId: this.data.listData[e.currentTarget.dataset.index].ShippingId
    }).then(res => {
      console.log(res)
      var that = this
      if (res.data.Status == "Success") {
        wx.showToast({
          title: '删除地址成功',
          icon: 'none',
          mask: true,
          duration: 2000,
          success: function() {
            setTimeout(function() {
              that.getData()
            }, 2000)
          }
        })
      } else {
        wx.showToast({
          title: '删除地址失败',
          icon: 'none',
          mask: true,
          duration: 2000,
          success: function() {
            setTimeout(function() {
              that.getData()
            }, 2000)
          }
        })
      }
    })


  },
  clickSetDafaultCir(e) {
    console.log(this.data.listData[e.currentTarget.dataset.index], '设置默认取下标取值,做请求')
    wx.showLoading({
      title: '设置默认地址中',
    })
    console.log(this.data.listData[e.currentTarget.dataset.index].ShippingId, '设置的当前条数据')
    setdefaultAddress({
      shippingId: this.data.listData[e.currentTarget.dataset.index].ShippingId
    }).then(res => {
      wx.hideLoading()
      var that = this
      if (res.data.Status == "Success") {
        console.log('成功设置默认地址', res)
        // this.getData()//重新回去列表数据
        wx.showToast({
          title: '设置默认地址成功',
          icon: 'none',
          mask: true,
          duration: 2000,
          success: function() {
            setTimeout(function() {
              that.getData()
              wx.navigateBack({
                delta:1
              })  
            }, 2000)
          }
        })
      } else {
        wx.showToast({
          title: '设置默认地址失败',
          icon: 'none',
          mask: true,
          duration: 2000,
          success: function() {
            setTimeout(function() {
              that.getData()
            }, 2000)
          }
        })
      }

    })
  },
  getData() {
    wx.showLoading({
      title: '获取列表数据中',
    })
    getAddressList({}).then(res => {
      wx.hideLoading()
      console.log(res, '收货地址获取')
      if (res.data.Status == "Success") {
        if (res.data.Data != '[]') {
          this.setData({
            isEmpty: true,
            listData: res.data.Data
          })
        } else {
          this.setData({
            isEmpty: false,
          })
        }
      } else {
        wx.showToast({
          title: '获取收货地址失败',
          icon: 'none',
          mask: true,
          duration: 2000
        })
      }
    })
  },
  //获取元素自适应后的实际宽度
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.initEleWidth();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getData() //获取列表数据
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },


})