import * as actions from '../actions';
import { combineReducers } from 'redux';

function Dialog (state = { show_dialog: false, qrcode_show: false }, action) {
  switch (action.type) {
    case actions.OPEN_ALERT_DIALOG:
    // 打开 alert
      return { ...state, show_dialog: true, dialog_config: { ...action, type: 'alert' } };
    case actions.OPEN_CONFIRM_DIALOG:
    // 打开 confirm
      return { ...state, show_dialog: true, dialog_config: { ...action, type: 'confirm' }};
    case actions.CLOSE_DIALOG:
    // 关闭 dialog
      return { ...state, show_dialog: false };
    case actions.CONFIRM_BUTTON:
    // 用户点击按钮
      return { ...state, show_dialog: false, dialog_config: { ...action }};
    default:
      return state;
  }
}

/**
 * Loading 加载菊花
 * @param state
 * @param action
 * @returns {{show_loading: boolean}}
 * @constructor
 */
function Loading (state = { show_loading: false }, action) {
  switch (action.type) {
    case actions.OPEN_LOADING:
      // 打开 Loading
      return { ...state, show_loading: true };
    case actions.CLOSE_LOADING:
      // 关闭 Loading
      return { ...state, show_loading: false };
    default:
      return state;
  }
}

function App (state = { show_header_qrcode: false, page_title: '信狐药迅' }, action) {
  switch (action.type) {
    case actions.SHOW_HEADER_QRCODE:
      console.log('SHOW_HEADER_QRCODE');
      return { ...state, show_header_qrcode: true };
    case actions.HIDE_HEADER_QRCODE:
      console.log('HIDE_HEADER_QRCODE');
      return { ...state, show_header_qrcode: false };
    case actions.CHANGE_PAGE_TITLE:
      console.log('CHANGE_PAGE_TITLE');
      return { ...state, page_title: action.page_title };
    case actions.SHOW_SUB_DIALOG:
      return { ...state, show_sub_dialog: true };
    case actions.HIDE_SUB_DIALOG:
      return { ...state, show_sub_dialog: false };
    default:
      return state;
  }
}

/**
 * 打包组合 reducer
 */
const Reducers = combineReducers({Dialog, Loading, App});

// export
export default Reducers;
