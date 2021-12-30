// ----------------------------------------------------------
//   実行
// ----------------------------------------------------------
//スクロール
scroll();
//ハンバーガーメニュー
toggleNav();
//headerのaction付与
header();
//ヘッダーアニメーション
headerAnimation();

// ----------------------------------------------------------
//   スクロールに合わせてふわっと表示
// ----------------------------------------------------------
function scroll() {
  if(document.getElementsByClassName('reveal').length > 0){
    ScrollReveal().reveal('.reveal',{
      delay:200,
      duration:2500
    });
    ScrollReveal().reveal('.reveal-back',{
      duration:1000
    });
  }
}

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
// ----------------------------------------------------------
//   headerアニメーション
// ----------------------------------------------------------
function headerAnimation(){
  let refOffset = 0;//ユーザーがページスクロールした距離を取得
  const bannerHeight = 50; //ナビゲーションバーの高さ
  const bannerWrapper = document.querySelector('.banner-wrapper');
  
  const handler = () => {
    const newOffset = window.scrollY; //ユーザーのスクロール値取得
    
  if (newOffset > bannerHeight) {
    if (newOffset > refOffset) {
      $(".banner-wrapper").removeClass('animateIn');
      $(".banner-wrapper").addClass('animateOut');
    } else if(newOffset < refOffset-10){
      $(".banner-wrapper").removeClass('animateOut');
      $(".banner-wrapper").addClass('animateIn');
    }
    bannerWrapper.style.background = 'rgba(255, 255, 255, 0.6)';
    refOffset = newOffset;  //スクロール後を初期値に設定
    } else {
      bannerWrapper.style.backgroundColor = 'rgba(255, 255, 255, 1)';
    }
  };
  window.addEventListener('scroll', handler,false);
}