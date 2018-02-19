$(document).ready(function () {

//Password Strength Checking
$('#inputPassword').keyup(function (e) {
  var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");
  var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
  var enoughRegex = new RegExp("(?=.{6,}).*", "g");
  if (false == enoughRegex.test($(this).val())) {
    $('#pwC').html('Weak').css('color', 'red');
  } else if (strongRegex.test($(this).val())) {
    $('#pwC').html('Strong').css('color', 'green');

  } else if (mediumRegex.test($(this).val())) {
    $('#pwC').html('Medium').css('color', 'yellow');
  } else {
    $('#pwC').html('Weak').css('color', 'red');
  }
  return true;
});

//Password Matching
$('#inputPassword, #inputPassword2').on('keyup', function () {
  if ($('#inputPassword2').val() === ''){
    $('#message').html('Please Enter Password').css('color', 'red');
  }
  else if ($('#inputPassword').val() != $('#inputPassword2').val()) {
    $('#message').html('Password is Not Matching').css('color', 'red');
  } else{
    $('#message').html('Password Matched').css('color', 'green');
  }
});

//Email Validation
  $('#inputEmail').on('keyup', function () {
    var chk_email = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,5}$/;
      if ($('#inputEmail').val() === '') {
        $("#msg2").html('Please Enter Email').css('color','red');
        return false;
      } else if (chk_email.test($('#inputEmail').val()) == false) {
        $("#msg2").html('Enter valid email ').css('color', 'red');
      }else{
        $("#msg2").html('')
      }
    })

  //Mobile Validation
  $('#inputMobile').on('keyup', function () {
    var mob = /^[6789]\d{9}$/;
    if ($('#inputMobile').val() === '') {
      $("#msg3").html('Enter Mobile Number').css('color', 'red');;
      return false;
    } else if (mob.test($('#inputMobile').val()) == false) {
      $("#msg3").html(' Enter valid mobile Number').css('color', 'red');;
    }
    else {
      $("#msg3").html('<span class="green">');
    }
  });



});
