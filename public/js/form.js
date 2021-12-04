/*--------------------------------------------------
  定数
--------------------------------------------------*/
const strTitle = "タイトルを記入してください";
const strComment = "記事の記入がありません";
const strCommentLength = "800文字以内で入力してください";
const strEmail = "メールアドレスが未入力です";
const strPassword = "パスワードが未入力です";
const strPassCheck = "パスワードが違います";
const strCreate = "投稿を新規作成します\nよろしいですか？";
const strEdit = "投稿を編集します\nよろしいですか？";
const strDelete = "削除した場合、元に戻すことができません\n削除しますか？";


/*--------------------------------------------------
  リアルタイムエラーチェック処理（onblur）
--------------------------------------------------*/
//********** title **********
function blurTitle(val){
  if($("#error-title").find("p")){
    $("#error-title").css("display","none");
  }
  const title = val.value;
  const fncTitle = (title) => {
    let erListTitle = new Array();

    if(title == ""){
      erListTitle.push(strTitle);
    }

    return erListTitle;
  }

  let errorTitle="";
  fncTitle(title).forEach((str) => {
    errorTitle += "<p>" + str + "</p>";
  });

  $("#blur-title").html(errorTitle);
}

//********** comment **********
function blurComment(val){
  if($("#error-comment").find("p")){
    $("#error-comment").css("display","none");
  }
  const comment = val.value;
  const fncComment = (comment) => {
    let erListComment = new Array();

    if(comment == ""){
      erListComment.push(strComment);
      return erListComment;
    }

    if(comment.length > 800){
      erListComment.push(strCommentLength);
    }

    return erListComment;
  }

  let errorComment = "";
  fncComment(comment).forEach((str) => {
    errorComment += "<p>" + str + "<p/>";
  });

  $("#blur-comment").html(errorComment);
}

//********** password **********
function blurPass(val){
  if($("#error-password").find("p")){
    $("#error-password").css("display","none");
  }
  const pass = $('#password-check').val();
  const passCheck = val.value;
  let errPass = "";

  if(pass != passCheck){
    errPass = "<p>" + strPassCheck + "<p/>";
  }

  $("#blur-password-check").html(errPass);
}

//********** password-check **********
function blurPassCheck(val){
  if($("#error-password-check").find("p")){
    $("#error-password-check").css("display","none");
  }

  const pass = $('#password').val();
  const passCheck = val.value;
  let errPass = "";

  if(pass != passCheck){
    errPass = "<p>" + strPassCheck + "<p/>";
  }

  $("#blur-password-check").html(errPass);
}

function passCheck(value){
  const pass = $('#password').val();
  let errPass = "";
  
  if(value != pass){
    errPass = "<p>" + strPassCheck + "<p/>";
  }
  $("#blur-password-check").html(errPass);
}


/*--------------------------------------------------
  エラーチェック処理（submit）
--------------------------------------------------*/
$(function(){
  // ################################
  //  form-news
  // ################################
  $("#form-news").submit(function(){
    let title = $("#title").val();
    let comment = $("#comment").val();
    let errTitle = "";
    let errComment = "";

    //空白除去
    title = title.trim()

    //********** エラーチェック（title） **********
    if(title == ""){
      errTitle += "<p>" + strTitle + "</p>";
    }

    
    //********** エラーチェック（comment） **********
    //空白エラー
    if(comment == ""){
      errComment += "<p>" + strComment + "<p/>";
    }

    //文字数えラー
    if(comment.length > 800){
      errComment += "<p>" + strCommentLength + "<p/>";
    }
    
    //入力エラーがある場合、submitしない
    if(errTitle.length > 0  || errComment.length > 0){
      $("#error-title").html(errTitle);
      $("#error-comment").html(errComment);
      return false;
    }
  });

  // ################################
  //  form-login
  // ################################
  $('#form-login').submit(function(){
    let email = $("#email").val();
    let password = $("#password").val();
    let passwordCheck = $("#password-check").val();
    let errEmail = "";
    let errPassword = "";
    let errPassCheck = "";
     
    //********** エラーチェック（email） **********
    if(email == ""){
      errEmail += "<p>" + strEmail + "</p>";
    }

    //********** エラーチェック（password） **********
    if(password == ""){
      errPassword += "<p>" + strPassword + "</p>";
    }
    
    //********** エラーチェック（password-check） **********
    if(password != passwordCheck){
      errPassCheck += "<p>" + strPassCheck + "</p>";
    }
    
    //エラーがある場合は、submitしない
    if(errEmail.length > 0 || errPassword.length > 0){
      $('#error-email').html(errEmail);
      $('#error-password').html(errPassword);
      $('#error-password-check').html(errPassCheck);

      return false;
    }
  });

  // ################################
  //  form-delete
  // ################################
  $('#form-delete').submit(function(){
    if(!window.confirm(strDelete)){
      return false;
    }
  });
});

/*--------------------------------------------------
  文字数カウント
--------------------------------------------------*/
function countLength(value,textlength){
  document.getElementById(textlength).innerHTML = "文字数：" + value.length;
}

/*--------------------------------------------------
  ダイアログ
--------------------------------------------------*/
$(function(){
  $('.dialogue-create').submit(function(){
    if(!window.confirm(strCreate)){
      return false;
    }
  });
  $('.dialogue-edit').submit(function(){
    if(!window.confirm(strEdit)){
      return false;
    }
  });
  $('.dialogue-delete').submit(function(){
    if(!window.confirm(strDelete)){
      return false;
    }
  });
});

/*--------------------------------------------------
  設定したファイルを表示する処理
--------------------------------------------------*/
var fileElement = document.getElementById("file")
var imgElement = document.getElementById("img")

fileElement.onchange = function() {
  var fileReader = new FileReader()
  var file = fileElement.files[0]
  
  fileReader.readAsDataURL(file);
  fileReader.onload = function() {
    imgElement.innerHTML = `<img src=\"${this.result}\">`
  } 
}
