const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//节流 多用于页面scroll滚动，或者窗口resize这种会实时变化的函数，或者防止按钮重复点击（看项目需求，两种方式都可选择）等情况
function throttle(func, wait, mustRun) {
  var timeout,
    startTime = new Date(); // 设置初始时间
  return function () {
    var context = this,
      args = arguments, // 将当函数的参数赋值给args
      curTime = new Date(); // 设置函数执行当前时间
    clearTimeout(timeout);
    // 如果达到了规定的触发时间间隔mustRun，触发 handler
    if (curTime - startTime >= mustRun) {
      func.apply(context, args); // 将当前函数的参数传进fnc并绑定上下文环境
      startTime = curTime; // 记录本次时间，作为下一次的初始时间
      // 没达到触发间隔，重新设定定时器
      console.log('时间间隔内')
    } else {
      timeout = setTimeout(function () {
        // console.log('定时器内')
        func.apply(context, args)
      }, wait);
    }
  };
}

// 防抖 多用于 input 框 输入时，匹配的输入内容，加入购物车，防止发起请求的按钮多次请求接口等情况
function debounce(fn, interval) {
  var timer;
  var gapTime = interval || 1000; //间隔时间，如果interval不传，则默认1000ms
  return function () {
    clearTimeout(timer);
    var context = this;
    let args = arguments[0]; //保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
    timer = setTimeout(function () {
      fn.call(context, args);
    }, gapTime);
  };
}


//带天数的倒计时 time(单位秒)为倒计时开始的时间，单位小时
function countDown(time, callback) {
  let timer = null
  let date = new Date()
  let times = (time - date.getHours()) * 60 * 60 + (60 - date.getMinutes()) * 60 + (60 - date.getSeconds())
  let day = 0
  let hour = 0
  let minute = 0
  let second = 0
  timer = setInterval(() => {
    if (times > 0) {
      day = Math.floor(times / (60 * 60 * 24));
      hour = Math.floor(times / (60 * 60)) - (day * 24);
      minute = Math.floor(times / 60) - (day * 24 * 60) - (hour * 60);
      second = Math.floor(times) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60);
    }
    if (day <= 9) day = '0' + day;
    if (hour <= 9) hour = '0' + hour;
    if (minute <= 9) minute = '0' + minute;
    if (second <= 9) second = '0' + second;
    // console.log(hour + "小时：" + minute + "分钟：" + second + "秒");
    times--;
    callback({
      hour,
      minute,
      second
    })
    if (times <= 0) {
      console.log('计时停止')
      clearInterval(timer);
    }
  }, 1000);
}

module.exports = {
  countDown,
  throttle,
  formatTime,
  debounce
}