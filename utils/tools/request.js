/**
 * Author: Chinsen
 * Desc: request请求，逻辑相对复杂，
 * 调用：$request({...options}).then(res => {})
 * options：
 *     data: Object | 请求参数
 *     url: String | 后端接口路径,
 *     method: String | 请求方式
 *     hideLoading: Boolean | 请求是否需要loading
 *     header: Object | 传入自定义header
 *     loadingText: String | loading的文案
 *     hideToast: Boolean | 关闭请求后的弹窗
 *     closeDebugger: Boolean | 关闭debugger打印
 *     ignoreLogin: Boolean | 直接跳过权限校验
 */


const setting = {
  /* 是否需要拦截下一个请求 避免多次跳转到登录页面*/
  IS_NEED_INTERCEP: false,

  /* 请求超时限制 */
  TIME_OUT: 10 * 1000,

  /* 上一页面路由 */
  PREV_ROUTE: null,

  /* 历史页面 */
  HISTORY_PAGES: [],

  /* 返回错误状态，避免response为undefined */
  ERROR_CONTENT: {
    success: false,
    errorMsg: '未登录，请求已被拦截'
  },
};

/**
 * 主请求体，参数详见顶部说明
 * @param {data, url, method, hideLoading, header, hideToast, ignoreLogin} options
 */
const $request = async (options) => {
  const app = getApp();

  /* 查看请求权限，如果没有权限那么停止执行 */
  // 如果传入ignoreLogin那么直接跳过权限，默认为true
  const IS_HAVE_RIGHT = options.ignoreLogin || handleCheckAccess();


  /* 无请求权限直接拦截 */
  if (!IS_HAVE_RIGHT) {
    console.error('错误：！！！未登录，请求已被拦截', options.url)
    return setting.ERROR_CONTENT
  }

  /* request只拿数据 直接返回不做任何数据处理 */
  const request = () => {
    const {
      header,
      loadingText,
      data = {},
      url,
      method = 'GET',
      hideLoading,
      closeDebugger,
    } = options;

    const timeout = setting.TIME_OUT;

    const cookie = app.cache.loadCookie();

    /* 请求头部，如果默认根据请求类型设置相应头部 */
    const ajaxParams = {
      method,
      data,
      timeout,
      url: app.data.test ? app.data.test_domain + url : app.data.url + url,
      header: header || setHeader(method, cookie),
    };

    if (!hideLoading) {
      app.alert.loading(loadingText);
    }

    return new Promise((resolve, reject) => {
      wx.request({
        ...ajaxParams,
        success: (res) => {
          resolve(res.data);
        },
        fail: (err) => {
          const {
            errMsg
          } = err;

          const isTimeOut = errMsg.indexOf("timeout") != -1;

          app.alert.message(isTimeOut ? "请求超时，请检查网络状况" : errMsg);

          reject(err);
        },
        complete: (result) => {
          app.alert.closeLoading();

          /* 执行debugger，可在控制台查看请求前后状态 */
          if (!closeDebugger) {
            throwDebugger(ajaxParams, result);
          }

        },
      });
    });
  };

  /* 拿到请求结果 */
  const response = await request();

  /* 返回结果 */
  return handleAbnormal(response, options);
};

/**
 * 单独处理header
 * @returns header参数
 */
const setHeader = (method, cookie) => {
  const contentTypes = {
    POST: "application/x-www-form-urlencoded",
    GET: "application/json",
    PUT: "application/x-www-form-urlencoded",
    DELETE: "application/x-www-form-urlencoded",
    UPDATE: 'application/x-www-form-urlencoded'
  };

  method = method.toUpperCase()

  return {
    Cookie: cookie,
    "content-type": contentTypes[method],
  };
};

