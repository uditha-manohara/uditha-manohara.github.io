(function(){
'use strict';
var B={"lp": [350.3, 127.6, 413.7, 291.8], "rp": [562.8, 43.8, 628.2, 204.6], "ring": [180.4, 43.2, 812.1, 349.5], "star": [648.4, 0.6, 734.1, 93.8], "word": [-0.2, 444.6, 996.3, 542.1], "slog": [-0.1, 586.2, 999.8, 609.8], "icon": [180.4, 0.6, 812.1, 349.5]},D=document,$=function(i){return D.getElementById(i)},H=D.documentElement,ld=$('ld'),seen=0,started=0;
var force=/[?&]intro/.test(location.search)||location.hash==='#intro';
try{seen=sessionStorage.getItem('nz')}catch(e){}
var rm=matchMedia('(prefers-reduced-motion:reduce)').matches;

/* navigation */
var nv=$('nv'),mn=$('mn');
mn.onclick=function(){var o=nv.classList.toggle('o');mn.setAttribute('aria-expanded',o)};
nv.querySelectorAll('a').forEach(function(a){a.onclick=function(){nv.classList.remove('o');mn.setAttribute('aria-expanded',false)}});
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){nv.querySelectorAll('a').forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+x.target.id)})}})},{rootMargin:'-45% 0px -50% 0px'});
D.querySelectorAll('main section[id]').forEach(function(s){io.observe(s)})}

/* page animations (GSAP) */
function go(){
if(started)return;started=1;
var g=window.gsap,S=window.ScrollTrigger;
if(!g||!S||rm)return;
g.registerPlugin(S);
var tl=g.timeline({defaults:{ease:'power3.out'}});
tl.from('.h1 .wd',{yPercent:115,duration:1.1,stagger:.1}).from('[data-h]',{y:30,opacity:0,duration:.8,stagger:.1},'-=.7').from('.art',{scale:.88,opacity:0,duration:1.3},'-=1.1');
g.utils.toArray('[data-r]').forEach(function(el){g.from(el,{y:46,opacity:0,duration:.9,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 90%',once:true}})});
S.batch('.cd,.pj,.faq details',{start:'top 92%',once:true,onEnter:function(b){g.from(b,{y:40,opacity:0,duration:.8,stagger:.12,overwrite:true})}});
g.to('#pg',{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:.3}});
g.utils.toArray('.im img').forEach(function(i){g.fromTo(i,{yPercent:-5},{yPercent:5,ease:'none',scrollTrigger:{trigger:i.parentNode,scrub:true}})});
var a=D.querySelector('.art svg');
if(a&&matchMedia('(hover:hover)').matches){var qx=g.quickTo(a,'x',{duration:.9,ease:'power3'}),qy=g.quickTo(a,'y',{duration:.9,ease:'power3'});addEventListener('mousemove',function(e){qx((e.clientX/innerWidth-.5)*26);qy((e.clientY/innerHeight-.5)*26)})}
g.to('.art svg',{rotate:-3,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
}

/* loading scene: logo builds from its five elements */
function done(){try{sessionStorage.setItem('nz','1')}catch(e){}ld.classList.add('x');H.style.overflow='';setTimeout(function(){ld.style.display='none'},800);go()}
function R(i,x,y,w,h){var r=$(i);r.setAttribute('x',x);r.setAttribute('y',y);r.setAttribute('width',Math.max(w,0));r.setAttribute('height',Math.max(h,0))}
var e=function(p){return p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2},bk=function(p){var c=1.7;return 1+(c+1)*Math.pow(p-1,3)+c*Math.pow(p-1,2)},P=4;
var l=B.lp,r=B.rp,ic=B.icon,wd=B.word,sg=B.slog,s=B.star,cx=(s[0]+s[2])/2,cy=(s[1]+s[3])/2,Wd=ic[2]-ic[0];
var T=[[300,1000,function(p){R('k1',l[0]-P,l[3]+P-(l[3]-l[1]+2*P)*p,l[2]-l[0]+2*P,(l[3]-l[1]+2*P)*p)}],
[600,1300,function(p){R('k2',r[0]-P,r[1]-P,r[2]-r[0]+2*P,(r[3]-r[1]+2*P)*p)}],
[1100,1800,function(p){R('k3',ic[0]-P,0,(Wd+2*P)*p,610)}],
[1900,2900,function(p){R('k4',ic[0]-P,0,(Wd+2*P)*p,610)}],
[2750,3400,function(p){var k=Math.max(bk(p),.001);$('st').setAttribute('transform','translate('+cx+' '+cy+') scale('+k+') translate('+-cx+' '+-cy+')');if(p>.6)ld.classList.add('on')}],
[2900,3900,function(p){R('k5',wd[0]-P,wd[1]-P,(wd[2]-wd[0]+2*P)*p,wd[3]-wd[1]+2*P)}],
[3500,4200,function(p){R('k6',sg[0]-P,sg[1]-P,(sg[2]-sg[0]+2*P)*p,sg[3]-sg[1]+2*P)}]];
var t0,end,fin;
function f(n){var t=n-t0;T.forEach(function(k){var p=Math.min(Math.max((t-k[0])/(k[1]-k[0]),0),1);k[2](rm?1:(k[2]===T[4][2]?p:e(p)))});
if(t>=end){if(!fin){fin=1;done()}return}requestAnimationFrame(f)}
function play(){T.forEach(function(t){t[2](0)});ld.classList.remove('x','on');ld.style.display='';H.style.overflow='hidden';nv.classList.remove('o');fin=0;end=rm?600:4900;requestAnimationFrame(function(n){t0=n;requestAnimationFrame(f)})}
D.querySelectorAll('.rpb').forEach(function(b){b.onclick=function(){scrollTo(0,0);play()}});
T.forEach(function(t){t[2](0)});
if(seen&&!force){ld.style.display='none';go()}else play();
})();
