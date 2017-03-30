var base32 = require('hi-base32');
var Utils = {};
var Promise = require('es6-promise').Promise;

Utils.host = 'https://www.drugsea.cn';
Utils.protocol = 'https://';
Utils.version = '2.82.20'; //同时修改 main.js

Number.prototype.toHex = function () {
  var ret = ((this < 0 ? 0x8 : 0) + ((this >> 28) & 0x7)).toString(16) + (this & 0xfffffff).toString(16);
  while (ret.length < 8) ret = '0' + ret;
  return ret;
};
var hashCode = function (o, l) {
  l = l || 2;
  var i, c, r = [];
  for (i = 0; i < l; i++)
    r.push(i * 268803292);
  function stringify (o) {
    var i,r;
    if (o === null) return 'n';
    if (o === true) return 't';
    if (o === false) return 'f';
    if (o instanceof Date) return 'd:' + (0 + o);
    i = typeof o;
    if (i === 'string') return 's:' + o.replace(/([\\\\;])/g, '\\$1');
    if (i === 'number') return 'n:' + o;
    if (o instanceof Function) return 'm:' + o.toString().replace(/([\\\\;])/g, '\\$1');
    if (o instanceof Array) {
      o.sort();
      r = [];
      for (i = 0; i < o.length; i++)
        r.push(stringify(o[i]));
      return 'a:' + r.join(';');
    }
    r = [];
    var keys = Object.keys(o), i, k, len = keys.length;
    keys.sort();
    for (i = 0; i < len; i++) {
      k = keys[i];
      r.push(i + ':' + stringify(o[k]));
    }
    return 'o:' + r.join(';');
  }
  o = stringify(o);
  // console.log('O = ' + o)
  for (i = 0; i < o.length; i++) {
    for (c = 0; c < r.length; c++) {
      r[c] = (r[c] << 13) - (r[c] >> 19);
      r[c] += o.charCodeAt(i) << (r[c] % 24);
      r[c] = r[c] & r[c];
    }
  }
  for (i = 0; i < r.length; i++) {
    r[i] = r[i].toHex();
  }
  return r.join('');
};
Utils.hashCode = hashCode;

var wxShare = function (title, desc, link, imgUrl) {
  if (typeof (title) === 'undefined' || title === '') {
    title = 'hi 朋友，给你推荐一个好工具，医药行业数据便捷查询';
  }
  if (typeof (desc) === 'undefined' || desc === '') {
    desc = '我用信狐药迅找品种，查药品销售额、中标价、注册进度，一次搞定！';
  }
  if (typeof (imgUrl) === 'undefined' || imgUrl === '') {
    imgUrl = Utils.host + '/assets/images/inFocus_108_108.jpg';
  }

  if (typeof (link) === 'undefined' || link === '') {
    var hashUrl = window.location.hash.split('#')[1];
    hashUrl = hashUrl.replace(/\_k=.+$/, '');
    hashUrl = hashUrl + '&user=' + Utils.cookie.get('unionid');
    var goKey = Utils.encrypt(hashUrl);
    link = Utils.host + '/go.html?k=' + goKey;
  }


  var shareConfig = {
    title: title,
    desc: desc,
    link: link,
    imgUrl: imgUrl
  };
  window.wx.ready(() => {
    wx.onMenuShareAppMessage(shareConfig);
    wx.onMenuShareTimeline(shareConfig);
    wx.onMenuShareQQ(shareConfig);
    wx.onMenuShareWeibo(shareConfig);
    wx.onMenuShareQZone(shareConfig);
  });
};
Utils.wxShare = wxShare;

var makeFormParams = function (params) {
  var data = '';
  for (var attr in params) {
    if (isEmpty(params[attr]) === false) {
      data += attr + '=' + encodeURIComponent(params[attr]) + '&';
    }
  }
  if (data !== '') {
    data = data.substring(0, data.length - 1);
  }
  return data;
};
Utils.makeFormParams = makeFormParams;

