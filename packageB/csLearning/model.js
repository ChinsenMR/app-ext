const app =  getApp();
const connect = app.mapToData(function (state,opt){
  return {
    newStr:state.user.str
  }
})

export default connect
  