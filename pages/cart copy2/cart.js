let app =  getApp();
Page({
  data:{
    imgUrl:app.data.imgurl,
    selectAllStatus:false,
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    
  },
  onShow:function(){
    // 生命周期函数--监听页面显示
    
  },
  onOpen(event) {
    const { position, name } = event.detail;
    switch (position) {
      case 'left':
        Notify({
          type: 'primary',
          message: `${name}${position}部分展示open事件被触发`,
        });
        break;
      case 'right':
        Notify({
          type: 'primary',
          message: `${name}${position}部分展示open事件被触发`,
        });
        break;
    }
  },


  onHide:function(){
    // 生命周期函数--监听页面隐藏
    
  },
  onUnload:function(){
    // 生命周期函数--监听页面卸载
    
  },
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作
    
  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数
    
  },
  onShareAppMessage: function() {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  }
})