var encrypt = function (text) {
  var eyt = base32.encode(text, true);
  return eyt.replace(/[=]*$/, '');
};
Utils.encrypt = encrypt;

var decrypt = function (text) {
  return base32.decode(text, true);
};
Utils.decrypt = decrypt;

var paramFingerPrint = function (params) {
  var par = {};
  var excludedParams = ['pg', 'offset', 'activeID', 'order_by', 'unionid', 'tnum', 'tag', 'scrollTop'];
  for (var attr in params) {
    if (params.hasOwnProperty(attr)) {
      var a = excludedParams.indexOf(attr);
      if (a === -1) {
        if (isEmpty(params[attr]) === false) {
          par[attr] = params[attr];
        }
      }
    }
  }
  var str = hashCode(par, 4);
  // console.log(str)
  return str;
};
Utils.paramFingerPrint = paramFingerPrint;

var getBackUrl = function (name) {
  var backUrl = localStorage[name];
  var res = 'javascript:history.go(-1);';
  try {
    if (typeof (backUrl) !== 'undefined') {
      res = backUrl;
    }
  } catch(err) {
    console.log(backUrl);
    console.log(err.message);
  }
  return res;
};
Utils.getBackUrl = getBackUrl;

var saveBackUrl = function (name, url) {
  if (typeof (url) === 'undefined') {
    url = '';
  }
  localStorage[name] = url;
};
Utils.saveBackUrl = saveBackUrl;

var isArray = function (object) {
  return object && typeof object === 'object' &&
    typeof object.length === 'number' &&
    typeof object.splice === 'function' &&
    !(object.propertyIsEnumerable('length'));
};
Utils.isArray = isArray;

var inArray = function (search, array) {
  if (array.length > 0) {
    for (var i in array) {
      if (array[i] === search) {
        return true;
      }
    }
  }
  return false;
};
Utils.inArray = inArray;

var numberWithCommas = function (x) {
  if (typeof (x) === 'undefined' || x === null) {
    x = 0;
  }
  // console.log('numberWithCommas: x=' + JSON.stringify(x))
  var parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  var s = parts.join('.');
  return s;
};
Utils.numberWithCommas = numberWithCommas;

var setCookie = function (name, value, exdays) {
  var Days = exdays ? exdays : 30;
  var exp = new Date();
  exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
  document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString() + ';path=/;domain=drugsea.cn';
};

var getCookie = function (name) {
  var arr,reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
  if (arr = document.cookie.match(reg)) {
    return unescape(arr[2]);
  }
  return '';
};
Utils.cookie = { set: setCookie, get: getCookie };

var checkAuth = function () {
  var unionid = getCookie('unionid');
  var uidSign = getCookie('uidSign2');

  if (unionid !== '' && uidSign !== '') {
    return true;
  }else {
    return false;
  }
};
Utils.checkAuth = checkAuth;

var deleteAllCookies = function () {
  var cookies = document.cookie.split(';');

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf('=');
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=drugsea.cn';
  }
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf('=');
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;';
  }
};
Utils.deleteAllCookies = deleteAllCookies;

var getAgentName = function (code) {
  var agents = {};
  agents['UQDKMVBW'] = 'tongxieyi';
  agents['IUSHDEIQ'] = 'ouryao';
  agents['KHODWCFO'] = 'yaoshai';
  agents['RCSXCWOB'] = 'mrclub';
  agents['CEKXXVWC'] = 'venlon';
  agents['BWBGTQBJ'] = 'jsyylm';
  agents['UIUWYJKW'] = 'biopharm';
  agents['QZCKTKOZ'] = 'scyxzspt';
  agents['EBKTYWGK'] = 'yaowujianxun';
  agents['EDNTDVMH'] = 'yang';
  agents['UFTWMHNW'] = 'spu';
  agents['TLYRDENZ'] = 'SBL';
  agents['HSIKMBFW'] = 'yzzh';
  agents['VCUYNZSA'] = 'inFocus';
  agents['JIFFOKTZ'] = 'yydr';
  agents['FCSPNUCW'] = '';
  agents['LIGQNNLY'] = '';
  var agent = '';
  if (code !== '' && agents[code] !== '') {
    agent = agents[code];
  }
  if (agent === '') {
    // 当没有agent cookie时，根据用户名名字判断
    var info = getCookie('userInfo');
    if (info !== '') {
      var userInfo = JSON.parse(info);
      var username = userInfo.username;
      agent = username.replace(/_\d+$/, '');
    }
  }
  return agent;
};
Utils.getAgentName = getAgentName;

