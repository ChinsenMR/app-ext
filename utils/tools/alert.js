/**
 * Author: Chinsen
 * Desc: 工具库 
 * 使用方式：
 * app.alert.loading('哈哈哈')
 */
module.exports = {
  /* 弹出加载中框 */
  loading(title = '加载中...', mask = true) {
    wx.showLoading({
      title,
      mask,
    });
  },

  /* 关闭加载框 */
  closeLoading() {
    wx.hideLoading();
  },

  /* 消息提示 */
  message(content, title = '提示') {
    wx.showModal({
      title,
      content,
      showCancel: false,
    });
  },

  /* 弹出确认框 */
  confirm(args, callback) {
    const {
      title = '提示', content = '确认本次操作', color = '0081CC', showCancel
    } = args;
    wx.showModal({
      title,
      content,
      showCancel,
      confirmColor: color,
      cancelColor: color,
      success: (res) => {
        callback(res.confirm);
      },
    });
  },

  /* 普通提示框 */
  toast(title, icon = 'none') {
    wx.showToast({
      title,
      icon,
    });
  },

  /* 成功提示框 */
  success(title, duration = 2000) {
    wx.showToast({
      title,
      duration,
    });
  },

  /* 失败提示框 */
  error(title, duration = 2000, image = "/assets/images/close.png") {
    wx.showToast({
      title,
      image,
      duration
    });
  },
};