/* 验证是否有继续执行下一个方法的权限 */
const handleCheckAccess = () => {
  const cookie = wx.getStorageSync('cookie')
  const pages = getCurrentPages();
  const currentPageRoute = pages[pages.length - 1].route;

  let isHaveRequestAuth = true; /* 请求接口的权限 */

  /* 如果有cookie那么就是为true，无需往下验证 */
  if (cookie || !setting.IS_NEED_INTERCEP) return isHaveRequestAuth;

  /* 如果当前路由不等于上一页面路由 */
  if (setting.PREV_ROUTE !== currentPageRoute) {
    /* 重新开启跳转拦截 */
    setting.IS_NEED_INTERCEP = false;

    /* 如果拦截条件为true那么必然未登录，故没有权限 */
    if (setting.IS_NEED_INTERCEP) {
      isHaveRequestAuth = false
    }

    /*对应小程序5条page的限制 */
    if (setting.HISTORY_PAGES.length === 5) {
      setting.HISTORY_PAGES.splice(0, 1);
    } else {
      /* 如果历史page里面没有当前路由，那么将当前路由push进历史page */
      if (!setting.HISTORY_PAGES.includes(currentPageRoute)) {
        setting.HISTORY_PAGES.push(currentPageRoute);
      }
    }

    /* 逻辑处理完上一页面路由赋值为当前页面 */
    setting.PREV_ROUTE = currentPageRoute;
  } else {
    /* 如果历史page中有当前路由，那么确定为返回页，给予请求权限 */
    if (setting.HISTORY_PAGES.includes(currentPageRoute)) {
      isHaveRequestAuth = true
    }
    /* 路由相同，仍在当前页面，已请求过一个接口返回未登录，无权限 */
    isHaveRequestAuth = false;
  }

  return isHaveRequestAuth
};

/* 将后端的返回结果处理成前端固定格式 */
const handleResultFilter = (response) => {
  const {
    Status,
    Code,
  } = response;

  /* 后端可能会出现的错误字段 */
  const fields = ['Error', 'Message', 'msg', 'Msg', 'errMsg', 'ErrorMsg'];
  /* 目标错误字段 */
  const current = fields.filter(v => v === response[v])[0];
  /* 判断请求结果是否为true */
  const success = Status === "Success" || Code === 1;
  /* 判断字段是否有值 */
  const errorMsg = response[current];

  /* 判断response（后端返回值）是否为空，并且是否有错误提示 */
  return {
    success: response && !errorMsg ? true : success,
    errorMsg
  }
};

/**
 *  处理异常，并返回结果
 * @param {请求结果} response 
 * @param {请求参数} options 
 */
const handleAbnormal = (response, options) => {

  const app = getApp(),
    {
      errCode,
      Status,
      Code
    } = response,
    {
      hideToast
    } = options;

  /* 重构返回值 */
  const filterData = handleResultFilter(response)

  /* 针对新旧版本接口返回值异常处理 */
  const abnormals = [
    /* 接口无返回值 */
    {
      type: "NO_RESPONSE",
      status: !response,
      action: () => app.alert.message("服务器错误【NO_RESPONSE】")
    },

    /* 处理未登录 */
    {
      type: "NO_LOGIN",
      status: Code === -99 || ["Login", "login"].includes(Status),
      action: () => {
        /* 未开启跳转拦截，未登录，那么允许前往登录 */
        if (!setting.IS_NEED_INTERCEP) {
          return app.goPage({
            url: app.data.loginUrl
          }, () => {
            /* 已经跳转去登录了，无需重复跳转 开启拦截，阻止重复跳转到授权页面 */
            setting.IS_NEED_INTERCEP = true;
          })
        }
      },
    },

    /* 处理普通错误结果 */
    {
      type: "ERROR_WARNNING",
      status: Boolean(!hideToast && (filterData.errorMsg && errCode !== 1)),
      action: () => app.alert.message(filterData.errorMsg)
    }
  ];

  /* 循环处理异常，如果异常的数组中某个type的status值为true并且过滤后的数据被处理方法认定为false那么才执行action */
  abnormals.forEach((v) => (v.status && !filterData.success) && v.action());

  /* 正常返回数据，登录跳转拦截关闭 */
  setting.IS_NEED_INTERCEP = false;

  /* 无异常，返回数据,filterData 为过滤了后的结果，可放心使用 */
  return Object.assign(response, filterData)
};

/**
 * 提供请求参数打印，以便快速定位错误
 * @param {请求参数} params 
 * @param {请求结果} response 
 */
const throwDebugger = (options, response) => {
  const targetPage = getCurrentPages();
  const route = targetPage[targetPage.length - 1].route;

  console.log("<debugger>");

  console.info(
    ` 请求页面：${route}\n 请求地址：${options.url}\n 请求方式：${options.method} \n`,
    `请求头部：`,
    options.header,
    `\n`,
    `请求参数：`,
    options.data,
    `\n`,
    `返回状态：`,
    response.statusCode,
    `\n`,
    `返回数据：`,
    response.data
  );

  console.log("</debugger>");
};

export default $request