const express = require('express');
const app = express();

app.use(express.static('public'));


// -----------------------------------------------
//      Routing
// -----------------------------------------------
// --------  getter  -----------
app.get('/', (req, res) => {
  connection.query(
    'SELECT * FROM news ORDER BY id DESC',
    (error,result) => {
      if(error) throw err;
      res.render('index.ejs',{news:result.rows});
    }
  );
});

app.get('/news', (req, res) => {
  connection.query(
    'SELECT * FROM news ORDER BY id DESC',
    (error,result) => {
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

app.get('/kids-discount-detail', (req, res) => {
  res.render('kids-discount-detail.ejs');
});
  

// -----------------------------------------------
//      postgresql設定
// -----------------------------------------------
const { Client } = require('pg');
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
var comRep = (results) => {
  results.forEach(result => {
      result.comment = result.comment.replace(/\r\n/g , '<br>');
      
      if(result.image){
          result.image = "<img src=\"" + result.image + "\" alt=\"ニュースの画像\">"; 
      }
  });

  return results;
};