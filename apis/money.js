import $request from "../utils/tools/request"
export default {
  /**
   * 获取佣金提现初始化数据
   */
  getInitSplittinDraw(data){
    return $request({
      url:'/API/MembersHandler.ashx?action=InitSplittinDraw',
      data
    }).then(res=>res)
  },
  /**
   * 获取提现记录
   */
  getSplittinDrawRecords(data){
    return $request({
      url: '/API/MembersHandler.ashx?action=GetSplittinDrawRecords',
      data
    }).then(res=>res)
  },

   /**
    * 提交佣金提现信息
    */
   setSplittinDraws(data){
     return $request({
       url:'/API/MembersHandler.ashx?action=SplittinDraw',
       data
     }).then(res=>res)
   },

}