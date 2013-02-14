$(function () {
  $('#showControls').click(function() {
    $('#controls').show();
    return false;
  });

  $('#composeTweetForm').on('submit', function () {
    if ($('#tweetInput').val().length > 140) {
      $('#failure').show();
    } else {
      $.post("/tweets", $('#composeTweetForm').serialize());
      $('#success').show();
    }
    return false;
  });
})
