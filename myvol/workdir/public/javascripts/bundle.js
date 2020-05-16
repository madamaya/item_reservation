/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(2);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function deleteErr() {
  $('#nullErr').empty();
  $('#startErr').empty();
  $('#endErr').empty();
  $('#dupErr').empty();
}

$("#form").submit(function () {
  var err = false;
  var itemId = $('#itemId').val();
  var startDate = $('#startDate').val();
  var startTime = $('#startTime').val();
  var startMin = $('#startMin').val();
  var endDate = $('#endDate').val();
  var endTime = $('#endTime').val();
  var endMin = $('#endMin').val();
  var start = new Date(startDate + ' ' + startTime + ':' + startMin + ':00');
  var end = new Date(endDate + ' ' + endTime + ':' + endMin + ':00');
  var is_null = !startDate || !startTime || !startMin || !endDate || !endTime || !endMin;
  deleteErr(); // 空値あり

  if (is_null) {
    err = true;
    $('#nullErr').append('<p>全ての要素を入力してください</p>');
  } else {
    // 開始時間が現在時間より前
    if (start < new Date()) {
      err = true;
      $('#startErr').append('<p>開始時間は現在時刻より後を指定してください</p>');
    } // 終了日時が開始時間より前


    if (end <= start) {
      err = true;
      $('#endErr').append('<p>終了時間は開始時間より後を指定してください</p>');
    }
  }

  if (!err) {
    console.log('checking!!!');
    $.ajax({
      url: "/items/".concat(itemId, "/reservate/check"),
      type: 'post',
      data: {
        startDate: startDate,
        startTime: startTime,
        startMin: startMin,
        endDate: endDate,
        endTime: endTime,
        endMin: endMin
      },
      async: false
    }).done(function (data) {
      // 重複があるとき
      // alert(JSON.stringify(data));
      if (!data["return"]) {
        err = true;
        $('#dupErr').append('<p>指定した時間が他の予約と重複しています</p>');
      }
    });
  }

  if (err) {
    // alert('jquery:: err')
    return false;
  }
});

/***/ })
/******/ ]);