var consoleLog = function (msg) {
  var host = window.location.hostname;
  if (host === '127.0.0.1') {
    console.log(msg);
  }
};
Utils.consoleLog = consoleLog;

var clone = function (obj) {
  if (null === obj || 'object' != typeof obj) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
};
Utils.clone = clone;

var hasOwnProperty = Object.prototype.hasOwnProperty;

var isEmpty = function (obj) {

  // null and undefined are "empty"
  if (obj == null) return true;

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length > 0)    return false;
  if (obj.length === 0)  return true;

  // Otherwise, does it have any properties of its own?
  // Note that this doesn't handle
  // toString and valueOf enumeration bugs in IE < 9
  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) return false;
  }

  if (typeof (obj) === 'number') return false;

  if (typeof (obj) === 'string' && obj !== '') return false;

  return true;
};
Utils.isEmpty = isEmpty;

var mergeObj = function (obj, data) {
  var result = {};
  for (var i in obj) {
    if (typeof (obj[i]) != 'undefined') result[i] = obj[i];
  }
  for (var i in data) {
    if (typeof (data[i]) != 'undefined') result[i] = data[i];
  }
  return result;
};
Utils.mergeObj = mergeObj;

var getStoreParams = function (name) {
  var params = localStorage[name];
  var res = {};
  try {
    if (typeof (params) !== 'undefined') {
      res = JSON.parse(params);
    }
  } catch(err) {
    console.log(params);
    console.log(err.message);
  }
  return res;
};
Utils.getStoreParams = getStoreParams;

// Hash URL
var getUrlParams = function (type) {
  var hashStr = [];
  var queryStr = [];
  var queryStr2 = [];
  hashStr = window.location.hash.substring(1).split('?');
  if (hashStr.length > 1) {
    queryStr = hashStr[1].split('&'); // 解析地名信息,转码
  }

  queryStr2 = window.location.search.substring(1).split('&'); // 解析地名信息,转码
  queryStr = queryStr.concat(queryStr2);

  console.log(JSON.stringify(queryStr));
  var config = {};
  for (var i in queryStr) {
    if (queryStr[i] !== '') {
      var tmp = queryStr[i].split('=');
      var key = tmp[0];
      if (key === 'province') {
        var v = decodeURIComponent(tmp[1]);
        config[key] = v.split(',');
      }else if (key !== '_k' && key !== 't') {
        config[key] = decodeURIComponent(tmp[1]);
      }
    }
  }
  return config;
};
Utils.getUrlParams = getUrlParams;

var setUrlParams = function (tag) {
  var str = '';
  for (var i in tag) {
    if (i !== '' && tag[i] !== '' && i !== 'new') {
      str += '&' + i + '=' + tag[i];
    }
  }
  return str.substring(1, str.length);
};
Utils.setUrlParams = setUrlParams;

// 可以跨域的fetch
var fetch = function (obj) {
  var func = function (obj, resolve, reject) {
    var str = '';

    if (typeof (obj.data) !== 'undefined') {
      var tmp = obj.data;
      for (var i in tmp) {
        var d = tmp[i];
        if (isArray(d)) {
          for (var k in d) {
            str += i + '[]=' + encodeURIComponent(d[k]) + '&';
          }
        }else {
          str += i + '=' + encodeURIComponent(d) + '&';
        }
      }
    }

    $.ajax({
      url: obj.url,
      type: 'GET',
      data: str,
      dataType: 'jsonp',
      success: function (msg) {
        resolve(msg);
      },
      error: function (xhr, msg) {
        reject(new Error(msg));
      }
    });
  };
  var promise = new Promise(function (resolve, reject) {
    if (typeof (obj) == 'undefined' || typeof (obj.url) == 'undefined') {
      reject(new Error('fetch 函数参数缺失'));
    }
    func(obj, resolve, reject);
  });
  return promise;
};

