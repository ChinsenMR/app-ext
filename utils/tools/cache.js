export default {
    /* 拿 / 存 / 删 */
    get(key, success) {
        wx.getStorage({
            key,
            success: res => {
                success(res)
            }
        });
    },
    set(key, data, success) {
        wx.setStorage({
            key,
            data,
            success: res => {
                success(res)
            }
        });
    },
    remove(key, success) {
        wx.removeStorage({
            key,
            success: res => {
                success(res)
            }
        });
    },
    /* cookie操作 */
    loadCookie() {
        return wx.getStorageSync('cookie') || ''
    },
    loadUserInfo() {
        return wx.getStorageSync('userInfo') || ''
    },
    loadUserId(){
        return wx.getStorageSync('userid') || ''
    }
}