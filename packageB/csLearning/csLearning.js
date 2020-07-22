import connect from "./model"
import userStore from "../../stores/user"
const app = getApp();
Page(connect(app.$page({
  /**
   * 页面初始化数据
   */
  data:{
    arr:['修改了啥','你说呢','现在有点懵逼中','暂时还不会使用','没关系,多用几次就好了']
  },
  methods:{
    changeStr(e){
      const {
        currentTarget:{
          dataset:{
            str
          }
        }
      } = e;
      userStore.changeStr(str)
    },
  },
})))