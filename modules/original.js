// -------------------------------------------------------------------------------
//      オリジナル
// -------------------------------------------------------------------------------
// メソッド；改行コードをPostgresからHTMLに変換する（「\r\n」→「<br>」）
// conversionIndention([newsテーブルのレスポンス内容])
exports.conversionIndention = function (results) {
    results.forEach(result => {
      if(result.comment !== null && result.comment){
        //改行を変換
        result.comment = result.comment.replace(/\r\n/g , '<br>');
      }
    });
  
    return results;
  };