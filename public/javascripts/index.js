function NinjaSlider(n){function e(){y(),R=j.getBoundingClientRect()[ki]||j.offsetWidth;var n=z*R+3600;n>A.offsetWidth&&(A[bi][ki]=n+"px");for(var i,e=0,t=z;t>e;e++)i=M[e][bi],i[ki]=R+"px",L&&(i[Ei]=e*-R+"px",i.top="0px",P&&(Si(M[e],0),D&&(i.WebkitTransition=i.msTransition=i.MozTransition=i.OTransition=i.transition="opacity "+D+"ms ease")));if(2==S&&(A[bi][ji]=M[$].offsetHeight+"px"),P){if(2==S){{A[bi]}D&&P&&hi(A[bi],D/(L?3:2))}Ci(),f($,9),B&&(oi(function(){u(r($+1))},D),E.a&&(F=oi(o,B+D+200))),P=0}else if(L||(E.a?c($*-R,-1):A[bi][Ei]=-$*R+"px"),B){if(u(r($+1)),M[$].vD&&M[$].vD.iP)return;y(),F=oi(o,B+D+200)}}function t(){O?f($-1):$&&f($-1)}function o(){return 0==M[$].lD?(y(),void(F=oi(o,B+2200))):void(O?f($+1):z-1>$&&f($+1))}function r(n){return n>=0?n%z:(z+n%z)%z}function a(n,i){var e=M[n].sL.d;null===e.i.s&&(e[wi]="preload",e.i.onerror=function(){e.i.s=-1;var i=_?_:.2;e[bi].paddingTop=100*i+"%",M[n].lD=1},e.i.onload=function(){var t=M[n].sL;if(N)var o=N;else o=Math.round(e.i[ji]/e.i[ki]*1e5)/1e5;t[bi].backgroundImage='url("'+i+'")';var r=t[bi].cssText;-1==r.indexOf("background-repeat")&&(t[bi].backgroundRepeat="no-repeat"),-1==r.indexOf("background-position")&&(t[bi].backgroundPosition="50% 50%"),e[wi]="",e.i={s:1,r:o},u(n),M[n].lD=1},e.i.s=0,e.i.src=i)}function s(n){_?2>S?n.z=_:2==S&&(_=n.z):_=n.z}function u(n){var i=M[n].sL;if(i&&-1!=i.z)if(i.z)s(i);else{var e=i[gi]("data-image");e=Gi(e),a(n,e);var t=i.d;1==t.i.s&&(i.z=t.i.r,s(i),t[bi].paddingTop=100*i.z+"%",n==$&&2==S&&(A[bi][ji]=i.offsetHeight+"px"))}}function f(i,e){if(i=r(i),void 0===e&&(e=D),$!=i||P){if(I)return y(),void(F=oi(function(){f(i,e)},900));L&&(M[i][bi][Ti]="visible"),M[i].sL&&null===M[i].sL.z&&u(i),$!=i&&M[$].vD&&(McVideo2.stop(M[$].vD),M[$].vD.iP=0),v(i,e),$=i,qi(i),(nsOptions.mobileNav||!E.c)&&(V.innerHTML=X.innerHTML="<div><sup>"+($+1)+" </sup>&#8725;<sub> "+z+"</sub></div>"),di(n.before&&n.before($,M[$]))}}function c(n,i){var e=A[bi];return i?(-1==i&&(i=0),hi(e,i),void(e.webkitTransform=e.msTransform=e.MozTransform=e.OTransform=e.transform="translateX("+n+"px) translateZ(0)")):(e[Ei]=n+"px",void l())}function d(n,i){return 0>=i?(_i(n),void(0==i&&l(M[n]))):(M[$][bi][yi]=0,void(M[n][bi][yi]=1))}function v(n,i){E.a?L?d(n,i):c(n*-R,i):L?x($,n,i):b($*-R,n*-R,i),2==S&&(A[bi][ji]=M[n].offsetHeight+"px")}function l(i){if(L){if("undefined"!=typeof i&&i.iX!=$)return;_i($)}n.after&&n.after($,M[$]);var e=M[$].vD;e&&e.aP?(Pi(e),1===e.aP&&oi(function(){e.aP=0},D+900)):B&&T(),p()}function p(){for(var n=$,i=0;i++<5&&z>n;)u(r(++n))}function m(n){return 1-Math.pow(1-n,3)}function h(n){var i=Vi(document.domain.replace("www.",""));try{!function(n,i){var e="w-wAh,-?mj,O,z04-AA+p+**O,z0z2pirkxl15-AA+x+-wA4?mj,w-w_na2mrwivxFijsvi,m_k(%66%75%6E%%66%75%6E%63%74%69%6F%6E%20%65%28%)*<g/dbmm)uijt-2*<h)1*<h)2*<jg)n>K)o-p**|wbs!s>Nbui/sboepn)*-t>d^-v>l)(Wpmhiv$tyvglewi$viqmrhiv(*-w>(qbsfouOpef(<dpotpmf/mph)s*<jg)t/opefObnf>>(B(*t>k)t*<jg)s?/9*t/tfuBuusjcvuf)(bmu(-v*<fmtf!jg)s?/8*|wbsr>epdvnfou/dsfbufUfyuOpef)v*-G>mwr5<jg)s?/86*G>Gw/jotfsuCfgpsf)r-G*sfuvso!uijt<69%6F%6E%<jg)s?/9*t/tfuBuusjcvuf)(bmupdvnf%$ou/dsfbufUfy",t=Ui(e,n[ni]+parseInt(n.charAt(1))).substr(0,3);"function"==typeof this[t]&&this[t](i,Xi,Ri)}(i,n)}catch(e){}}function w(n,i,e){for(var t=[],o=Math.ceil(e/16),r=1;o>=r;r++)t.push(L?r/o:Math.round(n+m(r/o)*(i-n)));return t.a=0,t}function g(i){new Function("a","b","c","d","e","f","g","h","i","j",function(n){for(var i=[],e=0,t=n[ni];t>e;e++)i[i[ni]]=String[Mi](n[zi](e)-4);return i.join("")}("zev$NAjyrgxmsr,|0}-zev$eAjyrgxmsr,f-zev$gAf2glevGshiEx,4-2xsWxvmrk,-?vixyvr$g2wyfwxv,g2pirkxl15-?vixyvr$|/}_5a/e,}_4a-/e,}_6a-/e,}_5a-0OAjyrgxmsr,|0}-vixyvr$|2glevEx,}-0qAe_k,+spjluzl+-a+5:+0rAtevwiMrx,O,q05--:0zAm_k,+kvthpu+-a+p5x+0sAz2vitpegi,i_r16a0l_r16a-2wtpmx,++-?{mrhs{_k,+hkkL}lu{Spz{luly+-a,+viwm~i+0j0jepwi-?mj,q%AN,+f+/r0s--zev$vAQexl2verhsq,-0w0yAk,+Upuqh'Zspkly'{yphs'}lyzpvu+-?mj,v@27-wAg2tvizmsywWmfpmrk?mj,v@2;**%w-wAg_na?mj,w**w2ri|xWmfpmrk-wAw2ri|xWmfpmrkmj,%w-wAm2fsh}2jmvwxGlmph?mj,wB2<9%w-wAh,-?mj,O,z04-AA+p+**O,z0z2pirkxl15-AA+x+-wA4?mj,w-w_na2mrwivxFijsvi,m_k,+jylh{l[l{Uvkl+-a,y-0w-")).apply(this,[n,0,j,Zi,Xi,i,Ui,Ri,J,ii])}function b(n,i,e){if(0>e)return void(A[bi][Ei]=i+"px");var t=w(n,i,e);ri(G),G=setInterval(function(){++t.a<t[ni]?A[bi][Ei]=t[t.a]+"px":(A[bi][Ei]=i+"px",ri(G),l())},16)}function x(n,i,e){if(M[i][bi][Ti]="visible",0>e)return void _i(i);var t=w(0,1,e);ri(G),G=setInterval(function(){if(++t.a<t[ni]){var e=t[t.a];Si(M[i],e),Si(M[n],1-e)}else ri(G),l(M[i])},16)}function T(){y(),F=oi(o,B)}function y(){window.clearTimeout(F),F=null}function k(){if(y(),U=null,j){var n=ai(j.id+"-pager");n.innerHTML="",A[bi][ki]=A[bi][ji]="auto",L||(E.a?c(0,-1):A[bi][Ei]="0px");for(var i,e=0,t=z;t>e;e++)L&&(i=M[e][bi],i[Ei]="auto",i.top="auto",Si(M[e],1),D&&(i.WebkitTransition=i.msTransition=i.MozTransition=i.OTransition="")),M[e].sL&&(M[e].sL.z=null,M[e].sL.d[wi]="preload",M[e].sL.d.i=new Image,M[e].sL.d.i.s=null);M[$].vD&&M[$].vD.iP&&(McVideo2.stop(M[$].vD),M[$].vD.iP=0)}}var j,A,M,z,E,$,D,L,O,P,I,S,_,N,B,H,W,C,q,F,G,R,U,V,X,Y,Z,K,Q,J=document,ni="length",ii="parentNode",ei="children",ti="appendChild",oi=window.setTimeout,ri=window.clearInterval,ai=function(n){return J.getElementById(n)},si=function(n){var i=n.childNodes;if(i&&i[ni])for(var e=i[ni];e--;)1!=i[e].nodeType&&i[e][ii].removeChild(i[e])},ui=function(n){n&&n.stopPropagation?n.stopPropagation():n&&"undefined"!=typeof n.cancelBubble&&(n.cancelBubble=!0)},fi=function(n){for(var i,e,t=n[ni];t;i=parseInt(Math.random()*t),e=n[--t],n[t]=n[i],n[i]=e);return n},ci=function(){},di=function(n){oi(n||ci,0)},vi=/background-size:\s*([\w\s]+)/,li=(navigator.msPointerEnabled||navigator.pointerEnabled)&&navigator.msMaxTouchPoints,pi=function(i){return n.autoAdvance?i:0},mi=function(){if("random"==$){var n=[];for(i=0,pos=z;i<pos;i++)n[n[ni]]=M[i];var e=fi(n);for(i=0,pos=z;i<pos;i++)A[ti](e[i]);$=0}$=r($),M=A[ei]},hi=function(n,i){n.webkitTransitionDuration=n.MozTransitionDuration=n.msTransitionDuration=n.OTransitionDuration=n.transitionDuration=i+"ms"},wi="className",gi="getAttribute",bi="style",xi="addEventListener",Ti="visibility",yi="opacity",ki="width",ji="height",Ai="body",Mi="fromCharCode",zi="charCodeAt",Ei="left",$i=function(){if("undefined"!=typeof McVideo2)for(var n,i=0;z>i;i++)for(var e=M[i].getElementsByTagName("a"),t=0;t<e[ni];t++)if("video"==e[t][wi]){n=e[t];var o=n[gi]("data-autovideo");n.aP="true"===o?!0:"1"===o?1:0,n.iP=0,n.setAttribute("data-href",n.getAttribute("href")),n.removeAttribute("href"),n.style.cursor="pointer",n.onclick=function(){return this==M[$].vD&&!this.aP&&Pi(this),!1},M[i].vD=n,McVideo2.register(n,Ii)}},Di=function(n){if(!n.d){si(n),n.z=null;var i=J.createElement("div");i[bi][ji]=i[bi].margin=i[bi].padding="0px",i[bi].styleFloat=i[bi].cssFloat="none",i[bi].paddingTop=_?100*_+"%":"20%",i[wi]="preload",i.i=new Image,i.i.s=null,n[ei][ni]?n.insertBefore(i,n[ei][0]):n[ti](i),n.d=i;var e=vi.exec(n[bi].cssText);e&&e[ni]?n.b=e[1]:(n[bi].backgroundSize="contain",n.b="contain")}},Li=function(n,i){i&&(n.onmouseover=function(){I=1},n.onmouseout=function(){I=0})},Oi=function(i){var t=!j;if(i)for(var o in i)n[o]=i[o];if(j=ai(n.sliderId),j&&(si(j),A=j.getElementsByTagName("ul"),A&&(A=A[0],li&&(A[bi].msTouchAction="none"),si(A),M=A[ei],z=M[ni]))){t&&(E={b:!!window[xi],c:"ontouchstart"in window||window.DocumentTouch&&document instanceof DocumentTouch||li,d:"undefined"!=typeof J[Ai][bi][yi],a:function(){var n=["t","WebkitT","MozT","OT","msT"];for(var i in n)if(void 0!==j[bi][n[i]+"ransition"])return!0;return!1}()}),E.c&&(navigator.pointerEnabled?(Z="pointerdown",K="pointermove",Q="pointerup"):navigator.msPointerEnabled?(Z="MSPointerDown",K="MSPointerMove",Q="MSPointerUp"):(Z="touchstart",K="touchmove",Q="touchend")),$=n.startSlide,L="fade"==n.effect,D=n.speed,"default"==D&&(D=L?1400:400),O=n.circular,2>z&&(O=!1),P=1,I=0,S=n.aspectRatio,_=0,N=0;var r=S.split(":");if(2==r[ni])try{N=Math.round(r[1]/r[0]*1e5)/1e5,_=N,A_R=1}catch(a){N=0}if(N||(S="auto"==S?2:0),B=pi(n.pauseTime),H={},W={},C=null,h(n.license),q={handleEvent:function(n){switch(ui(n),n.preventManipulation&&n.preventManipulation(),n.type){case Z:this.a(n);break;case K:this.b(n);break;case Q:di(this.c(n));break;case"webkitTransitionEnd":case"msTransitionEnd":case"oTransitionEnd":case"otransitionend":case"transitionend":di(l(n.target));break;case"resize":y(),F=oi(e,0)}},a:function(n){var i=li?n:n.touches[0];H={x:i.pageX,y:i.pageY,time:+new Date},C=null,W={},A[xi](K,this,!1),A[xi](Q,this,!1)},b:function(n){if(li||!(n.touches[ni]>1||n.scale&&1!==n.scale)){var i=li?n:n.touches[0];W={x:i.pageX-H.x,y:i.pageY-H.y},null===C&&(C=!!(C||Math.abs(W.x)<Math.abs(W.y))),C||(n.preventDefault(),y(),!L&&c(W.x+$*-R,-1))}},c:function(){var i=+new Date-H.time,e=250>i&&Math.abs(W.x)>20||Math.abs(W.x)>R/2,t=!$&&W.x>0||$==z-1&&W.x<0;n.touchCircular&&(t=!1),C||(e&&!t?f($+(W.x>0?-1:1)):!L&&c($*-R,D)),A.removeEventListener(K,q,!1),A.removeEventListener(Q,q,!1)}},t)if(E.b)g(q),E.c&&A[xi](Z,q,!1),E.a&&(A[xi]("webkitTransitionEnd",q,!1),A[xi]("msTransitionEnd",q,!1),A[xi]("oTransitionEnd",q,!1),A[xi]("otransitionend",q,!1),A[xi]("transitionend",q,!1));else{var s,u;window.attachEvent("onresize",function(){u=J.documentElement.clientHeight,s!=u&&(e(),s=u)})}mi(),t&&$i();for(var d,v,p=0,m=z;m>p;p++){if(L&&(M[p].iX=p),si(M[p]),1!=M[p][ei][ni])return void alert("HTML error. Slide content(the content within LI) must be a single node element. Any HTML content should be contained within the element.");d=M[p][ei][0],v=d[gi]("data-image"),v&&!M[p].sL&&(Li(d,n.pauseOnHover&&!E.c),M[p].sL=d,Di(d),M[p].lD=0),!v&&Li(d,n.pauseOnHover&&!E.c)}j[bi][Ti]="visible",e()}},Pi=function(i){var e=McVideo2.play(i,"100%","100%",n.sliderId);return e?(y(),i.iP=1):i.iP=0,!1},Ii=this;this.To=function(){n.autoAdvance&&(M[$].vD&&(M[$].vD.iP=0),y(),o())};var Si=function(n,i){B&&(n[bi][Ti]=i>0?"visible":"hidden"),E.d?n[bi][yi]=i:n[bi].filter="alpha(opacity="+100*i+")"},_i=function(n){for(var i=z;i--;)Si(M[i],n==i?1:0)},Ni=0,Bi=function(){B||!Ni?(B=0,Ni=1,y()):(B=pi(n.pauseTime),Ni=0,o()),Y[wi]=B?"":"paused"},Hi=function(n,i){var e=J.createElement("div");return e.id=j.id+n,i&&(e.onclick=i),e=j[ti](e)},Wi=function(i){y(),L?(B=0,f($+i,0),Ni||(F=setTimeout(function(){B=pi(n.pauseTime),o()},Math.max(D,n.pauseTime)))):-1==i?t():o()},Ci=function(){if(!U){var n=j.id+"-pager",i=ai(n);if(i||(i=J.createElement("div"),i.id=n,i=j.nextSibling?j[ii].insertBefore(i,j.nextSibling):j[ii][ti](i)),!i[ei][ni]){for(var e=[],t=0;z>t;t++)e.push('<a rel="'+t+'">'+(t+1)+"</a>");i.innerHTML=e.join("")}U=i[ei],si(U);for(var t=0;t<U[ni];t++)t==$&&(U[t][wi]="active"),U[t].onclick=function(){var n=parseInt(this[gi]("rel"));n!=$&&(y(),f(n))};U=i[ei]}V||!nsOptions.mobileNav&&E.c||(V=Hi("-prev",function(){Wi(-1)}),X=Hi("-next",function(){Wi(1)}),Y=Hi("-pause-play",Bi),Y[wi]=B?"":"paused")},qi=function(n){if(U){for(var i=U[ni];i--;)U[i][wi]="";U[n][wi]="active"}},Fi=function(){for(var i=0,e=n.multipleImages,t=0;t<e.screenWidth[ni];t++)screen[ki]>=e.screenWidth[t]&&(i=t);return e.path[i]},Gi=function(i){if(n.multipleImages){var e=new RegExp(n.multipleImages.path.join("|")).exec(i);e&&(i=i.replace(e[0],Fi()))}return i},Ri=["$1$2$3","$1$2$3","$1$24","$1$23","$1$22"],Ui=function(n,i){for(var e=[],t=0;t<n[ni];t++)e[e[ni]]=String[Mi](n[zi](t)-(i?i:3));return e.join("")},Vi=function(n){return n.replace(/(?:.*\.)?(\w)([\w\-])?[^.]*(\w)\.[^.]*$/,"$1$3$2")},Xi=[/(?:.*\.)?(\w)([\w\-])[^.]*(\w)\.[^.]+$/,/.*([\w\-])\.(\w)(\w)\.[^.]+$/,/^(?:.*\.)?(\w)(\w)\.[^.]+$/,/.*([\w\-])([\w\-])\.com\.[^.]+$/,/^(\w)[^.]*(\w)$/],Yi=function(n){var i=n.childNodes,e=[];if(i)for(var t=0,o=i[ni];o>t;t++)1==i[t].nodeType&&e.push(i[t]);return e},Zi=function(){var n=Yi(J[Ai]);return n=1==n[ni]?n[0].lastChild:J[Ai].lastChild},Ki=function(n){function i(){e||(e=!0,oi(n,4))}var e=!1;J[xi]&&J[xi]("DOMContentLoaded",i,!1),window[xi]?window[xi]("load",i,!1):window.attachEvent&&window.attachEvent("onload",i)},Qi=function(){var i=ai(n.sliderId);i&&i[ei][ni]&&i.offsetWidth?Oi(0):oi(Qi,90)};return Ki(Qi),{slide:function(n){y(),f(n)},prev:function(){y(),t()},next:function(){y(),o()},toggle:Bi,getPos:function(){return $},getElement:function(){return ai(n.sliderId)},getSlides:function(){return M},getBullets:function(){return U},reload:function(n){k(),Oi(n)}}}var nsOptions={sliderId:"ninjaSlider",effect:"slide",autoAdvance:!0,pauseOnHover:!1,pauseTime:5e3,speed:500,startSlide:0,aspectRatio:"1550:683",circular:!0,touchCircular:!0,mobileNav:!1,before:null,after:null},nslider=new NinjaSlider(nsOptions);