// -----------------------------------------------
//      定数宣言
// -----------------------------------------------
const express = require('express');
const session = require('express-session');
const pgSession = require('express-pg-session')(session);
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const { render } = require('ejs');
// const multer = require('multer');
const app = express();

const strErrMsg = "エラーが発生しました";
const strErrEmail = "メールアドレスが正しくありません";
const strErrPass = "パスワードが正しくありません";
const strEmpName = "ユーザー名が未入力です";
const strEmpEmail = "メールアドレスが未入力です";
const strEmpPass = "パスワードが未入力です";
const strDupEmail = "メースアドレスは既に登録されています。";

// -----------------------------------------------
//      Using
// -----------------------------------------------
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

//********** セッション管理 **********
app.use(
  session({
      secret: 'my_secret_key',
      resave: false,
      saveUninitialized: false,
      cookie:{
        httpOnly: true,
        secure:false, //localだとfalseにしないと、Sessionが保持されない
        maxage:1000 * 60 * 30
      }
      // store: new pgSession({
      //   connectionString: process.env.DATABASE_URL,
      //   ssl: {
      //     sslmode:'require',
      //     rejectUnauthorized:false
      //   }
      // })
    })
    );
    
//********** ユーザー管理者用の制御処理 **********
app.use(
   ['/newsList','/edit/:id','/createNews'],
  (req, res, next) => {
  if( req.session.userId === undefined ){
    req.session.path = req.baseUrl;
    res.redirect('/login');
  } else {
    res.locals.userId = req.session.userId;
    res.locals.username = req.session.username;
    res.locals.isLoggedIn = true;
    next();
  }
});

//********** admin管理者用の制御処理 **********
app.use(
  ['/userList','/createUser'],
  (req, res, next) => {
    //未ログインの場合、リダイレクト
    if( req.session.userId === undefined){
      req.session.path = req.baseUrl;
      return res.redirect('/login');
    }
    //adminユーザーでない場合、リダイレクト
    if(req.session.userId !== 1){
      req.session.path = req.baseUrl;
      return res.redirect('/newsList');
    }
    //遷移処理
    res.locals.userId = req.session.userId;
    res.locals.username = req.session.username;
    res.locals.isLoggedIn = true;
    next();
});

app.use(
   ['/editUser/:id'],
  (req, res, next) => {
    //ログイン中のユーザーの編集画面でない場合、リダイレクト
    if(req.session.userId != 1 && req.params.id != req.session.userId){
      req.session.path = req.baseUrl;
      return res.redirect('/newsList');
    }
    //遷移処理
    res.locals.userId = req.session.userId;
    res.locals.username = req.session.username;
    res.locals.isLoggedIn = true;
    next();
});


// -----------------------------------------------
//      Routing
// -----------------------------------------------
app.get('/', (req, res) => {
  connection.query(
    'SELECT * FROM news ORDER BY id DESC',
    (error, result) => {
      if(error) console.log(error);
      res.render('index.ejs',{news:result.rows});
    }
  );
});

app.get('/news', (req, res) => {
  connection.query(
    'SELECT * FROM news ORDER BY id DESC',
    (error, result) => {
      if(error) console.log(error);
      res.render('news.ejs',{news:comRep(result.rows)});
    }
  );
});

app.get('/menu', (req, res) => {
  res.render('menu.ejs');
});

app.get('/gallery', (req, res) => {
  connection.query(
    'SELECT * FROM gallery ORDER BY last_update DESC',
    (error,result) => {
      if(error) console.log(error);
      res.render('gallery.ejs',{gallery:result.rows});
    }
  );
});

app.get('/staff', (req, res) => {
  res.render('staff.ejs');
});

app.get('/hairdonation', (req, res) => {
  res.render('hairdonation.ejs');
});

app.get('/access', (req, res) => {
  res.render('access.ejs');
});

app.get('/contact', (req, res) => {
  res.render('contact.ejs');
});

app.post('/send', (req, res) => {
  let message = {
    to: process.env.EMAIL_ADDRESS,
    subject: '【hair-salon-aki】From: '+ req.body.name + 'さん',
    text: req.body.comment +"\n\nName: "+ req.body.name + "\nEmail: "+ req.body.email
  }

  //送信
  submit(message);
  
  res.redirect('/contact');
});

app.get('/kids-discount-detail', (req, res) => {
  res.render('kids-discount-detail.ejs');
});


// --------  admin  -----------
//multerの設定
// var mltStorage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, "uploads/")
//   },
//   filename: function(req, file, cb) {
//     cb(null, Date.now() + "_" + file.originalname);
//   }
// });
// const upload = multer({ storage: mltStorage});

