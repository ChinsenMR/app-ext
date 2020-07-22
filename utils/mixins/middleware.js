module.exports = {
    /* 阻止连续点击 */
    async beMask() {
        let timeout = setTimeout(() => {
            clearTimeout(timeout)
            return true
        }, 1000)
        const res = await timeout;
        return res
    },

    /* ************* 解决方案 **************************** */
    /* 提交在loading出来之前连续点了两次，用此方法解决 */

    /* 阻止连续点击 */
    disableConfirm(time = 300) {
        this.setData({
            confirmOrderIng: true
        })

        const timeout = setTimeout(() => {
            this.setData({
                confirmOrderIng: false
            }, () => {
                clearTimeout(timeout)
            })
        }, time)
    },

    /**
     * 解决问题，针对所有需要登陆的操作
     * 进入某页面 收藏 ——>未登录 ——> 登录 ——> 收藏 ——> 回到收藏页面
     * 
     * @param {方法名， 字符串} name 
     * @param {} options 
     */
    handleBeforeAction(name, options) {
        app.globalData.action = {
            name,
            options
        };
    },
    handleAfterAction() {
        const app = getApp();
        const pages = getCurrentPages();
        const targetPage = pages[pages.length - 2];

        const {
            globalData: {
                name,
                options
            }
        } = app;

        targetPage[name](options);
    },


}