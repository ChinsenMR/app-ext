// components/addrPicker.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    province: [{
      name: '请选择',
      id: 0
    }], // 省
    city: [{
      name: '请选择',
      id: 0
    }], // 市
    area: [{
      name: '请选择',
      id: 0
    }], // 区
    value: '' // 选中地址
  },
  address: null, // 发送给父级的address
  /**
   * 组件的方法列表
   */
  methods: {
    oncancel: function(data) {
      // console.log('cancel')
      this.triggerEvent('addrevent', {
        iscancel: true
      })
    },
    onsure: function(data) {
      // console.log(data)
      // console.log('sure')
      this.triggerEvent('addrevent', {
        iscancel: false,
        address: this.address
      })
    },

    bindChange: function(data) {

      //console.log(data.detail.value)
      //console.log(this.data.city)
      let provinceIndex = data.detail.value[0] // 选中省份下标
      let cityIndex = data.detail.value[1] // 选中市下标
      let areaIndex = data.detail.value[2]
      let isCityArray = this.data.province[provinceIndex ? provinceIndex : 1].city instanceof Array //一旦滚动市都是true
      let isAreaArray = this.data.city[cityIndex ? cityIndex : 1].area instanceof Array //一旦滚动区都为true
      //console.log(provinceIndex)//滚动后结束的省下标
      //console.log(cityIndex)//滚动后结束的市下标
      //console.log(areaIndex)//滚动后结束的区下标
      //console.log(this.data.city[1].id)//滚动后的第一个市的id
      //console.log(this.data.province[provinceIndex ? provinceIndex : 1].city[0].id)

      if (this.data.city[1].id !== (isCityArray ? this.data.province[provinceIndex ? provinceIndex : 1].city[0].id : this.data.province[provinceIndex ? provinceIndex : 1].city.id)) {
        this.data.city = [{
          name: '请选择',
          id: 0
        }]
        // console.log(this.data.city)
        this.setData({
          city: this.data.city.concat(isCityArray ? this.data.province[provinceIndex ? provinceIndex : 1].city : [this.data.province[provinceIndex ? provinceIndex : 1].city])
        })
      }
      //console.log(this.data.city[cityIndex ? cityIndex : 1].area.length)//滚动后选定的市之后的区选择
      if (this.data.city[cityIndex ? cityIndex : 1].area.length !== 0) {
        if (this.data.area.length == 1 || this.data.area[1].id !== (isAreaArray ? this.data.city[cityIndex ? cityIndex : 1].area[0].id : this.data.city[cityIndex ? cityIndex : 1].area.id)) {
          this.data.area = [{
            name: '请选择',
            id: 0
          }]
          this.setData({
            area: this.data.area.concat(isAreaArray ? this.data.city[cityIndex ? cityIndex : 1].area : [this.data.city[cityIndex ? cityIndex : 1].area])
          })
        }
      } else {
        // if (this.data.city[cityIndex].name !== '请选择') {
        //   wx.showModal({
        //     title: '提示',
        //     content: '当前市份的区域暂无收录，请在详情地址中填写完整的地址！谢谢！',
        //     showCancel: false
        //   })
        // }
        this.setData({
          area: [{
            name: '',
            id: 0
          }],
        })
      }
      this.address = {
        province: {
          id: this.data.province[provinceIndex].id,
          name: this.data.province[provinceIndex].name
        },
        city: {
          id: this.data.city[cityIndex].id,
          name: this.data.city[cityIndex].name
        },
        area: {
          id: this.data.area[data.detail.value[2]].id,
          name: this.data.area[data.detail.value[2]].name
        }
      }
    }
  },

  attached: function() {
    let _this = this
    let localUrl = "http://192.168.3.108:99/API/WeChatApplet.ashx";
    wx.request({
      // url: 'http://192.168.3.108:99/API/WeChatApplet.ashx',
      url: getApp().data.url +'/API/WeChatApplet.ashx' || localUrl,
      data: {
        action: 'GetRegionsOfProvinceCity'
      },
      success: function(res) {
        // for (var val of res.data.root.region) {
        _this.data.province = _this.data.province.concat(res.data.province)
        //设置默认身份列表数组
        // }
        _this.data.city = _this.data.city.concat(_this.data.province[1].city)
        //设置默认的参数城市
        // _this.data.area = _this.data.area.concat(_this.data.city[1].area)
        // console.log(_this.data.province)
        _this.setData({
          province: _this.data.province,
          city: _this.data.city
          // area: _this.data.area
        })
        // console.log(_this.data.province, _this.data.city)
      },
      fail: function(e) {
        // console.log(e)
      }
    })
  }
})