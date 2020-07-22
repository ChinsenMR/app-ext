const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: Boolean,
    wechat: {
      type: Object,
      value: {
        id: '',
        qrcode: ''
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    codeBackgroundUrl: "https://img.hmeshop.cn/hmeshopV3/Storage/master/202005151422536891880.png",

    closeBtnUrl: "https://img.hmeshop.cn/hmeshopV3/Storage/master/202005151501135330470.png",
  },
  /**
   * 组件的生命周期
   */
  lifetimes: {
    attached() {

    },
    detached() {

    },
  },

  ready() {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 设置系统剪贴板的内容
    _setClipboard: function (e) {
      wx.setClipboardData({
        data: e.currentTarget.dataset.code,
        success(res) {
          wx.getClipboardData({
            success(res) {
              // console.log(res.data)  // code 数据
              wx.showToast({
                title: "复制成功"
              });
            },
          });
        },
      });
    },
    close() {
      this.triggerEvent('close')
    }
  }
})