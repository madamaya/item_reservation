'use strict';
import $ from 'jquery';
const global = Function('return this;')();
global.jQuery = $;
// import bootstrap from 'bootstrap';

// 引数：'2020-01-01 00:00:00'の形式
function nextTime(time) {
  const after15min = new Date(new Date(time).getTime() + 15 * 60 * 1000);
  return ('0000' + after15min.getFullYear()).slice(-4) + '-' + ('00' + (after15min.getMonth() + 1)).slice(-2) + '-' + ('00' + after15min.getDate()).slice(-2) + ' ' + ('00' + after15min.getHours()).slice(-2) + ':' + ('00' + after15min.getMinutes()).slice(-2) + ':00';
}

function reservateTableBox(itemId, displayStartTime, displayEndTime) {
  const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  $.ajax({
    url: '/items/reservate',
    type: 'post',
    headers: {
      'CSRF-Token': token
    },
    data: {
      itemId,
      displayStartTime,
      displayEndTime
    }
  }).done((data) => {
    console.log('===entryjs===');
    console.log(JSON.stringify(data));
    const reservations = data.reservations;
    console.log(JSON.stringify(reservations));
    const classList = ['table-info', 'table-danger', 'table-active'];
    let reservatedList = [];
    for (let i = 0; i < reservations.length; i++) {
      console.log(reservations[i].startTime + ',' + reservations[i].endTime);
      for (let j = reservations[i].startTime; j <= reservations[i].endTime; j = nextTime(j)) {
        console.log(j);
        reservatedList.push(j);
      }
    }
    let retList = [];
    const now = new Date();
    console.log('st=' + displayStartTime + ' ed=' + displayEndTime);
    for (let i = displayStartTime; i < displayEndTime; i = nextTime(i)) {
      console.log(':' + i);
      if (now >= i) { retList.push(2); }
      else if (reservatedList.indexOf(i) === -1) { retList.push(0); }
      else { retList.push(1); }
    }
    console.log(reservatedList);
    console.log(retList);
    $('.reserveTableBox').each((i, e) => {
      const box = $(e);
      // box.text(i);
      box.addClass(classList[retList[i]]);
    });
  });
}

$(window).on('load', () => {

  const path = location.pathname;
  const today = new Date();
  const displayStartTime = ('0000' + today.getFullYear()).slice(-4) + '-' + ('00' + (today.getMonth() + 1)).slice(-2) + '-' + ('00' + today.getDate()).slice(-2) + ' 00:00:00';
  const displayEndTime = ('0000' + today.getFullYear()).slice(-4) + '-' + ('00' + (today.getMonth() + 1)).slice(-2) + '-' + ('00' + (today.getDate() + 1)).slice(-2) + ' 00:00:00';

  const flag = path.match(/^\/items\/(.*-.*-.*-.*-.*)\/reservate$/);
  if (flag) {
    const itemId = flag[1];
    console.log('itemId=' + itemId);
    reservateTableBox(itemId, displayStartTime, displayEndTime);
  }
});

