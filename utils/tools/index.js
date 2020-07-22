import alert from "./alert";
import tools from "./tools";
import verify from "./verify";
import cache from "./cache";
import $api from "../../apis/index";
import $request from "./request";
import $page from './wxPage'

export default {
  init(app) {
    Object.assign(app, {
      alert,
      tools,
      cache,
      verify,
      $api,
      $page,
      $request
    });
  },
};