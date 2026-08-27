
(() => {
  const qs = (s, r=document) => r.querySelector(s);
  const qsa = (s, r=document) => [...r.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reading progress
  const progress=document.createElement('div'); progress.className='motion-progress'; document.body.appendChild(progress);
  const updateProgress=()=>{const h=document.documentElement.scrollHeight-window.innerHeight; progress.style.transform=`scaleX(${h>0?window.scrollY/h:0})`};
  window.addEventListener('scroll',updateProgress,{passive:true}); updateProgress();

  // Navigation
  const nav=qs('.nav');
  window.addEventListener('scroll',()=>nav?.classList.toggle('scrolled',scrollY>30),{passive:true});
  const menu=qs('#mobileMenu'), panel=qs('.menuPanel');
  if(menu&&panel){
    menu.setAttribute('aria-expanded','false');
    menu.addEventListener('click',()=>{const open=panel.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
    panel.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{panel.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){panel.classList.remove('open');menu.setAttribute('aria-expanded','false')}});
  }

  // Cursor spotlight on capable desktops
  if(!reduce && matchMedia('(hover:hover) and (pointer:fine)').matches){
    const glow=document.createElement('div'); glow.className='cursor-glow'; document.body.appendChild(glow); document.body.classList.add('has-cursor-glow');
    let mx=innerWidth/2,my=innerHeight/2,cx=mx,cy=my;
    addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY},{passive:true});
    const loop=()=>{cx+=(mx-cx)*.12;cy+=(my-cy)*.12;glow.style.transform=`translate(${cx}px,${cy}px) translate(-50%,-50%)`;requestAnimationFrame(loop)}; loop();
  }

  // Section reveals + section marker
  qsa('section').forEach(sec=>{ if(!sec.querySelector('.section-marker')){const m=document.createElement('span');m.className='section-marker';m.setAttribute('aria-hidden','true');sec.prepend(m);} });
  const revealEls=qsa('.reveal');
  if(reduce){revealEls.forEach(el=>{el.style.opacity=1;el.style.transform='none';el.classList.add('motion-visible')});}
  else{
    revealEls.forEach((el,i)=>{el.style.transitionDuration='.9s';el.style.transitionTimingFunction='cubic-bezier(.16,1,.3,1)';el.style.transitionDelay=`${Math.min(i%5*.07,.28)}s`;});
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.style.opacity=1;e.target.style.transform='none';e.target.classList.add('motion-visible');io.unobserve(e.target)}}),{threshold:.12,rootMargin:'0px 0px -8% 0px'}); revealEls.forEach(el=>io.observe(el));
    const sio=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in-view')}),{threshold:.08}); qsa('section,.pagehero').forEach(el=>sio.observe(el));
  }

  // Split hero title into animated words, preserving markup
  const h1=qs('.hero h1');
  if(h1 && !reduce && !h1.dataset.motionSplit){
    h1.dataset.motionSplit='1'; const walker=document.createTreeWalker(h1,NodeFilter.SHOW_TEXT); const nodes=[]; while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(node=>{const frag=document.createDocumentFragment();node.textContent.split(/(\s+)/).forEach(part=>{if(/^\s+$/.test(part))frag.appendChild(document.createTextNode(part)); else {const w=document.createElement('span');w.className='word';const inner=document.createElement('span');inner.textContent=part;w.appendChild(inner);frag.appendChild(w)}});node.parentNode.replaceChild(frag,node)});
  }

  // Gentle parallax on hero visual and marked elements
  const visual=qs('.visual-main');
  if(visual&&!reduce && matchMedia('(hover:hover) and (pointer:fine)').matches){
    let tx=0,ty=0,rx=0,ry=0;
    visual.closest('.visual')?.addEventListener('pointermove',e=>{const r=visual.closest('.visual').getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;tx=x*10;ty=y*8;rx=-y*1.5;ry=x*2});
    visual.closest('.visual')?.addEventListener('pointerleave',()=>{tx=ty=rx=ry=0});
    const animate=()=>{const cs=getComputedStyle(visual); if(!visual.matches(':hover') && Math.abs(tx)+Math.abs(ty)<.01){} visual.style.transform=`translate3d(${tx*.35}px,${ty*.35}px,0) rotate(${1.2+rx}deg) rotateY(${ry}deg)`;requestAnimationFrame(animate)};animate();
  }

  // Scroll parallax elements
  if(!reduce){
    const paras=qsa('[data-parallax]');
    const onScroll=()=>{const sy=scrollY;paras.forEach(el=>{const speed=parseFloat(el.dataset.parallax)||.08;const r=el.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight)el.style.transform=`translate3d(0,${(innerHeight/2-(r.top+r.height/2))*speed}px,0)`})};
    addEventListener('scroll',onScroll,{passive:true}); onScroll();
  }

  // Add parallax hooks to prominent visual blocks
  qsa('.visual-main,.floating,.program,.productvisual').forEach((el,i)=>{if(!el.dataset.parallax)el.dataset.parallax=(i%2?'0.025':'0.045')});

  // Magnetic CTAs on desktop
  if(!reduce && matchMedia('(hover:hover) and (pointer:fine)').matches){
    qsa('.btn,.magnetic').forEach(btn=>{btn.classList.add('magnetic');btn.addEventListener('pointermove',e=>{const r=btn.getBoundingClientRect();const x=(e.clientX-r.left-r.width/2)*.12,y=(e.clientY-r.top-r.height/2)*.12;btn.style.transform=`translate(${x}px,${y}px)`});btn.addEventListener('pointerleave',()=>btn.style.transform='')});
  }

  // Tilt cards, only when the device supports fine pointer
  if(!reduce && matchMedia('(hover:hover) and (pointer:fine)').matches){
    qsa('.card,.program,.product,.article,.logoBox').forEach(card=>{
      card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(900px) rotateX(${(-y*2).toFixed(2)}deg) rotateY(${(x*2).toFixed(2)}deg) translateY(-7px)`});
      card.addEventListener('pointerleave',()=>card.style.transform='');
    });
  }

  // Animated counters
  const parseNum=t=>{const m=String(t).match(/([0-9][0-9,]*)(\+?)/);return m?{n:Number(m[1].replace(/,/g,'')),suffix:m[2]||''}:null};
  qsa('.stat b').forEach(el=>{const p=parseNum(el.textContent);if(!p||p.n<2)return;el.classList.add('number-pop');const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;let s=0,start=performance.now();const dur=1100;const tick=now=>{const k=Math.min(1,(now-start)/dur),v=Math.round((1-Math.pow(1-k,3))*p.n);el.textContent=v.toLocaleString()+p.suffix;if(k<1)requestAnimationFrame(tick);else el.classList.add('counted')};requestAnimationFrame(tick);io.unobserve(el)}),{threshold:.6});io.observe(el)});

  // Toast interactions
  qsa('[data-toast]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();const t=qs('.toast');if(!t)return;t.textContent=b.dataset.toast;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600)}));

  // Add subtle hover spotlight to cards
  if(!reduce && matchMedia('(hover:hover) and (pointer:fine)').matches){
    qsa('.card,.program,.product,.article,.logoBox').forEach(el=>el.addEventListener('pointermove',e=>{const r=el.getBoundingClientRect();el.style.setProperty('--mx',`${e.clientX-r.left}px`);el.style.setProperty('--my',`${e.clientY-r.top}px`)}));
  }

  // Smooth page transition on internal links
  if(!reduce){qsa('a[href]').forEach(a=>{const url=a.getAttribute('href');if(!url||url.startsWith('#')||url.startsWith('http')||url.startsWith('mailto:')||a.target==='_blank')return;a.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();document.body.style.transition='opacity .22s ease';document.body.style.opacity='.35';setTimeout(()=>location.href=url,180)})})}

  // Premium UI layer: active navigation, pointer depth, smart header and section ambience
  const internalLinks=qsa('.links a');
  const path=location.pathname.split('/').pop() || 'index.html';
  internalLinks.forEach(a=>{
    const href=(a.getAttribute('href')||'').split('#')[0];
    if(href===path || (path==='' && href==='index.html')) a.classList.add('active');
  });

  // Hide/reveal header while scrolling, keeping it visible at the top and on upward movement.
  let lastY=scrollY;
  const updateHeader=()=>{
    if(!nav || innerWidth<700) return;
    const y=scrollY;
    if(y>180 && y>lastY+8) nav.style.transform='translateY(-110%)';
    else nav.style.transform='translateY(0)';
    lastY=y;
  };
  addEventListener('scroll',updateHeader,{passive:true});

  // Add a subtle progress state to long sections.
  if(!reduce){
    const sectionProgress=()=>qsa('section').forEach(sec=>{
      const r=sec.getBoundingClientRect();
      const p=Math.max(0,Math.min(1,(innerHeight-r.top)/(innerHeight+r.height)));
      sec.style.setProperty('--section-progress',p.toFixed(3));
    });
    addEventListener('scroll',sectionProgress,{passive:true}); sectionProgress();
  }

  // Keyboard-friendly mobile menu focus behaviour.
  if(menu&&panel){
    menu.addEventListener('click',()=>{
      if(panel.classList.contains('open')) panel.querySelector('a')?.focus();
    });
  }

  // Soft pointer depth on visual panels, limited to capable desktops.
  if(!reduce && matchMedia('(hover:hover) and (pointer:fine)').matches){
    qsa('.visual-main,.program,.productvisual').forEach(el=>{
      let frame;
      el.addEventListener('pointermove',e=>{
        const r=el.getBoundingClientRect();
        const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
        cancelAnimationFrame(frame);
        frame=requestAnimationFrame(()=>el.style.setProperty('--mx',`${(x+.5)*100}%`));
        el.style.setProperty('--my',`${(y+.5)*100}%`);
      },{passive:true});
    });
  }

})();
