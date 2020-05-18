'use strict';
import $ from 'jquery';
const global = Function('return this;')();
global.jQuery = $;
// import bootstrap from 'bootstrap';

function make0Min(time) {
  const dayTime = time.split(' ');
  const day = dayTime[0];
  const hours = dayTime[1].split(':')[0];
  const minutes = dayTime[1].split(':')[1];
  const sec = dayTime[1].split(':')[2];
  return (day + ' ' + hours + ':00:00');
}

function parseTime(time) {
  return ('0000' + time.getFullYear()).slice(-4) + '-' + ('00' + (time.getMonth() + 1)).slice(-2) + '-' + ('00' + time.getDate()).slice(-2) + ' ' + ('00' + time.getHours()).slice(-2) + ':' + ('00' + time.getMinutes()).slice(-2) + ':00';
}

function parseUTCTime(time) {
  return ('0000' + time.getUTCFullYear()).slice(-4) + '-' + ('00' + (time.getUTCMonth() + 1)).slice(-2) + '-' + ('00' + time.getUTCDate()).slice(-2) + ' ' + ('00' + time.getUTCHours()).slice(-2) + ':' + ('00' + time.getUTCMinutes()).slice(-2) + ':00';
}

// 引数：'2020-01-01 00:00:00'の形式
function nextTime(time) {
  const after15min = new Date(new Date(time).getTime() + 15 * 60 * 1000);
  return parseTime(after15min);
}

function reservateTableBox(itemId, now, displayStartTime, displayEndTime) {
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
    // console.log('===entryjs===');
    // console.log(JSON.stringify(data));
    const reservations = data.reservations;
    // console.log(JSON.stringify(reservations));
    const classList = ['table-info', 'table-danger', 'table-active'];
    let reservatedList = [];
    for (let i = 0; i < reservations.length; i++) {
      // console.log(reservations[i].startTime + ',' + reservations[i].endTime);
      for (let j = reservations[i].startTime; j < reservations[i].endTime; j = nextTime(j)) {
        // console.log(j);
        reservatedList.push(j);
      }
    }
    let retList = [];
    // console.log('st=' + displayStartTime + ' ed=' + displayEndTime);
    for (let i = displayStartTime; i < displayEndTime; i = nextTime(i)) {
      // console.log(':' + i);
      if (now >= i) { retList.push(2); }
      else if (reservatedList.indexOf(i) === -1) { retList.push(0); }
      else { retList.push(1); }
    }
    const displayStartMonth = parseInt(displayStartTime.split(' ')[0].split('-')[1]);
    const displayStartDay = parseInt(displayStartTime.split(' ')[0].split('-')[2]);
    const displayEndMonth = parseInt(displayEndTime.split(' ')[0].split('-')[1]);
    const displayEndDay = parseInt(displayEndTime.split(' ')[0].split('-')[2]);
    const displayStartHours = parseInt(displayStartTime.split(' ')[1].split(':')[0]);
    for (let i = 0; i < 24; i++) {
      if (i === 0) {
        $(`#displayHeaderDay${i}`).text(displayStartMonth + '/' + displayStartDay);
      } else if (((i + displayStartHours) % 24) === 0) {
        $(`#displayHeaderDay${i}`).text(displayEndMonth + '/' + displayEndDay);
      } else {
        $(`#displayHeaderDay${i}`).empty();
      }
      $(`#displayHeaderHours${i}`).text(('00' + String((i + displayStartHours) % 24)).slice(-2) + ':00');

    }
    // console.log(reservatedList);
    // console.log(retList);
    $('.reserveTableBox').each((i, e) => {
      const box = $(e);
      // box.text(i);
      box.addClass(classList[retList[i]]);
    });
  });
}

$(window).on('load', () => {

  const path = location.pathname;
  const flag = path.match(/^\/items\/(.*-.*-.*-.*-.*)\/reservate$/);
  if (flag) {
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const now = parseTime(today);
    const displayStartTime = make0Min(parseTime(today));
    console.log(displayStartTime);
    const displayEndTime = make0Min(parseTime(tomorrow));

    const itemId = flag[1];
    // console.log('itemId=' + itemId);
    reservateTableBox(itemId, now, displayStartTime, displayEndTime);
    // console.log(displayStartTime.split(' ')[0]);
    $('#displayDay').val(displayStartTime.split(' ')[0]);
    $(`#displayTimeOption${displayStartTime.split(' ')[1].split(':')[0]}`).prop('selected', true);
  }
});


const displaySpecifiedTime = $('#displaySpecifiedTime');
displaySpecifiedTime.on('click', () => {
  const itemId = displaySpecifiedTime.data('item-id');
  const displayDate = $('#displayDate').val();
  const displayTime = $('#displayTime').val();
  if (itemId && displayDate && displayTime) {
    const now = parseTime(new Date());
    const st = new Date(displayDate.split('-')[0], parseInt(displayDate.split('-')[1] - 1), displayDate.split('-')[2], displayTime);
    const displayStartTime = make0Min(parseTime(st));
    const displayEndTime = make0Min(parseTime(new Date(st.getTime() + 24 * 60 * 60 * 1000)));

    // console.log(itemId);
    // console.log(displayDate);
    // console.log(displayTime);
    // console.log(displayStartTime);
    // console.log(displayEndTime);

    reservateTableBox(itemId, now, displayStartTime, displayEndTime);
    $('#displayDay').val(displayStartTime.split(' ')[0]);
    $(`#displayTimeOption${displayStartTime.split(' ')[1].split(':')[0]}`).prop('selected', true);
  }
})