var remoteData = function (obj) {
  var func = function (obj, signature, timestamp, resolve, reject) {
    var str = 'signature=' + signature + '&timestamp=' + timestamp + '&';

    // 排除参数，不需要提交
    var excludedNames = ['loadmask', 'tag'];
    if (typeof (obj.data) !== 'undefined') {
      var tmp = obj.data;
      for (var i in tmp) {
        if (Utils.inArray(i, excludedNames) === false) {
          var d = tmp[i];
          if (isArray(d)) {
            for (var k in d) {
              str += i + '=' + d[k] + '&';
            }
          }else {
            str += i + '=' + d + '&';
          }
        }
      }
    }

    $.ajax({
      url: obj.url + '?',
      type: 'GET',
      data: str,
      dataType: 'jsonp',
      success: function (msg) {
        // if(msg.api_status != 'success') reject(new Error(msg.content))
        resolve(msg);
      },
      error: function (xhr, msg) {
        reject(new Error(msg));
      }
    });
  };
  var promise = new Promise(function (resolve, reject) {
    if (typeof (obj) == 'undefined' || typeof (obj.url) == 'undefined') {
      reject(new Error('remoteData 函数参数缺失'));
    }
    var local_time = new Date().getTime() / 1000 | 0;
    var signature = getCookie('signature');
    var timestamp = getCookie('timestamp');
    var cur_time = parseInt(getCookie('cur_time'));
    if (signature != '' && timestamp != '' && local_time - cur_time < 20) {
      func(obj, signature, timestamp, resolve, reject);
    }else {
      $.ajax({
        url: 'xd_update_signature.pl?w=' + window.screen.width.toString() + '&h=' + window.screen.height.toString(),
        dataType: 'jsonp',
        success: function (msg) {
          if (typeof (msg.signature) === 'undefined' || typeof (msg.timestamp) === 'undefined') {
            reject(new Error('signature 或 undefined 获取失败'));
          }
          var cur_time = new Date().getTime() / 1000 | 0;
          setCookie('signature', msg.signature); setCookie('timestamp', msg.timestamp); setCookie('cur_time', cur_time);
          func(obj, msg.signature, msg.timestamp, resolve, reject);
        }
      });
    }
  });
  return promise;
};

