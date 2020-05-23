'use strict';
import $ from 'jquery';
const global = Function('return this;')();
global.jQuery = $;

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
    const reservations = data.reservations;
    const classList = ['table-info', 'table-danger', 'table-active'];
    let reservatedList = [];
    for (let i = 0; i < reservations.length; i++) {
      for (let j = reservations[i].startTime; j < reservations[i].endTime; j = nextTime(j)) {
        reservatedList.push(j);
      }
    }
    let retList = [];
    for (let i = displayStartTime; i < displayEndTime; i = nextTime(i)) {
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
    $('.reserveTableBox').each((i, e) => {
      const box = $(e);
      box.removeClass("table-info table-danger table-active");
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
    const displayEndTime = make0Min(parseTime(tomorrow));
    const itemId = flag[1];

    reservateTableBox(itemId, now, displayStartTime, displayEndTime);

    $('#displayDate').val(displayStartTime.split(' ')[0]);
    $('#displayTime').val(parseInt(displayStartTime.split(' ')[1].split(':')[0]));
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

    reservateTableBox(itemId, now, displayStartTime, displayEndTime);

    displayBefore.data('d-day', displayStartTime.split(' ')[0]);
    displayBefore.data('d-time', displayStartTime.split(' ')[1].split(':')[0]);
    displayAfter.data('d-day', displayStartTime.split(' ')[0]);
    displayAfter.data('d-time', displayStartTime.split(' ')[1].split(':')[0]);
  }
});


const displayBefore = $('#displayBeforeDay');
displayBefore.on('click', () => {
  const itemId = displayBefore.data('item-id');
  const displayDate = displayBefore.data('d-day');
  const displayTime = displayBefore.data('d-time');
  if (itemId && displayDate && displayTime) {
    const now = parseTime(new Date());
    const st = new Date(new Date(displayDate.split('-')[0], parseInt(displayDate.split('-')[1] - 1), displayDate.split('-')[2], displayTime).getTime() - 24 * 60 * 60 * 1000);
    const displayStartTime = make0Min(parseTime(st));
    const displayEndTime = make0Min(parseTime(new Date(st.getTime() + 24 * 60 * 60 * 1000)));

    reservateTableBox(itemId, now, displayStartTime, displayEndTime);

    $('#displayDate').val(displayStartTime.split(' ')[0]);
    $('#displayTime').val(parseInt(displayStartTime.split(' ')[1].split(':')[0]));
    displayBefore.data('d-day', displayStartTime.split(' ')[0]);
    displayBefore.data('d-time', displayStartTime.split(' ')[1].split(':')[0]);
    displayAfter.data('d-day', displayStartTime.split(' ')[0]);
    displayAfter.data('d-time', displayStartTime.split(' ')[1].split(':')[0]);
  }
});

const displayAfter = $('#displayAfterDay');
displayAfter.on('click', () => {
  const itemId = displayAfter.data('item-id');
  const displayDate = displayAfter.data('d-day');
  const displayTime = displayAfter.data('d-time');
  if (itemId && displayDate && displayTime) {
    const now = parseTime(new Date());
    const st = new Date(new Date(displayDate.split('-')[0], parseInt(displayDate.split('-')[1] - 1), displayDate.split('-')[2], displayTime).getTime() + 24 * 60 * 60 * 1000);
    const displayStartTime = make0Min(parseTime(st));
    const displayEndTime = make0Min(parseTime(new Date(st.getTime() + 24 * 60 * 60 * 1000)));

    reservateTableBox(itemId, now, displayStartTime, displayEndTime);

    $('#displayDate').val(displayStartTime.split(' ')[0]);
    $('#displayTime').val(parseInt(displayStartTime.split(' ')[1].split(':')[0]));
    displayBefore.data('d-day', displayStartTime.split(' ')[0]);
    displayBefore.data('d-time', displayStartTime.split(' ')[1].split(':')[0]);
    displayAfter.data('d-day', displayStartTime.split(' ')[0]);
    displayAfter.data('d-time', displayStartTime.split(' ')[1].split(':')[0]);
  }
});

$('#bubutton').on('click', () => {
  console.log('1');
  confirm('test');
});

$('#deleteItem').submit(() => {
  if (!confirm('本当にこの備品を削除しますか？')) {
    return false;
  }
});

$('#deleteReservation').submit(() => {
  if (!confirm('本当にこの予約を削除しますか？')) {
    return false;
  }
});