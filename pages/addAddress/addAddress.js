// pages/addAddress/addAddress.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSelect: false, // 显示省市区
    name: '',
    phoneNum: '',
    addressDetail: '',
    region: {
      province: {name:'请选择'},
      city: { name: '请选择' },
      area: { name: '请选择' },
    },
    isSelected: false,
    customItem: '请选择',
    editType: 0, // 0新增，1修改
    ShippingId: '' // 地址id
  },

  testlocal: function (e) {
    console.log(e)
    var _this = this
    // 地图选择
    wx.chooseLocation({
      success: function (res) {
        console.log(res, "location")
        console.log(res.name)
        _this.setData({
          addressDetail: res.name
        })
      },
      fail: function () {
        // wx.showToast({
        //   title: '获取地址失败',
        //   icon: 'none',
        //   duration: 2000
        // })
        // return
        wx.getSetting({
          success(res) {
            console.log(res)
            if (!res.authSetting['scope.userLocation']) {
              wx.authorize({
                scope: 'scope.userLocation',
                success() {
                  console.log('用户已经同意小程序获取位置信息')
                },
                fail() {
                  // 用户拒绝后回调
                  wx.showModal({
                    title: '提示',
                    content: '获取位置信息需要开启授权',
                    success(res) {
                      if (res.confirm) {
                        wx.openSetting({
                          success(res) { }
                        })
                      } else if (res.cancel) {
                        console.log('用户点击取消')
                      }
                    }
                  })
                }
              })
            }
          }
        })
      },
      complete: function () { }
    })
  },
  
  /**
   * 选择省市区函数
   * */ 
  bindRegionChange: function (event) {
    // console.log(event)
    this.setData({
      showSelect: true
    })
    // this.setData({ region: event.detail.value})
    // if (event.detail.value[0] === '请选择') {
    //   wx.showToast({
    //     title: '请选择省',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return
    // } else if (event.detail.value[1] === '请选择') {
    //   wx.showToast({
    //     title: '请选择市',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return
    // } else if (event.detail.value[2] === '请选择') {
    //   wx.showToast({
    //     title: '请选择区',
    //     icon: 'none',
    //     duration: 2000
    //   })
    //   return
    // }
   
  },

  onSelectRegion: function (data) {
    console.log('确定', data.detail)
   
    if (!data.detail.iscancel) {
      if (!data.detail.address || data.detail.address.province.name === "请选择" || data.detail.address.city.name === "请选择" || data.detail.address.area.name === "请选择" ) {
        wx.showModal({
          title: '提示',
          content: '请选择地址',
          showCancel: false
        })
        return
      }
      this.setData({ 
        showSelect: false,
        region: data.detail.address,
        isSelected: true 
      })
    } else {
      this.setData({
        showSelect: false
      })
    }
    
  },

  /**
   * 提交处理函数
   * */ 
  onSubmit: function (event) {
    // let rgxName = /^[\u4E00-\u9FA5A-Za-z]{2,8}$/
    let rgxPhone = /^((13[0-9])|(15[^4])|(166)|(17[0-8])|(18[0-9])|(19[8-9])|(147|145))\d{8}$/
    if (this.data.name === "") {
      wx.showToast({
        title: '请输入正确的名字',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!rgxPhone.test(this.data.phoneNum)) {
      wx.showToast({
        title: '请输入11位正确的手机号',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (this.data.region.province.name === "请选择" || this.data.region.city.name === "请选择" || this.data.region.area.name === "请选择") {
      wx.showToast({
        title: '请选地址',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!this.data.addressDetail) {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none',
        duration: 2000
      })
      return
    }
    console.log(this.data.editType)
    if (this.data.editType === 0) {
      this.addAddress()
    } else {
      this.changeAddress()
    }
    
  },

  /**
   * 修改地址 网络请求
   * */ 
  changeAddress: function() {
    wx.request({
      url: getApp().data.url + '/Api/VshopProcess.ashx?action=SetMyShippingAddress',
      data: {
        shipTo: this.data.name,
        phone: this.data.phoneNum,
        regionId: this.data.region.area.id ? this.data.region.area.id : this.data.region.city.id,
        address: this.data.addressDetail,
        shipId: this.data.ShippingId,
        sessionId: wx.getStorageSync('sessionId')
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: (data) => {
        if (data.data.Status === 'success') {
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.showToast({
            title: '修改地址失败',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },

  /**
   * 添加地址 网络请求
   * */ 
   addAddress: function() {
     wx.request({
       url: getApp().data.url + '/Api/VshopProcess.ashx?action=AddMyShippingAddress',
       data: {
         shipTo: this.data.name,
         phone: this.data.phoneNum,
         regionId: this.data.region.area.id ? this.data.region.area.id : this.data.region.city.id,
         address: this.data.addressDetail,
         sessionId: wx.getStorageSync('sessionId')
       },
       header: {
         'Content-Type': 'application/x-www-form-urlencoded'
       },
       method: 'POST',
       success: (data) => {
         if (data.data.Status === 'success') {
           wx.navigateBack({
             delta: 1
           })
         } else {
           wx.showToast({
             title: '新增地址失败',
             icon: 'none',
             duration: 2000
           })
         }
       },
       fail: (e) => {
          console.log(e)
          wx.showToast({
            title: '新增地址失败',
            icon: 'none',
            duration: 2000
          })
       }
     })
   },

  // 名字
  writeName(e) {
    this.data.name = e.detail.value.replace(/\s*/g, '')
  },

  writePhone(e) {
    this.data.phoneNum = e.detail.value
  },

  writeAddress(e) {
    this.data.addressDetail = e.detail.value
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.data.editType = parseInt(options.type)
    if (this.data.editType === 1) {
      wx.setNavigationBarTitle({
        title: '修改地址',
      })
    }
    if (options.address) {
      var address = JSON.parse(options.address)
      console.log(address)
      this.data.ShippingId = address.ShippingId
      this.setData({
        isSelected: true,
        name: address.ShipTo,
        phoneNum: address.CellPhone,
        addressDetail: address.Address,
        region: {
          province: {
            name: address.RegionName.split(" ")[0]
          },
          city: {
            name: address.RegionName.split(" ")[1],
            id: address.RegionId
          },
          area: {
            name: address.RegionName.split(" ")[2] ? address.RegionName.split(" ")[2]:'',
            id: address.RegionId
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  // onReady: function () {
  
  // },

  // /**
  //  * 生命周期函数--监听页面显示
  //  */
  // onShow: function () {
  
  // },

  // /**
  //  * 生命周期函数--监听页面隐藏
  //  */
  // onHide: function () {
  
  // },

  // /**
  //  * 生命周期函数--监听页面卸载
  //  */
  // onUnload: function () {
  
  // },

  // /**
  //  * 页面相关事件处理函数--监听用户下拉动作
  //  */
  // onPullDownRefresh: function () {
  
  // },

  // /**
  //  * 页面上拉触底事件的处理函数
  //  */
  // onReachBottom: function () {
  
  // },

  
})