app.get('/newsList', (req, res) => {
  connection.query(
    'SELECT * FROM news ORDER BY id DESC',
    (error,result) => {
      if(error) console.log(error);
      res.render('admin-newsList.ejs',{news:comRep(result.rows)});
    }
  );
});

//********** 記事 **********
app.get('/createNews', (req, res) => {
  res.render('admin-createNews.ejs');
});

app.post('/createNews', 
  // upload.single('file'),
  (req, res) => {
  connection.query(
    'INSERT INTO news (title, comment) VALUES ($1, $2)',
    [req.body.title, req.body.comment],
    (error, result) => {
      if(error) console.log(error);
      res.redirect('/newsList');
      // res.send(req.file.originalname + 'ファイルのアップロードが完了しました');
    }
    );
  }
);
  
app.get('/edit/:id',(req,res) => {
  connection.query(
    'SELECT * FROM news WHERE id = $1',
    [req.params.id],
    (error,result) => {
      if(error) console.log(error);
      if(result.rowCount <= 0) return res.redirect('/newsList');
      res.render('admin-edit.ejs',{news:result.rows[0]});
    }
  );
});

app.post('/edit/:id',(req,res) => {
  connection.query(
    'UPDATE news SET title = $1, comment = $2 WHERE id = $3',
    [req.body.title,req.body.comment,req.params.id],
    (error,result) => {
      if(error) console.log(error);
      res.redirect('/newsList');
    }
  );
});
  
app.post('/delete/:id',(req, res) => {
  connection.query(
    'DELETE FROM news WHERE id = $1',
    [req.params.id],
    (error,result) => {
      if(error) console.log(error);
      res.redirect('/newsList');
    }
  );
});

//********** ログイン ************
app.get('/login',(req, res) => {
  res.render('admin-login.ejs',{login:"", errors:""});
});

app.post('/login', (req, res) => {
  const email = req.body.email;
  const password =req.body.password;
  const path = req.session.path;
  var aryErrMsg = {email:"",password:""};

  connection.query(
    'SELECT * FROM users WHERE email = $1',
    [email],
    (error,result) => {
      if(error) console.log(error);

      //一致するメールアドレスが見つからない
      if(result.rowCount <= 0){
        aryErrMsg.email = strErrEmail;
        return res.render('admin-login.ejs',{login:req.body, errors:aryErrMsg});
      }

      bcryptjs.compare(password, result.rows[0].password, (error, isEquals) => {
        //パスワードが不一致
        if(! isEquals){
          aryErrMsg.password = strErrPass;
          return res.render('admin-login.ejs',{login:req.body, errors:aryErrMsg});
        }
        //セッション設定
        req.session.userId = result.rows[0].id;
        req.session.username = result.rows[0].name;
        //リダイレクト
        if(path === undefined){
          res.redirect('/newsList');
        }else{
          res.redirect(path);
        }
      });  
    }
  );
});

app.get('/logout', (req, res) => {
  req.session.destroy((error) => {
    if(error) console.log(error);
    res.redirect('/newsList');
  });
})

//********** ユーザー ************
app.get('/userList', (req, res) => {
  connection.query(
    'SELECT id, name, email FROM users ORDER BY id DESC',
    (error, result) => {
      if(error) console.log(error);
      res.render('admin-userList.ejs',{users:result.rows});
    }
  );
})

app.get('/createUser', (req, res) => {
  res.render('admin-createUser.ejs',{user:"", errors:""});
})

app.post('/createUser', 
  //空文字エラー
  (req, res, next) => {
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    };
    var aryErrMsg = {message: "", name: "", email: "", password: ""};
    
    if(user.name === "" || user.email === "" || user.password === ""){
      if(user.name === ""){
        aryErrMsg.name = strEmpName;
      }
      if(user.email === ""){
        aryErrMsg.email = strEmpEmail;
      }
      if(user.password === ""){
        aryErrMsg.password = strEmpPass;
      }
      return res.render('admin-createUser.ejs',{user:user, errors:aryErrMsg})
    }

    next();
  },
  //重複エラー
  (req, res, next) => {
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    };
    var aryErrMsg = {message:"", name:"", email:"", password:""};

    connection.query(
      'SELECT email FROM users WHERE email = $1',
      [user.email],
      (error, result) => {
        if(result.rowCount > 0){
          aryErrMsg.message = strDupEmail;
          return res.render('admin-createUser.ejs',{user:user, errors:aryErrMsg})
        }

        next();
      }
    );
  },
  //実行
  (req, res) => {
    const user = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    };
    var aryErrMsg = {message:"", name:"", email:"", password:""};
    
    bcryptjs.hash(user.password,10,(error, hash) => {
      connection.query(
        'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
        [user.name, user.email, hash],
        (error,result) => {
          if(error) console.log("【Error】:" + error);
          if(result.rowCount < 0){
            aryErrMsg.message = strErrMsg;
            res.render('admin-createUser.ejs',{user:user, errors:aryErrMsg})
          }
          res.redirect('/userList');
        }
      );
    })
  }
);

