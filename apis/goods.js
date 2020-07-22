import $request from "../utils/tools/request";
export default {
    /**
     * 获取二维码 
     * **/
    getProductQrcode(data) {
        return $request({
            url: '/API/QrcodeHandler.ashx?action=GetProductQrcode',
            data,
            loadingText: '二维码生成中...',
        }).then(res => res)
    },

    /**
     * 获得商品详情根据商品id
     * **/
    getGoodsDetail(data) {
        return $request({
            url: '/AppShop/AppShopHandler.ashx?action=getProductDetail',
            data,
        }).then(res => res)
    },
    /* 获取购买的用户 */
    getBuyUserData(data) {
        return $request({
            url: '/api/VshopProcess.ashx?action=GetCustomOrderData',
            data,
        }).then(res => res)
    },
    /*收藏商品 */
    collect(data) {
        return $request({
            url: '/API/MembersHandler.ashx?action=AddFavorite',
            data,
        }).then(res => res)
    },

        
    
}