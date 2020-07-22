import $request from "../utils/tools/request";
export default {
  /** 
   *  获取会员信息
   */
  getPointExchangeInfo(data) {
    return $request({
      url: '/api/Point/GetPointExchangeInfo',
      data,
      method: 'POST'
    }).then((res) => res)
  },
  /** 
   * 获取积分商城列表
   */
  PointChangeAddCart(data) {
    return $request({
      method: 'POST',
      url: '/api/Point/PointChangeAddCart',
      data
    }).then((res) => res)
  },
  /** 
   * 获取积分商城列表
   */
  getPointDetail(data) {
    return $request({
      url: '/api/Point/GetPointDetails',
      data,
      method: 'POST'
    }).then((res) => res)
  },
  /** 
   * 获取积分购物车
   */
  getPointCart(data) {
    return $request({
      method: 'POST',
      url: '/api/Point/GetPointCart',
      data
    }).then((res) => res)
  },
  /** 
   * 积分商品详情
   */
  getPointGoodsDetail(data) {
    return $request({
      url: '/api/Point/GetPointChangeProductDetails',
      data
    }).then((res) => res)
  },

  /** 
   * 获取积分购物车数量
   */
  alterPointCartItemCount(data) {
    return $request({
      method: 'POST',
      url: '/api/Point/ChageGiftQuantity',
      data
    }).then((res) => res)
  },
  /** 
   * 删除购物车商品
   */
  deletePointCartItem(data) {
    return $request({
      method: 'POST',
      url: '/api/Point/DeleteCartGift',
      data
    }).then((res) => res)
  },
  /** 
   * 确认订单
   */
  confirmOrder(data) {
    return $request({
      method: 'POST',
      url: '/API/VshopProcess.ashx',
      data
    }).then((res) => res)
  },

  /** 
   * 积分商品详情
   */
  getPointOrderDetail(data) {
    return $request({
      method: 'POST',
      url: '/API/OrdersHandler.ashx?action=GetPointDetail',
      data
    }).then((res) => res)
  },

  /** 
   * 积分商品详情
   */
  getPointGoodsDetail(data) {
    return $request({
      url: '/api/Point/GetPointChangeProductDetails',
      data,
      method: 'POST',
    }).then((res) => res)
  },
}