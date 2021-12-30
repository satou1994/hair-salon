// -------------------------------------------------------------------------------
//      Google Drive API
// -------------------------------------------------------------------------------
const {google} = require('googleapis');
const bufferToStrem = require('buffer-to-stream');

//メソッド：Google Drive操作を実行する
//authorize([request.body.file],[実行したい処理（listFile/UploadFile/DeleteFile）])
exports.authorize = function (file, callback) {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URIS
  );
    
  const token_path = {
    "access_token":process.env.ACCESS_TOKEN,
    "refresh_token":process.env.REFRESH_TOKEN,
    "scope":process.env.SCOPE,
    "token_type":process.env.TOKEN_TYPE,
    "expiry_date":process.env.EXPIRY_DATE
  };
  
  oAuth2Client.setCredentials(token_path);
  return callback(oAuth2Client,file);
}

// メソッド：Gドラ内のファイルを取得する
function listFiles(auth) {
  const drive = google.drive({version: 'v3', auth});
  drive.files.list({
    pageSize: 10,
    fields: 'nextPageToken, files(id, name)',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const files = res.data.files;
    if (files.length) {
      console.log('Files:');
      files.map((file) => {
        console.log(`${file.name} (${file.id})`);
      });
    } else {
      console.log('No files found.');
    }
  });
}

// メソッド：Gドラにファイルをアップロードする
// UploadFile([OAuth2Client],[request.body.file])
function UploadFile(auth, file) {
  const drive = google.drive({version: 'v3', auth});  
  var fileMetadata = {
    name: file.originalname,
    parents: ['1Q44YS2E0pVm7raA8XLUkLun42tgyReV-']
    };
  var media = {
    mimeType: file.minetype,
    body: bufferToStrem(file.buffer)
  };

  var result = drive.files.create({
    resource: fileMetadata,
    media: media,
    fields: 'id'
  });

  return result;
}

// メソッド：Gドラ上の指定したファイルを削除する
// Delete([OAuth2Client],[削除するファイルID])
function DeleteFile(auth, deleteImgID) {
  const drive = google.drive({version: 'v3', auth});  
  const params = {
    fileId: deleteImgID
  };

  drive.files.delete(
    params,
    function (err, res) {
      if (err) console.error(err);
    }
  );
}


// -------------------------------------------------------------------------------
//   Gmail
// -------------------------------------------------------------------------------
const nodemailer = require('nodemailer');

// メソッド：Gmailを送信する
//submit([送信メッセージ])
exports.submit = function (message) {
  try {
    smtp.sendMail(message,function(error, info){
      if(error){
        console.log(error);
        return;
      }       
      console.log(info.messageId);
    });    
  } catch (error) {
    console.log(error);
  }
}

// メールサーバー情報
const smtp =nodemailer.createTransport({
  service:'gmail',
  port: 587,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});