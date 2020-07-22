
//初始化数据
const app = getApp()

function tabbarinit() {
  return [
    {
      "current": 0,
      "pagePath": "/pages/index/index",
      "iconPath": 'http://img.hmeshop.cn/hmeshop_jxy/images/icon_shouye@2x.png',
      "selectedIconPath": "http://img.hmeshop.cn/hmeshop_jxy/images/icon_shouye@2x (4).png",
      "text": "首页",
      "width": 47,
    },
    {
      "current": 0,
      "pagePath": "/packageA/pages/shopkeeperList/shopkeeperList",
      "iconPath": "http://hmqy.oss-cn-hangzhou.aliyuncs.com/hmeshop_jxy/images/icon_zhuanqian@2x.png",
      "selectedIconPath": "http://hmqy.oss-cn-hangzhou.aliyuncs.com/hmeshop_jxy/images/icon_zhuanqian_seleted@2x.png",
      "text": "掌柜",
      "width": 47,
      "BrandLevel":true
    },
    // {
    //   "current": 0,
    //   "pagePath": "/pages/manager/manager",
    //   "iconPath": "http://hmqy.oss-cn-hangzhou.aliyuncs.com/hmeshop_jxy/images/icon_zhuanqian@2x.png",
    //   "selectedIconPath": "http://hmqy.oss-cn-hangzhou.aliyuncs.com/hmeshop_jxy/images/icon_zhuanqian_seleted@2x.png",
    //   "text": "掌柜",
    //   "width": 47,
    //   "BrandLevel":true
    // },
    {
      "current": 0,
      "pagePath": "/pages/cart/cart",
      "iconPath": "http://img.hmeshop.cn/hmeshop_jxy/images/icon_gouwuche@2x.png",
      "selectedIconPath": "http://img.hmeshop.cn/hmeshop_jxy/images/icon_gouwuche@2x (1).png",
      "text": "购物车",
      "width": 59,
    },
    {
      "current": 0,
      "pagePath": "/pages/member/member",
      "iconPath": "http://img.hmeshop.cn/hmeshop_jxy/images/icon_wode@2x (1).png",
      "selectedIconPath": "http://img.hmeshop.cn/hmeshop_jxy/images/icon_wode@2x.png",
      "text": "我的",
      "width": 42,
    }
  ]

}
function tabbarinit2() {
  return [
    {
      "current": 0,
      "pagePath": "/pages/index/index",
      "iconPath": 'http://img.hmeshop.cn/hmeshop_jxy/images/icon_shouye@2x.png',
      "selectedIconPath": "http://img.hmeshop.cn/hmeshop_jxy/images/icon_shouye@2x (4).png",
      "text": "首页",
      "width": 47,
    },
    {
      "current": 0,
      "pagePath": "/pages/upgradeMember/upgradeMember",
      "iconPath": "http://img.hmeshop.cn/hmeshop_jxy/images/icon_shenghuiuan@2x.png",
      "selectedIconPath": "http://img.hmeshop.cn/hmeshop_jxy/images/icon_shenghuiuan@2x (1).png",
      // "text": "会员",
      "width": 100,
    },
    {
      "current": 0,
      "pagePath": "/pages/cart/cart",
      "iconPath": "http://img.hmeshop.cn/hmeshop_jxy/images/icon_gouwuche@2x.png",
      "selectedIconPath": "http://img.hmeshop.cn/hmeshop_jxy/images/icon_gouwuche@2x (1).png",
      "text": "购物车",
      "width": 59,
    },
    {
      "current": 0,
      "pagePath": "/pages/member/member",
      "iconPath": "http://img.hmeshop.cn/hmeshop_jxy/images/icon_wode@2x (1).png",
      "selectedIconPath": "http://img.hmeshop.cn/hmeshop_jxy/images/icon_wode@2x.png",
      "text": "我的",
      "width": 42,
    }
  ]

}
/**
 * tabbar主入口
 * @param  {String} bindName 
 * @param  {[type]} id       [表示第几个tabbar，以0开始]
 * @param  {[type]} target   [当前对象],
 * cartnumber 购物车数量
 */
function tabbarmain(bindName = "tabdata", id, target,cartNumber) {
  const {BrandLevel,StoreId} = wx.getStorageSync("userInfo");
  var that = target;
  var bindData = {cartNumber:cartNumber};
  // var otabbar = tabbarinit();
  var bindData = {cartNumber:cartNumber};
  if(StoreId != 0){
    var otabbar = tabbarinit2();
  }else{
    var otabbar = tabbarinit();
  }
  otabbar[id]['iconPath'] = otabbar[id]['selectedIconPath']//换当前的icon
  otabbar[id]['current'] = 1;
  bindData[bindName] = otabbar
  that.setData({ bindData });
}


module.exports = {
  tabbar: tabbarmain
}