var remoteDataWithCache = function (obj) {
  var index = '';
  // 排除参数，不需要提交
  var excludedNames = [];
  if (obj.data.action === 'count') {
    excludedNames = ['loadmask', 'tag', 'pg', 'scrollTop', 'activeID', 'order_by', 'tnum'];
  }else {
    excludedNames = ['loadmask', 'tag', 'scrollTop', 'activeID', 'tnum'];
  }
  if (typeof (obj.data) !== 'undefined') {
    var tmp = obj.data;
    var keys = Object.keys(tmp), i, k, len = keys.length;
    keys.sort();

    for (i = 0; i < len; i++) {
      k = keys[i];
      if (Utils.inArray(k, excludedNames) === false) {
        if (isEmpty(tmp[k]) === false) {
          var d = tmp[k];
          if (isArray(d)) {
            d.sort();
            for (var k1 in d) {
              if (typeof (d[k1] !== 'undefined') && d[k1] !== '') {
                index += k + '=' + d[k1] + '&';
              }
            }
          }else {
            index += k + '=' + d + '&';
          }
        }
      }
    }
  }
  var hashIndex = hashCode(obj.url + '?' + index, 2);
  // consoleLog(index + '|' + hashIndex)

  // 检查 index 是否有时间不超过 30min 的缓存
  var oldData = {};
  var oldMsg = localStorage[hashIndex];
  try {
    if (typeof (oldMsg) !== 'undefined') {
      oldData = JSON.parse(oldMsg);
    }
  } catch(err) {
    console.error(err.message);
  }
  var getNew = 0;
  if (typeof (oldData) !== 'undefined' && typeof (oldData.msg) !== 'undefined') {
    var oldTime = oldData.time;
    var curTime = new Date().getTime() / 1000;
    if (curTime - oldTime > 180) { // 缓存30min
      getNew = 1;
    }
  }else {
    getNew = 1;
  }

  var func = function (obj, signature, timestamp, resolve, reject) {
    var str = 'signature=' + signature + '&timestamp=' + timestamp + '&';
    str += index;

    if (getNew === 1) {
      $.ajax({
        url: obj.url,
        type: 'GET',
        data: str,
        dataType: 'jsonp',
        success: function (msg) {
          // if(msg.api_status != 'success') reject(new Error(msg.content))
          var cacheData = {};
          curTime = new Date().getTime() / 1000;
          cacheData.msg = msg;
          cacheData.time = curTime;
          if (msg.api_status === 'success' && msg.content !== null) {
            localStorage[hashIndex] = JSON.stringify(cacheData);
          }
          resolve(msg);
        },
        error: function (xhr, msg) {
          reject(new Error(msg));
        }
      });
    }else {
      resolve(oldData.msg);
    }
  };
  var promise = new Promise(function (resolve, reject) {
    if (typeof (obj) === 'undefined' || typeof (obj.url) === 'undefined') {
      reject(new Error('remoteData 函数参数缺失'));
    }
    var localTime = new Date().getTime() / 1000 | 0;
    var signature = getCookie('signature');
    var timestamp = getCookie('timestamp');
    curTime = parseInt(getCookie('cur_time'), 10);
    if (signature !== '' && timestamp !== '' && localTime - curTime < 20) {
      func(obj, signature, timestamp, resolve, reject);
    }else {
      if (getNew === 1) {
        $.ajax({
          url: 'xd_update_signature.pl?w=' + window.screen.width.toString() + '&h=' + window.screen.height.toString(),
          dataType: 'jsonp',
          success: function (msg) {
            if (typeof (msg.signature) === 'undefined' || typeof (msg.timestamp) === 'undefined') {
              reject(new Error('signature 或 undefined 获取失败'));
            }
            curTime = new Date().getTime() / 1000 | 0;
            setCookie('signature', msg.signature);
            setCookie('timestamp', msg.timestamp);
            setCookie('cur_time', curTime);
            func(obj, msg.signature, msg.timestamp, resolve, reject);
          }
        });
      }else {
        func(obj, signature, timestamp, resolve, reject);
      }
    }
  });
  return promise;
};
Utils.request = {
  fetch: fetch,
  remoteData: remoteData,
  remoteDataWithCache: remoteDataWithCache
};

var login = function () {
  var unionid = getCookie('unionid');
  var id = '';
  if (unionid !== '') {
    $.ajax({
      url: '/user.php?type=checkUnionid&unionid=' + unionid,
      type: 'get',
      dataType: 'json',
      async: false,
      success: function (msg) {
        if (msg.msg === 'success') {
          setCookie('unionid', unionid, 100);
        } else {
          setCookie('unionid', unionid, -1);
        }
      }
    });
  } else {
    var hashUrl = window.location.hash;
    var params = getUrlParams();
    var agent = typeof (params.agent) !== 'undefined' ? params.agent : '';

    // 删除hashUrl 后面的 _k= 参数
    hashUrl = hashUrl.replace(/(_k=\w+$)/, '');

    var goKey = Utils.encrypt(hashUrl);
    var link = Utils.host + '/go.html?k=' + goKey;
    if (agent !== '') {
      link += '&agent=' + agent;
      setCookie('agent', getAgentName(agent), 100);
    }
    window.location.href = '/oauth2.pl?backurl=' + encodeURIComponent(link);
  }
};
Utils.login = login;

module.exports = Utils;
