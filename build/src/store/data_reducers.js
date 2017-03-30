/**
 * Created by pansh on 2016-08-08.
 */
import * as actions from '../actions';
import { combineReducers } from 'redux';
import utils from '../common/utils';

/**
 * ajax相关 Reducer
 * @param state
 * @param action
 */
function ajaxReducer (state = {
  ajax_state: {}
}, action) {
  switch (action.type) {
    case actions.AJAX_BEFORE_SEND:
    case actions.AJAX_COMPLETE:
    case actions.AJAX_ERROR:
    case actions.AJAX_SUCCESS:
      return {
        ...state,
        ajax_state: {
          ...state.ajax_state,
          [action.handle_action]: action.type
        }
      };
    default:
      return state;
  }
}

/**
 * 打包组合 reducer
 */
const Reducers = combineReducers({
  ajax: ajaxReducer,
});

// export
export default Reducers;
