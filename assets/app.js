
const nav=document.querySelector('.nav');window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>30));
const menu=document.querySelector('#mobileMenu'), panel=document.querySelector('.menuPanel');if(menu)menu.onclick=()=>panel.classList.toggle('open');
document.querySelectorAll('.reveal').forEach((el,i)=>{const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.style.transition=`opacity .75s ease ${Math.min(i*.03,.3)}s, transform .75s ease ${Math.min(i*.03,.3)}s`;e.target.style.opacity=1;e.target.style.transform='none';io.unobserve(e.target)}}),{threshold:.12});io.observe(el)});
document.querySelectorAll('[data-toast]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();const t=document.querySelector('.toast');t.textContent=b.dataset.toast;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2600)}));
