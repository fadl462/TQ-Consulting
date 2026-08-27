
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
    nodes.forEach(node=>{const frag=document.createDocumentFragment();let wi=0;node.textContent.split(/(\s+)/).forEach(part=>{if(/^\s+$/.test(part))frag.appendChild(document.createTextNode(part)); else {const w=document.createElement('span');w.className='word';w.style.setProperty('--word-index',wi++);const inner=document.createElement('span');inner.textContent=part;w.appendChild(inner);frag.appendChild(w)}});node.parentNode.replaceChild(frag,node)});
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
  // Premium section navigator on desktop
  if(!reduce && innerWidth > 1100){
    const sections=qsa('main > section');
    if(sections.length>2){
      const rail=document.createElement('nav'); rail.className='section-rail'; rail.setAttribute('aria-label','Page sections');
      const railNames=['Overview','TQ Architecture','Mental Toughness','Signature Learning','Credibility','TQ Store','Start a Conversation']; sections.forEach((sec,i)=>{const a=document.createElement('a');a.href=`#section-${i+1}`;a.dataset.index=i;const dot=document.createElement('span');dot.className='rail-dot';const label=document.createElement('span');label.className='rail-label';label.textContent=railNames[i]||`Section ${i+1}`;a.append(dot,label);sec.id=`section-${i+1}`;rail.append(a);});
      document.body.append(rail);
      const railLinks=qsa('.section-rail a');
      const roi=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){railLinks.forEach(a=>a.classList.toggle('active',a.dataset.index===String(sections.indexOf(e.target))))}}),{threshold:.3});sections.forEach(s=>roi.observe(s));
    }
  }

  // Add active state to the current page link
  qsa('.links a,.menuPanel a').forEach(a=>{const href=a.getAttribute('href');if(href && !href.startsWith('http') && !href.startsWith('#')){const current=location.pathname.split('/').pop()||'index.html';if(href.split('#')[0]===current)a.classList.add('active');}});


  // V8 interactive capability architecture
  const capabilities=[
    {name:'Consulting',title:'Turn complexity into direction.',text:'Results-driven management consulting across innovation, leadership, HR, sustainability and organisational transformation.',href:'solutions.html',meta:['Strategy','Transformation','Performance']},
    {name:'Learning',title:'Build capability that travels.',text:'Research-based learning experiences for leaders and workforces, delivered through workshops, public courses and tailored programmes.',href:'learning.html',meta:['Leadership','Workforce','Development']},
    {name:'Coaching',title:'Unlock potential through practice.',text:'Professional coaching grounded in best practice, designed to strengthen performance, self-awareness and career growth.',href:'solutions.html#coaching',meta:['Executive','Performance','Growth']},
    {name:'Learning Technology',title:'Make learning more immersive.',text:'LMS, e-learning, mobile learning, VR/AR, simulations, gamification and emerging digital learning experiences.',href:'solutions.html#technology',meta:['Digital','Immersive','Scale']}
  ];
  const capTabs=qsa('.cap-tab');
  if(capTabs.length){
    const capTitle=qs('#capTitle'),capText=qs('#capText'),capPill=qs('#capPill'),capLink=qs('#capLink'),capCount=qs('#archCount'),capType=qs('#archType'),capIndex=qs('#capIndex');
    const metaEls=[qs('#capMeta1'),qs('#capMeta2'),qs('#capMeta3')];
    let active=0;
    const activateCap=(i)=>{
      active=i; const c=capabilities[i];
      capTabs.forEach((t,n)=>{t.classList.toggle('active',n===i);t.setAttribute('aria-selected',String(n===i));});
      [capTitle,capText,capPill,capLink,capCount,capType,capIndex].forEach(el=>el?.animate([{opacity:.15,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,easing:'cubic-bezier(.16,1,.3,1)'}));
      if(capTitle)capTitle.textContent=c.title;if(capText)capText.textContent=c.text;if(capPill)capPill.textContent=c.name;if(capLink){capLink.href=c.href;capLink.innerHTML=`Explore ${c.name.toLowerCase()} <span>↗</span>`;}if(capCount)capCount.textContent=`0${i+1}`;if(capType)capType.textContent=c.name;if(capIndex)capIndex.textContent=`0${i+1}`;metaEls.forEach((el,n)=>{if(el)el.textContent=c.meta[n]});
    };
    capTabs.forEach((t,i)=>t.addEventListener('click',()=>activateCap(i)));
    let capTimer=reduce?null:setInterval(()=>activateCap((active+1)%capabilities.length),7000);
    capTabs.forEach(t=>t.addEventListener('mouseenter',()=>{if(capTimer){clearInterval(capTimer);capTimer=null}}));
    qs('.cap-tabs')?.addEventListener('mouseleave',()=>{if(!reduce&&!capTimer)capTimer=setInterval(()=>activateCap((active+1)%capabilities.length),7000)});
  }

  // V8 interactive Mental Toughness dimensions
  const mentalData=[
    {name:'Performance',letter:'P',title:'Turn pressure into productive performance.',text:'Mental toughness is linked to meaningful variation in individual performance and how people approach demanding situations.'},
    {name:'Wellbeing',letter:'W',title:'Build steadier responses to pressure.',text:'A stronger mindset can support contentment, resilience and healthier ways of managing stress and uncertainty.'},
    {name:'Agility',letter:'A',title:'Respond positively when conditions change.',text:'Develop more constructive responses to uncertainty, disruption and the changing demands of work.'},
    {name:'Aspiration',letter:'A',title:'Raise ambition without losing perspective.',text:'Encourage purposeful ambition and greater readiness to take considered risks in pursuit of meaningful goals.'}
  ];
  const mTabs=qsa('.mental-tab');
  if(mTabs.length){
    const mIndex=qs('#mentalIndex'),mWord=qs('#mentalWord'),mLetter=qs('#mentalLetter'),mPill=qs('#mentalPill'),mTitle=qs('#mentalTitle'),mText=qs('#mentalText');
    let mi=0;
    const activateMental=(i)=>{mi=i;const d=mentalData[i];mTabs.forEach((t,n)=>t.classList.toggle('active',n===i));[mIndex,mWord,mLetter,mPill,mTitle,mText].forEach(el=>el?.animate([{opacity:.15,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:400,easing:'cubic-bezier(.16,1,.3,1)'}));if(mIndex)mIndex.textContent=`0${i+1}`;if(mWord)mWord.textContent=d.name;if(mLetter)mLetter.textContent=d.letter;if(mPill)mPill.textContent=d.name;if(mTitle)mTitle.textContent=d.title;if(mText)mText.textContent=d.text;};
    mTabs.forEach((t,i)=>t.addEventListener('click',()=>activateMental(i)));
  }

  // Hide/reveal navigation on scroll for a more app-like browsing feel
  let lastScroll=scrollY;
  addEventListener('scroll',()=>{if(!nav||innerWidth<700)return;const y=scrollY;if(y>140&&y>lastScroll+5)nav.classList.add('nav-hidden');else if(y<lastScroll-5)nav.classList.remove('nav-hidden');lastScroll=y},{passive:true});

})();

