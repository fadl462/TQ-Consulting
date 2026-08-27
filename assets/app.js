const nav=document.querySelector('.nav');
window.addEventListener('scroll',()=>nav?.classList.toggle('scrolled',scrollY>30),{passive:true});
const menu=document.querySelector('#mobileMenu'), panel=document.querySelector('.menuPanel');
if(menu&&panel){
  menu.setAttribute('aria-expanded','false');
  menu.onclick=()=>{const open=panel.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));};
  panel.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{panel.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){panel.classList.remove('open');menu.setAttribute('aria-expanded','false')}});
}
document.querySelectorAll('.reveal').forEach((el,i)=>{
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.style.transition=`opacity .75s ease ${Math.min(i*.03,.3)}s, transform .75s ease ${Math.min(i*.03,.3)}s`;e.target.style.opacity=1;e.target.style.transform='none';io.unobserve(e.target)}}),{threshold:.12});
  io.observe(el)
});
document.querySelectorAll('[data-toast]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();const t=document.querySelector('.toast');if(!t)return;t.textContent=b.dataset.toast;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600)}));
