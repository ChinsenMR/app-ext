import $request from "../utils/tools/request";

export default {
    /**
     * 获取购物车列表 
     * **/
    getCartList(data) {
        return $request({
            url: '/API/OrdersHandler.ashx?action=getShoppingCartList',
            data,
            ignoreLogin: true
        }).then(res => res)
    },


}