/* V12 premium interaction layer */
(function(){
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const q=(s,c=document)=>c.querySelector(s), qa=(s,c=document)=>[...c.querySelectorAll(s)];
  if(!reduce){
    // Cursor atmosphere: subtle, never a primary interaction.
    const glow=document.createElement('div'); glow.className='v12-cursor-glow'; document.body.append(glow);
    let gx=0,gy=0,tx=0,ty=0;
    addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY},{passive:true});
    const move=()=>{gx+=(tx-gx)*.12;gy+=(ty-gy)*.12;glow.style.left=gx+'px';glow.style.top=gy+'px';requestAnimationFrame(move)};move();

    // Viewport-driven reveal with deliberate stagger.
    const revealables=qa('main section .section-kicker, main section h1, main section h2, main section .lead, main section .about-art-shell, main section .story-stat, main section .engine-card, main section .principle-stack article, main section .logoBox, main section .cta-card');
    revealables.forEach((el,i)=>{if(!el.classList.contains('reveal')&&!el.classList.contains('v12-reveal')){el.classList.add('v12-reveal');el.dataset.v12Delay=String((i%5)+1)}});
    const rio=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');rio.unobserve(e.target)}}),{threshold:.08,rootMargin:'0px 0px -8% 0px'});
    revealables.forEach(el=>rio.observe(el));

    // Magnetic-ish nav links, kept restrained.
    if(matchMedia('(hover:hover) and (pointer:fine)').matches){
      qa('.links a').forEach(a=>a.addEventListener('pointermove',e=>{const r=a.getBoundingClientRect();const x=(e.clientX-r.left-r.width/2)*.035;const y=(e.clientY-r.top-r.height/2)*.08;a.style.transform=`translate(${x}px,${y}px)`}));
      qa('.links a').forEach(a=>a.addEventListener('pointerleave',()=>a.style.transform=''));
    }

    // About page: gently connect the four growth engines with a live active state.
    const engineCards=qa('.engine-card');
    engineCards.forEach((card,i)=>{
      card.addEventListener('pointerenter',()=>{engineCards.forEach((c,n)=>c.style.opacity=n===i?'1':'.62')});
      card.addEventListener('pointerleave',()=>engineCards.forEach(c=>c.style.opacity=''));
      card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();card.style.setProperty('--mx',`${e.clientX-r.left}px`);card.style.setProperty('--my',`${e.clientY-r.top}px`)});
    });
  }
})();

