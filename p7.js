/* boot helpers after game loop */
(function(){
  function wrap(){
    if(typeof start!=='function')return;
    if(start.__wrapped)return;
    const s=start;
    function ns(isRanked){
      try{document.body.classList.add('run')}catch(e){}
      return s(isRanked);
    }
    ns.__wrapped=true;
    start=ns;window.start=ns;
    if(typeof end==='function'){
      const e=end;
      end=function(){try{document.body.classList.remove('run')}catch(err){}return e.apply(this,arguments)};
      window.end=end;
    }
  }
  wrap();setTimeout(wrap,50);setTimeout(wrap,300);
})();
