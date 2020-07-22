// 订单状态
export const ORDER_STATUS_UNPAID = 1;               // 待付款
export const ORDER_STATUS_UNSHIPPED = 2;            // 待发货
export const ORDER_STATUS_SHIPPED = 3;              // 已发货
export const ORDER_STATUS_CLOSED = 4;               // 已关闭
export const ORDER_STATUS_FINISHED = 5;             // 已完成
export const ORDER_STATUS_WAITREVIEW = 21;          // 待评价
export const ORDER_STATUS_REFUND = 6;               // 退款中
export const ORDER_STATUS_REFUNDED = 9;             // 退款完成
export const ORDER_STATUS_REJECTED = 18;            // 拒绝退款
export const ORDER_STATUS_HISTORY = 99;             // 历史订单
export const ORDER_STATUS = {
  [ORDER_STATUS_UNPAID]: '待付款',
  [ORDER_STATUS_UNSHIPPED]: '待发货',
  [ORDER_STATUS_SHIPPED]: '已发货',
  [ORDER_STATUS_CLOSED]: '已关闭',
  [ORDER_STATUS_FINISHED]: '已完成',
  [ORDER_STATUS_WAITREVIEW]: '待评价',
  [ORDER_STATUS_REFUND]: '退款中',
  [ORDER_STATUS_REFUNDED]: '退款完成',
  [ORDER_STATUS_REJECTED]: '拒绝退款',
  [ORDER_STATUS_HISTORY]: '历史订单',
};