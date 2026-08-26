(() => {
  const U={};
  const LANGS={uz:{name:'O‘zbekcha',flag:'🇺🇿'},ru:{name:'Русский',flag:'🇷🇺'},en:{name:'English',flag:'🇬🇧'}};
  const lang=localStorage.getItem('findo_lang')||'uz';
  function choose(x){localStorage.setItem('findo_lang',x);location.reload()}
  function boot(){
    const nav=document.querySelector('.navBtns');
    if(nav&&!document.getElementById('findoLangBtn')){
      const b=document.createElement('button');b.id='findoLangBtn';b.className='btn';b.textContent=LANGS[lang].flag+' '+lang.toUpperCase();
      b.onclick=()=>{let p=document.getElementById('findoLangPanel');if(p){p.remove();return}p=document.createElement('div');p.id='findoLangPanel';p.style.cssText='position:fixed;right:10px;top:62px;z-index:9999;background:#fff;border:1px solid #e4e7ec;border-radius:14px;padding:8px;display:flex;flex-direction:column;gap:6px';Object.entries(LANGS).forEach(([k,v])=>{const x=document.createElement('button');x.className='btn';x.textContent=v.flag+' '+v.name;x.onclick=()=>choose(k);p.appendChild(x)});document.body.appendChild(p)};
      nav.insertBefore(b,nav.firstChild)
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();

(()=>{for(const src of ['findo-features.js','findo-pro-features.js','findo-map.js','findo-modern.js','findo-pro-ui.js','findo-visual-icons.js']){if(!document.querySelector(`script[src="${src}"]`)){const s=document.createElement('script');s.src=src+'?v=20260826-visual';s.async=false;document.head.appendChild(s)}}})();
