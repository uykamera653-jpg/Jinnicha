(()=>{
'use strict';
const css=`
html,body{margin:0!important;padding:0!important;background:#f7f9fc!important}body>header,body>.hero,body>main.wrap,body>footer{display:none!important}#findoExact{display:block!important;visibility:visible!important;position:relative!important;z-index:1!important;min-height:100vh!important;background:#f7f9fc!important}#findoExact .fe-top{display:flex!important}#findoExact .fe-home{display:block!important}#findoExact .fe-list-screen,#findoExact .fe-map-screen{display:none!important}#findoExact .fe-list-screen.show{display:block!important}#findoExact .fe-map-screen.show{display:block!important}#findoExact .fe-feature{display:flex!important}#findoExact .fe-bottom{display:flex!important}#findoExact .qicon,#findoExact .fi{font-size:0!important}#findoExact svg{display:block!important}#findoExact .fe-item{display:block!important}#findoExact .fe-ai-card{display:flex!important}
@media(max-width:600px){#findoExact{width:100%!important;max-width:none!important;margin:0!important;border-radius:0!important;box-shadow:none!important}.fe-top{height:64px!important;padding:0 16px!important}.fe-home{padding:14px 12px 82px!important}.fe-hero{border-radius:22px!important;padding:20px 14px 16px!important}.fe-hero h1{font-size:31px!important}.fe-quick button{min-height:82px!important}.fe-protect{min-height:142px!important}.fe-items{grid-auto-columns:143px!important}.fe-bottom{height:68px!important}}
`;
function run(){if(document.getElementById('findo-final-lock-style'))return;const s=document.createElement('style');s.id='findo-final-lock-style';s.textContent=css;document.head.appendChild(s);}
function ensure(){run();const r=document.getElementById('findoExact');if(r){r.style.display='block';r.style.visibility='visible';} }
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensure,{once:true});else setTimeout(ensure,0);setTimeout(ensure,300);setTimeout(ensure,1200);
})();
