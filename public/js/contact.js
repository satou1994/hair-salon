/*--------------------------------------------------
  onblur処理
--------------------------------------------------*/
//name
function blurName(val){
  if($("#error-message-name").find("p")){
    $("#error-message-name").css("display","none");
  };
  const name = val.value;
  const fncName = (name) => {
    let erListName = new Array();

    if(name == ""){
      erListName.push("名前を記入してください");
    };

    return erListName;
  };

  let errorName="";
  fncName(name).forEach((str) => {
    errorName += "<p>" + str + "</p>";
  });

  $("#blur-message-name").html(errorName);
}

//email
function blurEmail(val){
  if($("#error-message-email").find("p")){
    $("#error-message-email").css("display","none");
  };
  const email = val.value;
  const fncEmail =(email)=>{
    let erListEmail = new Array();

    if(email == ""){
      erListEmail.push("メールアドレスを記入してください");
      return erListEmail;
    };

    if(!email.match( /.*[@].*/)){
      erListEmail.push("メールアドレスが正しくありません");
    };

    if(!email.match(/\w/)){
      erListEmail.push("半角英数字で入力してください");
    };

    return erListEmail;
  };

  let errorEmail="";
  fncEmail(email).forEach((str) => {
    errorEmail += "<p>" + str + "</p>";
  });

  $("#blur-message-email").html(errorEmail);
}

//contact
function blurComment(val){
  if($("#error-message-comment").find("p")){
    $("#error-message-comment").css("display","none");
  };
  const comment = val.value;
  const fncComment = (comment) => {
    let erListComment = new Array();

    if(comment == ""){
      erListComment.push("コメントを記入してください");
      return erListComment;
    };

    if(comment.length > 80){
      erListComment.push("800文字以内で入力してください");
    };

    return erListComment;
  };

  let errorComment = "";
  fncComment(comment).forEach((str) => {
    errorComment += "<p>" + str + "<p/>";
  });

  $("#blur-message-comment").html(errorComment);
}

function countLength(value,textlength){
  document.getElementById(textlength).innerHTML = "文字数：" + value.length;
}

/*--------------------------------------------------
  submit処理
--------------------------------------------------*/
$(function(){
  $("#form").submit(function(){
    var name = $("#name").val();
    var email = $("#email").val();
    var comment = $("#comment").val();

    //空白除去
    name = name.replaceAll(" ","").replaceAll("　","").replaceAll("  ","");
    email = email.replaceAll(" ","").replaceAll("　","").replaceAll("  ","");


    //error name
    const fncName = (name) => {
      let erListName = new Array();

      if(name == ""){
        erListName.push("名前を記入してください");
      };
      return erListName;
    };

    let errorName="";
    fncName(name).forEach((str) => {
      errorName += "<p>" + str + "</p>";
    });

    $("#error-message-name").html(errorName);

    //error email
    const fncEmail =(email)=>{
      let erListEmail = new Array();

      if(email == ""){
        erListEmail.push("メールアドレスを記入してください");
        return erListEmail;
      };

      if(!email.match( /.*[@].*/)){
        erListEmail.push("メールアドレスが正しくありません");
      };

      if(!email.match(/\w/)){
        erListEmail.push("半角英数字で入力してください");
      };

      return erListEmail;
    };

    let errorEmail="";
    fncEmail(email).forEach((str) => {
      errorEmail += "<p>" + str + "</p>";
    });

    $("#error-message-email").html(errorEmail);

    //error contact
    const fncComment = (comment) => {
      let erListComment = new Array();

      if(comment == ""){
        erListComment.push("コメントを記入してください");
        return erListComment;
      };

      if(comment.length > 800){
        erListComment.push("800文字以内で入力してください");
      };

      return erListComment;
    };

    let errorComment = "";
    fncComment(comment).forEach((str) => {
      errorComment += "<p>" + str + "<p/>";
    });

    $("#error-message-comment").html(errorComment);

    $("#form-name").text(name);
    $("#form-email").text(email);
    $("#form-comment").text(comment);

    //入力エラーがあるか判定
    if(!(errorName == "" && errorEmail =="" && errorComment =="")){
      return false;
    };

  });
});
