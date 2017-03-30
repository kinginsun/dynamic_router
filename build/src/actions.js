/**
 * Created by pansh on 2016-08-08.
 */
/*
 * action 类型
 */
import $ from 'jquery';

/**
 * AJAX 相关 action
 */
export const AJAX_BEFORE_SEND = 'AJAX_BEFORE_SEND';
export const AJAX_SUCCESS = 'AJAX_SUCCESS';
export const AJAX_ERROR = 'AJAX_ERROR';
export const AJAX_COMPLETE = 'AJAX_COMPLETE';

/**
 * 发起ajax 请求
 * @param action
 * @param url
 * @param dispatch
 * @param params
 * @param method
 * @param callback
 */
export function ajax (action, url, dispatch, params = {}, method = 'get', callback = null) {
  $.ajax(url, {
    type: method,
    data: params,
    dataType: 'jsonp',
    beforeSend: () => {
      // 触发 AJAX_BEFORE_SEND
      dispatch({
        type: AJAX_BEFORE_SEND,
        url: url,
        params: params,
        method: method,
        handle_action: action
      });
    },
    complete: () => {
      // 触发 AJAX_COMPLETE
      dispatch({
        type: AJAX_COMPLETE,
        url: url,
        params: params,
        method: method,
        handle_action: action
      });
    },
    error: (err, msg) => {
      // 触发 AJAX_ERROR
      dispatch({
        type: AJAX_ERROR,
        url: url,
        params: params,
        method: method,
        error: err,
        message: msg,
        handle_action: action
      });

      // 触发 自定义action
      dispatch({
        type: action,
        error: err,
        message: msg
      });

      // action 回调 仅用于通知 dispatch 执行是否成功，不包含响应内容
      if (callback) {
        callback(false, msg);
      }
    },
    success: (resp) => {
      if (resp.api_status !== 'success') {
        // 执行错误
        // 触发 AJAX_ERROR
        dispatch({
          type: AJAX_ERROR,
          url: url,
          params: params,
          method: method,
          resp: resp,
          error: 1,
          message: resp.content,
          handle_action: action
        });

        // 触发 自定义action
        dispatch({
          type: action,
          url: url,
          params: params,
          resp: resp,
          error: 1,
          message: resp.content
        });

        // action 回调 仅用于通知 dispatch 执行是否成功，不包含响应内容
        if (callback) {
          callback(false, resp);
        }
      } else {
        // 触发 AJAX_SUCCESS
        dispatch({
          type: AJAX_SUCCESS,
          url: url,
          params: params,
          method: method,
          data: resp,
          handle_action: action
        });

        // 触发 自定义action
        dispatch({
          type: action,
          url: url,
          params: params,
          error: 0,
          data: resp
        });

        // action 回调 仅用于通知 dispatch 执行是否成功，不包含响应内容
        if (callback) {
          callback(true, resp); // 不建议直接使用 第二个参数，这违背了 flux 和 redux 的思想
        }
      }
    }
  });
}

