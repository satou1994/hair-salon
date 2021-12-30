// -------------------------------------------------------------------------------
//      postgreSQL設定
// -------------------------------------------------------------------------------
const { Client } = require('pg');
const StreamTransport = require('nodemailer/lib/stream-transport');
const { drive } = require('googleapis/build/src/apis/drive');
require('dotenv').config({debug:true});

// --------  接続情報  -----------
exports.connection = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    sslmode:'require',
    rejectUnauthorized:false
  }
});