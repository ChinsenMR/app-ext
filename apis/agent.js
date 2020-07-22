import $request from "../utils/tools/request";
export default {
    /**
     * 绑定代理 
     * **/
    bindAgent(data) {
        return $request({
            url: '/API/VshopProcess.ashx?action=BindAgent',
            data,
            hideToast: true,
        }).then(res => res)
    },
    /* 绑定上下级关系 */
    bindReferralUserId(data) {
        return $request({
            url: '/API/Request/BindReferralUserId',
            data,
            method: "POST",
            hideToast: true
        }).then((res) => res)
    },
    /* 获取代理配置 */
    getApplectWebSet(data) {
        return $request({
            url: '/api/publicHandler.ashx?action=GetApplectWebSet',
            data,
            hideToast: true,
        }).then((res) => res)
    },
    /** 
     * 更改代理品牌列表
     */
    updateAgentInfo(data) {
        return $request({
            url: '/API/MembersHandler.ashx?action=UpdateAgentInfo',
            data
        }).then((res) => res)
    },
}