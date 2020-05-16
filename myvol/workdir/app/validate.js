'use strict';

function deleteErr() {
  $('#nullErr').empty();
  $('#startErr').empty();
  $('#endErr').empty();
  $('#dupErr').empty();
}

$("#form").submit(function () {
  let err = false;
  const itemId = $('#itemId').val();
  const startDate = $('#startDate').val();
  const startTime = $('#startTime').val();
  const startMin = $('#startMin').val();
  const endDate = $('#endDate').val();
  const endTime = $('#endTime').val();
  const endMin = $('#endMin').val();
  const start = new Date(startDate + ' ' + startTime + ':' + startMin + ':00');
  const end = new Date(endDate + ' ' + endTime + ':' + endMin + ':00');
  const is_null = (!startDate || !startTime || !startMin || !endDate || !endTime || !endMin);

  deleteErr();

  // 空値あり
  if (is_null) {
    err = true;
    $('#nullErr').append('<p>全ての要素を入力してください</p>');
  }
  else {
    // 開始時間が現在時間より前
    if (start < new Date()) {
      err = true;
      $('#startErr').append('<p>開始時間は現在時刻より後を指定してください</p>');
    }
    // 終了時間が現在時間より前
    if (end < new Date()) {
      err = true;
      $('#endErr').append('<p>終了時間は現在時刻より後を指定してください</p>');
    }
    // 終了日時が開始時間より前
    if (end <= start) {
      err = true;
      $('#endErr').append('<p>終了時間は開始時間より後を指定してください</p>');
    }
  }
  if (!err) {
    console.log('checking!!!');
    $.ajax({
      url: `/items/${itemId}/reservate/check`,
      type: 'post',
      data: {
        startDate, startTime, startMin, endDate, endTime, endMin
      },
      async: false
    })
      .done(
        (data) => {
          // 重複があるとき
          // alert(JSON.stringify(data));
          if (!data.return) {
            err = true;
            $('#dupErr').append('<p>指定した時間が他の予約と重複しています</p>')
          }
        }
      );
  }
  if (err) {
    // alert('jquery:: err')
    return false;
  }

});

