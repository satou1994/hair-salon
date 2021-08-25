window.onload = function(){
  //スクロールに合わせてふわっと表示
  ScrollReveal().reveal('.reveal',{
    delay:100,
    duration:3000
  });
  ScrollReveal().reveal('.reveal-back',{
    duration:1000
  });

  //ハンバーガーメニュー
  toggleNav();
};

// ----------------------------------------------------------
//   ハンバーガーメニュークリック時の動作
// ----------------------------------------------------------
function toggleNav() {
  var body = document.body;
  var hamburger = document.getElementById('js-hamburger');

  hamburger.addEventListener('click', function() {
    body.classList.toggle('nav-open');
  });
}