/* ===== V15 Solutions interactions ===== */
(function(){
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const q=(s,c=document)=>c.querySelector(s), qa=(s,c=document)=>[...c.querySelectorAll(s)];
  const caps=[
    {type:'CONSULTING',num:'01',title:'Turn complexity into direction.',text:'Results-driven management consulting across innovation, leadership, HR, sustainability and organisational transformation.',tags:['Strategy','Transformation','Performance'],href:'contact.html',label:'Explore consulting ↗'},
    {type:'LEARNING',num:'02',title:'Build capability that travels.',text:'Research-based learning experiences for leaders and workforces, delivered through workshops, public courses and tailored programmes.',tags:['Leadership','Workforce','Development'],href:'learning.html',label:'Explore learning ↗'},
    {type:'COACHING',num:'03',title:'Unlock potential through practice.',text:'Professional coaching grounded in best practice, designed to strengthen performance, self-awareness and career growth.',tags:['Executive','Performance','Growth'],href:'contact.html',label:'Explore coaching ↗'},
    {type:'LEARNING TECHNOLOGY',num:'04',title:'Make learning more immersive.',text:'LMS, e-learning, mobile learning, VR/AR, simulations, gamification and emerging digital learning experiences.',tags:['Digital','Immersive','Scale'],href:'contact.html',label:'Design a solution ↗'}
  ];
  const tabs=qa('.cap-tab');
  if(tabs.length){
    const els={idx:q('#capStageIndex'),type:q('#capStageType'),num:q('#capStageNum'),title:q('#capStageTitle'),text:q('#capStageText'),t1:q('#capTag1'),t2:q('#capTag2'),t3:q('#capTag3'),link:q('#capStageLink')};
    let active=0,timer=null;
    const paint=(i)=>{active=i;const c=caps[i];tabs.forEach((t,n)=>t.classList.toggle('active',n===i));Object.entries(els).forEach(([k,e])=>{if(!e)return;e.animate([{opacity:.15,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:380,easing:'cubic-bezier(.16,1,.3,1)'});});els.idx.textContent=c.num;els.type.textContent=c.type;els.num.textContent=c.num;els.title.textContent=c.title;els.text.textContent=c.text;els.t1.textContent=c.tags[0];els.t2.textContent=c.tags[1];els.t3.textContent=c.tags[2];els.link.href=c.href;els.link.textContent=c.label;};
    tabs.forEach((t,i)=>t.addEventListener('click',()=>paint(i)));
    if(!reduce){timer=setInterval(()=>paint((active+1)%caps.length),6000);q('.cap-tabs')?.addEventListener('mouseenter',()=>{if(timer){clearInterval(timer);timer=null}});q('.cap-tabs')?.addEventListener('mouseleave',()=>{if(!timer)timer=setInterval(()=>paint((active+1)%caps.length),6000)});}
  }
  qa('.tech-item').forEach(item=>item.addEventListener('click',()=>{qa('.tech-item').forEach(x=>x.classList.remove('active'));item.classList.add('active')}));
  if(!reduce && matchMedia('(hover:hover) and (pointer:fine)').matches){
    const hero=q('.sol-visual');const visual=q('.sol-visual-main');
    hero?.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;visual.style.transform=`rotate(${1.2+x*1.5}deg) translate(${x*5}px,${y*4}px)`});
    hero?.addEventListener('pointerleave',()=>visual.style.transform='rotate(1.2deg)');
  }
})();
