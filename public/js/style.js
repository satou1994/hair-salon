//スクロールに合わせてふわっと表示
$(function(){
  if(document.getElementsByClassName('reveal').length > 0){
    ScrollReveal().reveal('.reveal',{
      delay:200,
      duration:2500
    });
    ScrollReveal().reveal('.reveal-back',{
      duration:1000
    });
  }
});

//ハンバーガーメニュー
toggleNav();

//headerのaction
header();

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

// ----------------------------------------------------------
//   headerのclass="action"の付与
// ----------------------------------------------------------
function header(){
  const pathname = location.pathname;

  if(pathname === '/news'){
      document.getElementById('news').classList.add('active');
  }
  if(pathname === '/menu'){
      document.getElementById('menu').classList.add('active');
  }
  if(pathname === '/gallery'){
      document.getElementById('gallery').classList.add('active');
  }
  if(pathname === '/staff'){
      document.getElementById('staff').classList.add('active');
  }
  if(pathname === '/hairdonation'){
      document.getElementById('hairdonation').classList.add('active');
  }
  if(pathname === '/access'){
      document.getElementById('access').classList.add('active');
  }
  if(pathname === '/contact'){
      document.getElementById('contact').classList.add('active');
  }
}