app.get('/editUser/:id', (req, res) => {
  connection.query(
    'SELECT id, name, email FROM users WHERE id = $1',
    [req.params.id],
    (error, result) => {
      if(error) console.log(error);
      if(result.rowCount <= 0) return res.redirect('/newsList');
      res.render('admin-editUser.ejs',{user:result.rows[0], errors:""});
    }
  );
})

app.post('/editUser/:id',
  //空文字エラー
  (req, res, next) => {
    const user = {
      id: req.params.id,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    };
    let aryErrMsg = {message:"", name:"", email:"", password:""};
    
    if(user.name === "" || user.email === "" || user.password === ""){
      if(user.name === ""){
        aryErrMsg.name = strEmpName;
      }
      if(user.email === ""){
        aryErrMsg.email = strEmpEmail;
      }
      if(user.password === ""){
        aryErrMsg.password = strEmpPass;
      }
      res.render('admin-editUser.ejs',{user:user, errors:aryErrMsg});
    } else {
      next();
    }
  },
  //重複エラー
  (req, res, next) => {
    const user = {
      id: req.params.id,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    };
    let aryErrMsg = {message:"", name:"", email:"", password:""};

    connection.query(
    'SELECT id, email FROM users WHERE email = $1',
      [user.email],
      (error, result) => {
        if(error) console.log(error);
        if(result.rowCount > 0 && user.id != result.rows[0].id){
          aryErrMsg.email = strDupEmail;
          res.render('admin-editUser.ejs',{user:user, errors:aryErrMsg});
        }else{
          next();
        }
      }
    );
  },
  //実行
  (req, res) => {
    const user = {
      id: req.params.id,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    };
    let aryErrMsg = {message:"", name:"", email:"", password:""};

    bcryptjs.hash(user.password, 10, (error, hash) => {
      connection.query(
        'UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4',
        [user.name, user.email, hash, user.id],
        (error,result) => {
          if(error) console.log(error);

          //エラーの場合
          if(result.rowCount < 0){
            aryErrMsg.message = strErrMsg;
            return  res.render('admin-editUser.ejs',{user:user, errors:aryErrMsg});
          }

          //adminとそれ以外でリダイレクト
          if(req.session.userId == 1){
            res.redirect('/userList');
          } else {
            res.redirect('/newsList');
          }
        }
      );
    });
  }    
);

app.post('/deleteUser/:id',(req, res) => {
  connection.query(
    'DELETE FROM users WHERE id = $1',
    [req.params.id],
    (error,result) => {
      if(error) console.log(error);
      res.redirect('/userList');
    }
  );
});

// -----------------------------------------------
//      postgresql設定
// -----------------------------------------------
const { Client } = require('pg');
const StreamTransport = require('nodemailer/lib/stream-transport');
require('dotenv').config({debug:true});

// --------  接続情報  -----------
const connection = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    sslmode:'require',
    rejectUnauthorized:false
  }
});

// --------  接続  -----------
connection.connect((err) => {
  //エラー時の処理
  if(err){
      console.log('error connecting:' + err.stack);
      return;
  }
  //接続成功時の処理
  console.log('success');
});



// -----------------------------------------------
//      mail
// -----------------------------------------------
const smtp =nodemailer.createTransport({
  service:'gmail',
  port: 587,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

let submit = (message) => {
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

// -----------------------------------------------
//      port
// -----------------------------------------------
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);


// -----------------------------------------------
//      オリジナル
// -----------------------------------------------
// --------  db → html変換  -----------
let comRep = (results) => {
  results.forEach(result => {
    if(result.comment !== null || result.comment){
      //改行を変換
      result.comment = result.comment.replace(/\r\n/g , '<br>');
    }
    
    if(result.image !== null || result.image){
      //<img>をsrc=""を指定して生成
      result.image = "<img src=\"" + result.image + "\" alt=\"ニュースの画像\">"; 
    }
  });

  return results;
};