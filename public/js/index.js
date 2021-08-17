$(function() {
  // ----------------------------------------------------------
  //   ページ読み込み時にふわっと表示
  // ----------------------------------------------------------
  $('body').fadeIn(2000);
  
  // ----------------------------------------------------------
  //   スライドショー
  // ----------------------------------------------------------
  $('.top-img').slick({
    accessibility: true,
    autoplay: true,
    autoplaySpeed: 5000,
    speed: 2500,
    fade: true,
  }); 
  
  // ----------------------------------------------------------
  //   ページ内遷移をゆっくりさせるための処理
  // ----------------------------------------------------------
    // #で始まるa要素をクリックした場合に処理
  $('a[href^=#]').click(function(){
    // 移動先を0px調整する。0を30にすると30px下にずらすことができる。
    var adjust = 0;
    // スクロールの速度（ミリ秒）
    var speed = 400;
    // アンカーの値取得 リンク先（href）を取得して、hrefという変数に代入
    var href= $(this).attr("href");
    // 移動先を取得 リンク先(href）のidがある要素を探して、targetに代入
    var target = $(href == "#" || href == "" ? 'html' : href);
    // 移動先を調整 idの要素の位置をoffset()で取得して、positionに代入
    var position = target.offset().top + adjust;
    // スムーススクロール linear（等速） or swing（変速）
    $('body,html').animate({scrollTop:position}, speed, 'swing');
    return false;
  });

  // ----------------------------------------------------------
  //   header
  // ----------------------------------------------------------
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
});