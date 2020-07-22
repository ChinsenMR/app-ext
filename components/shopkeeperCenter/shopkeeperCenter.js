// components/shopkeeperCenter/shopkeeperCenter.js
import { getUrlSearch} from '../../utils/util.js'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    agencyData: {
      type: Object
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    position: 0,         // 滚动位置
    
    isBindFinish: false  // 绑定推荐人是否达成
  },

  // 组件生命周期函数，在组件实例进入页面节点树时执行
  attached: function() {
    this.setData({
      isBindFinish: wx.getStorageSync('userId')?true:false
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 去完成按钮
     * */ 
    onFinish: function () {
      let query = wx.createSelectorQuery().in(this)
      if (this.data.position === 0) {
        query.select('#shop-products').boundingClientRect(res => {
          this.data.position = res.top
          wx.pageScrollTo({
            scrollTop: res.top,
            duration: 300
          })
        }).exec()
      } else {
        wx.pageScrollTo({
          scrollTop: this.data.position,
          duration: 300
        })
      }
    },

    /**
     * 扫码
     * */
    onScanCode: function() {
      if(this.data.isBindFinish){
        return
      }
      wx.scanCode({
        success: (res) => {
          this.bindReferralId(getUrlSearch(res.result).ReferralId)
        },
        fail: function(e) {
          console.log('扫码err',e)
        }
      })
    },
    /**
     * 绑定推荐人
     * */ 
    bindReferralId: function(id) {
      let _this = this
      wx.request({
        url: getApp().data.url +'/Api/VshopProcess.ashx?action=BindUserReferralUserId',
        data: {
          ReferralId: id,
          sessionId: wx.getStorageSync('sessionId')
        },
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log('绑定推荐人',res)
          if (res.data.Status === 'success') {
            wx.showToast({
              title: '推荐人绑定成功'
            })
            this.triggerEvent('refreshevent', { msg: 'refresh'})
            _this.GetDistributorCondition()
          }
        },
        fail: function(e) {

        }
      })
    }
  }
})
