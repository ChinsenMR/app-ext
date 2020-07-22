import $request from "../utils/tools/request";
export default {
    /**
     * 获取首页自定义模板 
     * **/
    getCustomTemplate(data) {
        return $request({
            url: '/api/MiniPublic/GetShoptemplate',
            data,
            method: 'post',
            ignoreLogin: true
        }).then(res => res)
    },


}