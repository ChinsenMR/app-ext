import $request from "../utils/tools/request";
export default {
    // 获取收货地址列表
    getAddressList(data) {
        return $request({
            url: '/API/MembersHandler.ashx?action=GetUserShippingAddress',
            data
        }).then(res => res)
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
     *编辑个人信息
     */
    updateAgentInfo(data) {
        return $request({
            method: "POST",
            url: '/api/Member/UpdateAgentInfo',
            data
        }).then(res => res)
    },
    /** 
     *  用户签署协议
     */
    signAgreement(data) {
        return $request({
            url: '/API/PublicHandler.ashx?action=SignAgreement',
            data
        }).then((res) => res)
    },
    /** 
     *  获取特定协议内容
     */
    getAgreement(data) {
        return $request({
            url: '/API/PublicHandler.ashx?action=GetAgreementById',
            data
        }).then((res) => res)
    },
    /** 
     * 获取店铺资质信息
     */
    getAgentInfoByDistributorSystem(data) {
        return $request({
            url: '/api/Member/GetAgentInfoByDistributorSystem',
            data,
            method: 'POST'
        }).then((res) => res)
    },  


}