/* ============================================================
   ANTALYA HAIR & ESTETİK — interactions
   ============================================================ */
(function(){
  'use strict';

  /* ---- inject logo into all .brand elements ---- */
  document.querySelectorAll('.brand').forEach(function(b){
    var img=document.createElement('img');
    img.src='images/logo-icon.png';
    img.alt='Hair Transplant Antalya';
    img.className='brand-logo';
    b.insertBefore(img,b.firstChild);
  });

  /* ---- sticky header shadow ---- */
  var nav = document.querySelector('header.nav');
  if(nav){
    var onScroll=function(){ nav.classList.toggle('scrolled', window.scrollY>10); };
    window.addEventListener('scroll',onScroll,{passive:true}); onScroll();
  }

  /* ---- mobile drawer ---- */
  var drawer=document.getElementById('drawer');
  document.querySelectorAll('[data-open-menu]').forEach(function(b){
    b.addEventListener('click',function(){ drawer&&drawer.classList.add('open'); });
  });
  if(drawer){
    drawer.querySelectorAll('[data-close-menu],.scrim,.panel a').forEach(function(el){
      el.addEventListener('click',function(){ drawer.classList.remove('open'); });
    });
  }

  /* ---- RU / EN i18n toggle ---- */
  function setLang(lang){
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-en]').forEach(function(el){
      if(!el.hasAttribute('data-ru')) el.setAttribute('data-ru', el.innerHTML);
      el.innerHTML = (lang==='en') ? el.getAttribute('data-en') : el.getAttribute('data-ru');
    });
    document.querySelectorAll('[data-en-ph]').forEach(function(el){
      if(!el.hasAttribute('data-ru-ph')) el.setAttribute('data-ru-ph', el.getAttribute('placeholder')||'');
      el.setAttribute('placeholder', (lang==='en') ? el.getAttribute('data-en-ph') : el.getAttribute('data-ru-ph'));
    });
    document.querySelectorAll('[data-en-href]').forEach(function(el){
      if(!el.hasAttribute('data-ru-href')) el.setAttribute('data-ru-href', el.getAttribute('href')||'');
      el.setAttribute('href', (lang==='en') ? el.getAttribute('data-en-href') : el.getAttribute('data-ru-href'));
    });
    document.querySelectorAll('[data-en-html]').forEach(function(el){
      if(!el.hasAttribute('data-ru-html')) el.setAttribute('data-ru-html', el.getAttribute(el.hasAttribute('title')?'title':'aria-label')||'');
    });
    document.querySelectorAll('.langs button,.d-langs button').forEach(function(b){
      b.classList.toggle('on', b.dataset.lang===lang);
    });
    try{ localStorage.setItem('ahe_lang', lang); }catch(e){}
  }
  document.querySelectorAll('.langs button,.d-langs button').forEach(function(b){
    b.addEventListener('click',function(){ setLang(b.dataset.lang); });
  });
  var savedLang='ru';
  try{ savedLang = localStorage.getItem('ahe_lang') || 'ru'; }catch(e){}
  setLang(savedLang);

  /* ---- reveal on scroll ---- */
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  },{threshold:.12});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

  /* ---- before / after sliders ---- */
  document.querySelectorAll('.ba').forEach(function(ba){
    var before=ba.querySelector('.ba-before');
    var inner=ba.querySelector('.ba-before-inner');
    var handle=ba.querySelector('.ba-handle');
    if(!before||!handle) return;
    var pos=50, dragging=false;
    function syncWidth(){ if(inner) inner.style.width=ba.clientWidth+'px'; }
    function set(p){ pos=Math.max(0,Math.min(100,p)); before.style.width=pos+'%'; handle.style.left=pos+'%'; }
    function fromEvent(e){
      var r=ba.getBoundingClientRect();
      var x=(e.touches?e.touches[0].clientX:e.clientX)-r.left;
      set(x/r.width*100);
    }
    handle.addEventListener('mousedown',function(){dragging=true;});
    handle.addEventListener('touchstart',function(){dragging=true;},{passive:true});
    window.addEventListener('mouseup',function(){dragging=false;});
    window.addEventListener('touchend',function(){dragging=false;});
    window.addEventListener('mousemove',function(e){ if(dragging){e.preventDefault();fromEvent(e);} });
    window.addEventListener('touchmove',function(e){ if(dragging){fromEvent(e);} },{passive:true});
    ba.addEventListener('click',function(e){ if(e.target.closest('.ba-handle'))return; fromEvent(e); });
    var ro=new ResizeObserver(syncWidth); ro.observe(ba);
    syncWidth(); set(50);
  });

  /* ---- graft calculator ---- */
  var calc=document.getElementById('calc');
  if(calc){
    var ZONES={
      hairline:{name:'Передняя линия',grafts:1200},
      frontal:{name:'Лобная зона',grafts:1600},
      midscalp:{name:'Средняя зона',grafts:1400},
      crown:{name:'Макушка',grafts:1800},
      templeL:{name:'Левый висок',grafts:600},
      templeR:{name:'Правый висок',grafts:600}
    };
    var METHODS={ fue:{name:'Sapphire FUE',price:1.1}, dhi:{name:'DHI Choi',price:1.4}, hybrid:{name:'Hybrid',price:1.25} };
    var selected={}, method='fue';
    var zonesBox=calc.querySelector('.calc-zones');
    var elGrafts=calc.querySelector('[data-grafts]');
    var elPriceLow=calc.querySelector('[data-price-low]');
    var elPriceHigh=calc.querySelector('[data-price-high]');

    function render(){
      // svg zones
      calc.querySelectorAll('.zone').forEach(function(z){
        z.classList.toggle('on', !!selected[z.dataset.zone]);
      });
      // chips
      var keys=Object.keys(selected);
      if(!keys.length){ zonesBox.innerHTML='<span class="empty">Выберите зоны на схеме головы →</span>'; }
      else{
        zonesBox.innerHTML=keys.map(function(k){
          return '<span class="chip">'+ZONES[k].name+'<button data-rm="'+k+'" aria-label="Удалить">×</button></span>';
        }).join('');
      }
      // totals
      var g=keys.reduce(function(s,k){return s+ZONES[k].grafts;},0);
      var p=METHODS[method].price;
      elGrafts.textContent=g.toLocaleString('ru-RU');
      elPriceLow.textContent='€'+Math.round(g*p*0.9).toLocaleString('ru-RU');
      elPriceHigh.textContent='€'+Math.round(g*p*1.1).toLocaleString('ru-RU');
    }
    calc.querySelectorAll('.zone').forEach(function(z){
      z.addEventListener('click',function(){
        var k=z.dataset.zone;
        if(selected[k]) delete selected[k]; else selected[k]=true;
        render();
      });
    });
    zonesBox.addEventListener('click',function(e){
      var rm=e.target.closest('[data-rm]'); if(rm){ delete selected[rm.dataset.rm]; render(); }
    });
    calc.querySelectorAll('.method-opts button').forEach(function(b){
      b.addEventListener('click',function(){
        calc.querySelectorAll('.method-opts button').forEach(function(x){x.classList.remove('on');});
        b.classList.add('on'); method=b.dataset.method; render();
      });
    });
    render();
  }

  /* ---- consultation form validation ---- */
  document.querySelectorAll('.cform').forEach(function(card){
    var form=card.querySelector('form'); if(!form)return;
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var ok=true;
      form.querySelectorAll('[required]').forEach(function(inp){
        var fg=inp.closest('.fg'); var val=inp.value.trim();
        var bad=!val || (inp.type==='tel' && val.replace(/\D/g,'').length<7) ||
                (inp.type==='email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val));
        fg.classList.toggle('invalid',bad);
        if(bad)ok=false;
      });
      if(ok) card.classList.add('sent');
    });
    form.querySelectorAll('[required]').forEach(function(inp){
      inp.addEventListener('input',function(){ inp.closest('.fg').classList.remove('invalid'); });
    });
  });

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-item').forEach(function(item){
    var q=item.querySelector('.faq-q'); var a=item.querySelector('.faq-a');
    q.addEventListener('click',function(){
      var open=item.classList.toggle('open');
      a.style.maxHeight=open?(a.scrollHeight+'px'):'0';
    });
  });

  /* ---- count-up stats ---- */
  var counted=false;
  var band=document.querySelector('.band');
  if(band){
    var cio=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(e.isIntersecting && !counted){ counted=true;
          band.querySelectorAll('[data-count]').forEach(function(el){
            var end=parseFloat(el.dataset.count), suf=el.dataset.suffix||'', t0=null;
            function step(ts){ if(!t0)t0=ts; var p=Math.min((ts-t0)/1400,1);
              var v=Math.floor((1-Math.pow(1-p,3))*end);
              el.textContent=v.toLocaleString('ru-RU')+suf;
              if(p<1)requestAnimationFrame(step); else el.textContent=end.toLocaleString('ru-RU')+suf;
            }
            requestAnimationFrame(step);
          });
        }
      });
    },{threshold:.4});
    cio.observe(band);
  }
})();
