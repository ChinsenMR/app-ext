// pages/newAddress/newAddress.js
import {
  parseArea,
  areaList,
  parse
} from "../../utils/addressparse.js"
import {
  getRegion,
  modifyAddress
} from "../../utils/requestApi.js"
import { debounce} from '../../utils/myutil'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: null, //修改订单地址
    switch1Checked: false, //是否设置为默认
    showSelect: false,
    showSubmintBtn: false,
    ismodify: false,
    copyPlate: '',
    ShippingId: '', //当前条的数据id
    intelligence: 0, //0表示未使用 , 1 表示正常 ,
    abnormal: 2, //智能匹配  0是异常  , 2是未使用
    customItem: '请选择',
    region: {
      province: {
        name: '请选择'
      },
      city: {
        name: '请选择'
      },
      area: {
        name: '请选择'
      },
    },
    fromdata: [{
        title: '收货人',
        val: '',
        pl: '请输入收货人',
        type: 'text'
      },
      {
        title: '手机号码',
        val: '',
        pl: '请填写手机号码',
        type: 'number'
      },
      {
        title: '省/市/区',
        val: '',
        pl: '请选择省/市/区',
        type: ''
      },
      {
        title: '详细地址',
        val: '',
        pl: '请输入详细地址',
        type: ''
      }
    ]
  },
  // weachinput: function(e) {

  //   var index = e.currentTarget.dataset.index,
  //   value = e.detail.value
  //   this.data.fromdata[index].val = value
  //   this.testingFrom()
  // },
  weachinput: debounce(function(e){
    var index = e.currentTarget.dataset.index,
      value = e.detail.value
    this.data.fromdata[index].val = value
    this.testingFrom()
  }),
  switch1Change() {
    this.data.switch1Checked = !this.data.switch1Checked
    console.log(this.data.switch1Checked, '这是当前木人的值')
  },
  usercopy() { //获取客户剪切板内容
    let that = this
    wx.getClipboardData({
      success(res) {
        that.setData({
          copyPlate: res.data
        })
        console.log(res.data)
      }
    })
  },
  clickshibie() {
    var that = this.data
    if (that.copyPlate) {
      console.log(this.data.copyPlate, '执行打印了')
      var obj = parse(this.data.copyPlate)
      console.log(obj) //当前对象/智能匹配返回对象 , 
      // console.log('用户名', that.fromdata[0].val, '手机号码', that.fromdata[1].val, '省', that.region.province.name, '省id', that.region.province.id, '市', that.region.city.name, '市id', that.region.city.id, '区', that.region.area.name, '区id', that.region.area.id, '详细地址', that.fromdata[3].val, '这是提交的所有内容')
      var sheng = obj.province,
        shi = obj.city,
        qu = obj.area
      // 省 市 区
      console.log(sheng, shi, qu, '你的省市区')
      if (sheng == "" || shi == "" || qu == "") {
        wx.showToast({
          title: '您的格式不支持智能匹配',
          icon: 'none',
          mask: true,
          duration: 2000
        })
        return
      }
      this.getAddress(sheng, shi, qu).then(res => {
        // console.log(res, '这是匹配成功的返回', that.abnormal, "是否异常", that.intelligence,'匹配是否使用')
        console.log(res, '这是匹配成功的返回')
        if (that.abnormal == 0) {
          wx.showModal({
            title: '友情提示',
            content: '这边可能需要手动填写',
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
          // 重置异常
          that.abnormal = 2
          console.log('这是异常')
        } else {
          that.fromdata[0].val = obj.name
          that.fromdata[1].val = obj.mobile
          that.region.province.name = res.shengName
          that.region.province.id = res.sheng
          that.region.city.name = res.shiName
          that.region.city.id = res.shi
          that.region.area.name = res.quName
          that.region.area.id = res.qu
          that.fromdata[3].val = obj.addr
          this.setData({
            region: that.region,
            fromdata: that.fromdata
          })
          this.testingFrom()
        }
      })
    }
  },
  getAddress(sheng, shi, qu) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    return new Promise((resovle, reject) => {
      wx.request({
        url: 'http://192.168.3.108:99/API/WeChatApplet.ashx',
        data: {
          action: 'GetRegionsOfProvinceCity'
        },
        success: function(res) {
          wx.hideLoading()
          // 黄世有,16720176613,广州市越秀区
          console.log(res, '这是获取到的地址数据')
          if (res.data.Status == "OK") {
            let addressObj = {
              sheng: '',
              shengName: '',
              shi: '',
              shiName: '',
              quName: '',
              qu: ''
            }
            console.log(res.data.province, '省市')
            var alldata = res.data.province
            alldata.filter(function(item, index) {
              if (item.name.indexOf(sheng) != -1) {
                addressObj.sheng = item.id
                addressObj.shengName = item.name

                console.log(item.id, '匹配省份是', item.name) //省份匹配成功
                item.city.filter(function(item2, index2) { //开始匹配市
                  if (item2.name.indexOf(shi) != -1) {
                    addressObj.shiName = item2.name
                    addressObj.shi = item2.id

                    console.log(item2.id, '匹配市是', item2.name) //匹配市成功
                    item2.area.filter(function(item3, index3) { //开始匹配区
                      if (item3.name.indexOf(qu) != -1) {
                        addressObj.qu = item3.id
                        addressObj.quName = item3.name
                        resovle(addressObj) //返回最终匹配结果
                        console.log(item3.id, '匹配区是', item3.name) //匹配区成功
                      }
                    })
                  }
                })
              }
            })
          } else {
            wx.showToast({
              title: '匹配失败',
              icon: 'none',
              mask: true,
              duration: 2000
            })
          }
        }
      })
    })
  },
  bindRegionChange(e) { //监听组件回调的方法
    console.log(e);
    this.testingFrom() //监听表单内容
    this.setData({
      showSelect: true
    })
  },
  onSelectRegion: function(data) { //监听客户的选择地区列表
    console.log('确定', data.detail)
    if (!data.detail.iscancel) {
      if (!data.detail.address || data.detail.address.province.name === "请选择" || data.detail.address.city.name === "请选择" || data.detail.address.area.name === "请选择") {
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
  clickSubmint() { //点击保存提交按钮
    let that = this;
    let { region, showSubmintBtn } = this.data;
    let str = region.province.name + region.city.name + region.area.name + that.data.fromdata[3].val;
    console.log('选择的地址',str);
    wx.showModal({
      title: '请确认地址是否正确',
      content: str,
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if (result.confirm) {
          if (showSubmintBtn) {
            that.checkismodify()
          } else {
            return
          }
        }
      },
      fail: () => {},
      complete: () => {}
    });
      
    // if (that.data.showSubmintBtn) {
    //   that.checkismodify()
    // } else {
    //   return
    // }
  },
  modifyData() {
    var that = this.data
    console.log('我是修改地址')
    modifyAddress({
      shippingId: that.ShippingId,
      address: that.fromdata[3].val,
      cellphone: that.fromdata[1].val,
      shipTo: that.fromdata[0].val,
      isDefault: that.switch1Checked,
      regionId: that.region.area.id ? that.region.area.id : that.region.city.id,
      BuildingNumber: '', //门牌号
      LatLng: '' //经纬度
    }).then(res => {
      console.log(res, '修改地址返回的的提示')
      if (res.data.Status == "Success") {
        console.log('成功修改')
        wx.showToast({
          title: '成功修改地址',
          icon: 'none',
          duration: 2000,
          success: function() {
            wx.navigateBack({
              delta: 1
            })
          }
        })

      }

    })

  },
  checkismodify() { //检测是否为修改数据
    console.log(this.data.ismodify, '检测检测')
    if (this.data.ismodify) {
      // console.log('修改地址')
      this.modifyData()
    } else {
      this.sendData()
      console.log('新增地址')
    }
  },
  sendData() { //添加数据的
    var that = this.data
    console.log('发送数据', that.data)
    // 订单修改地址
    if (this.data.orderId) {
      console.log("xxxxxxxxxxxxx")
      app.fg({
        url: '/API/OrdersHandler.ashx?action=UpdateOrderAddress',
        data: {
          OrderId: that.orderId,
          ShipTo: that.fromdata[0].val,
          Address: that.fromdata[3].val,
          CellPhone: that.fromdata[1].val,
          ShippingRegion: that.region.province.name +',' + that.region.city.name +',' + that.region.area.name
        }
      }).then(res => {
        console.log("修改修改修复过", res)
        if (res.data.Status == "Success") {
          wx.showToast({
            title: res.data.Message,
          })
          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)

        }
      })
    } else {
      getRegion({
        // method:"GET",
        address: that.fromdata[3].val,
        cellphone: that.fromdata[1].val,
        shipTo: that.fromdata[0].val,
        isDefault: that.switch1Checked,
        RegionId: that.region.area.id ? that.region.area.id : that.region.city.id,
        BuildingNumber: '', //门牌号
        LatLng: '' //经纬度
      }).then(res => {
        wx.showLoading({
          title: '保存地址中',
        })
        console.log(res)
        if (res.statusCode == 200) { //"Faile"res.data.Status
          console.log('保存收货地址结果:::', res);
          // wx.navigateBack({
          //   delta: 1
          // })
          if (res.data.Status == "Faile") {
            wx.showToast({
              title: '保存收货地址失败',
              icon: 'none',
              mask: true,
              duration: 2000
            })
            return
          } else if (res.data.Status == "Success") {
            wx.hideLoading()
            wx.navigateBack({
              delta: -1
            })
          }
        }
      })

    }
  },
  testingFrom() { ////检测表单内容全不全,亮起
    console.log('监听')
    let that = this.data
    console.log('用户名', that.fromdata[0].val,
     '手机号码', that.fromdata[1].val, 
     '省', that.region.province.name, 
     '省id', that.region.province.id, 
     '市', that.region.city.name, 
     '市id', that.region.city.id, 
     '区', that.region.area.name, 
     '区id', that.region.area.id, 
     '详细地址', that.fromdata[3].val, '这是提交的所有内容')
    if (that.fromdata[0].val && that.fromdata[1].val && that.region.province.name !== '请选择' && that.fromdata[3].val) {
      this.setData({
        showSubmintBtn: true
      })
    } else {
      this.setData({
        showSubmintBtn: false
      })
    }
  },
  userWhrite(e) {
    this.setData({
      copyPlate: e.detail.value
    })
    console.log(e.detail.value)
  },
  checkAddress: function() {
    return new Promise((resovle, reject) => {
      wx.getStorage({
        key: 'address',
        success: function(res) {
          resovle(JSON.parse(res.data))
        },
        fail: function(res) {
          var areYou = "fail"
          resovle(areYou)
        }
      })
    })
  },
  isAddress() {
    this.checkAddress().then(res => {
      if (res != "fail") {
        var that = this.data
        // var noWdata = JSON.parse(res.data)
        console.log("输出地址",res)
        // console.log('用户名', that.fromdata[0].val, '手机号码', that.fromdata[1].val, '省', that.region.province.name, '省id', that.region.province.id, '市', that.region.city.name, '市id', that.region.city.id, '区', that.region.area.name, '区id', that.region.area.id, '详细地址', that.fromdata[3].val, '这是提交的所有内容')
        // console.log('这是本地获取成功',res)
        var diquid = res.FullRegionPath.split(',')
        var duqiname = res.FullRegionName.split(' ')
        // region.area.name
        that.fromdata[0].val = res.ShipTo
        that.fromdata[1].val = res.CellPhone
        that.region.province.name = duqiname[0]
        that.region.province.id = diquid[0]
        that.region.city.name = duqiname[1]
        that.region.city.id = diquid[1] //
        that.region.area.name = duqiname[2]
        that.region.area.id = res.RegionId //区 id
        that.fromdata[3].val = res.Address //详细地址
        that.switch1Checked = res.IsDefault
        that.ShippingId = res.ShippingId
        
        this.setData({
          switch1Checked: that.switch1Checked,
          region: that.region,
          fromdata: that.fromdata
        })
        console.log(res.isdafault)
        this.testingFrom()

      } else {
        console.log('这是本地获取失败')
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    //  地址列表修改地址
    if (options.type == 'modify') {
      console.log('存在参数')
      this.setData({
        ismodify: true
      })
      wx.setNavigationBarTitle({
        title: "修改地址"
      })
    } else {
      // 获取订单信息
      app.fg({
        url: '/API/OrdersHandler.ashx?action=GetOrderDetail',
        data: {
          orderId: options.orderid
        }
      }).then(res => {
        console.log("==========获取订单信息", res)
        if (res.data.Status == "Success") {
          let ShippingRegion = res.data.Data.ShippingRegion.split(",")[0]
          // var str = res.data.Data.ShippingRegion.split(",")[2]
          // console.log("+++++++++++++",str)
          this.setData({
            showSubmintBtn: true,
            orderId: options.orderid,
            'fromdata[0].val': res.data.Data.ShipTo,
            'fromdata[1].val': res.data.Data.Cellphone,
            'fromdata[3].val': res.data.Data.Address,
            'region.province.name': res.data.Data.ShippingRegion.split(",")[0],
            'region.city.name': res.data.Data.ShippingRegion.split(",")[1],
            'region.area.name': res.data.Data.ShippingRegion.split(",")[2]
          })
        }
      })
    }
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
    this.isAddress()
    parseArea(areaList)
    console.log(areaList)
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