const express = require('express');
const { Client } = require('pg');
const app = express();

require('dotenv').config({debug:true});

app.use(express.static('public'));

// -----------------------------------------------
//      herokuアプリからpostgresに接続する設定
// -----------------------------------------------
const connection = new Client({
  host : process.env.HOST,
  database : process.env.DATABASE,
  user : process.env.ENV_USER,
  posrt: 5432,
  password : process.env.PASSWORD,
  ssl: {
      sslmode:'require',
      rejectUnauthorized:false
  }
});

// --------  mysql接続エラーの表示設定  -----------
connection.connect((err) => {
  if(err){
      console.log('error connecting:' + err.stack);
      return;
  }
  console.log('success');
});


// -----------------------------------------------
//      controller
// -----------------------------------------------
// --------  get  -----------
app.get('/', (req, res) => {
  connection.query(
      'SELECT * FROM news',
      (error,result) => {
          if(error) throw err;
          res.render('index.ejs',{news:result.rows});
      }
  );
});


app.listen(3000);