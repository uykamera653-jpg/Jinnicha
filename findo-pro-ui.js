(() => {
  const css = `
  .findo-pro-modal .box{padding:0!important;overflow:hidden;background:#fff}
  .findo-pro-modal .pro-head{padding:20px 22px 16px;background:linear-gradient(180deg,#fff,#f8faff);border-bottom:1px solid #edf0f5;display:flex;align-items:center;gap:13px;position:sticky;top:0;z-index:4}
  .findo-pro-modal .pro-icon{width:44px;height:44px;border-radius:14px;display:grid;place-items:center;background:#eef3ff;font-size:21px;flex:0 0 auto}
  .findo-pro-modal .pro-title{margin:0;font-size:20px;letter-spacing:-.5px}
  .findo-pro-modal .pro-sub{margin:3px 0 0;color:#7a8699;font-size:12px}
  .findo-pro-modal .pro-head .x{margin-left:auto;flex:0 0 auto}
  .findo-pro-modal .pro-body{padding:20px 22px 24px}
  .findo-pro-modal .pro-body>p{color:#667085;line-height:1.55;margin:0 0 16px}
  .findo-pro-modal .form{gap:13px}
  .findo-pro-modal .field label{color:#344054;margin-bottom:6px}
  .findo-pro-modal input,.findo-pro-modal textarea,.findo-pro-modal select{background:#fbfcfe!important;border:1px solid #e1e6ee!important;border-radius:13px!important;min-height:46px;outline:none;transition:.18s}
  .findo-pro-modal input:focus,.findo-pro-modal textarea:focus,.findo-pro-modal select:focus{border-color:#9db4ff!important;box-shadow:0 0 0 4px #2457ff12}
  .findo-pro-modal textarea{min-height:110px!important;resize:vertical}
  .findo-pro-modal .pro-primary{width:100%;min-height:48px;border-radius:13px!important;box-shadow:0 8px 20px #2457ff20}
  .findo-pro-modal .pro-section{margin-top:20px;padding-top:18px;border-top:1px solid #edf0f5}
  .findo-pro-modal .pro-section-title{font-size:13px;font-weight:850;color:#344054;margin-bottom:10px}
  .findo-pro-modal .list{gap:8px}
  .findo-pro-modal .listItem{border:1px solid #e9edf3;background:#fafbfe;border-radius:13px;padding:12px 13px;line-height:1.45}
  .findo-pro-modal .match{border:1px solid #dfe7ff;background:linear-gradient(180deg,#f6f8ff,#fff);border-radius:15px;padding:15px}
  .findo-pro-modal .score{font-size:34px;letter-spacing:-1px}
  .findo-pro-modal .alert{border:1px solid #dfe7ff;border-left:4px solid #2457ff;background:#f5f7ff;border-radius:12px}
  .findo-pro-modal .heroCard{background:linear-gradient(135deg,#14245b,#2457ff);border-radius:17px;box-shadow:0 14px 35px #2457ff25}
  .findo-pro-modal .pro-chips{display:flex;gap:7px;flex-wrap:wrap;margin:-3px 0 15px}
  .findo-pro-modal .pro-chip{background:#f1f4f9;border:1px solid #e5e9f0;border-radius:999px;padding:6px 9px;font-size:11px;font-weight:750;color:#667085}
  .findo-pro-modal .pro-chip.active{background:#eef3ff;border-color:#dbe4ff;color:#2457ff}
  @media(max-width:600px){.findo-pro-modal .pro-head{padding:16px}.findo-pro-modal .pro-body{padding:17px 15px 22px}.findo-pro-modal .pro-title{font-size:18px}.findo-pro-modal .pro-icon{width:40px;height:40px;border-radius:12px}.findo-pro-modal .pro-body>p{font-size:13px}.findo-pro-modal .pro-primary{min-height:50px}}
  `;
  const s=document.createElement('style');s.id='findo-pro-ui-style';s.textContent=css;document.head.appendChild(s);

  const META={
    ai:['🤖','Findo AI','Aqlli tahlil va moslashtirish'],visual:['📸','Visual Search','Rasm orqali o‘xshash buyumlarni qidirish'],radar:['🚨','Findo Radar','Mos yangi e’lonlardan xabar olish'],detective:['🕵️','Last Seen Detective','Oxirgi ko‘rilgan joylarni tahlil qilish'],nearby:['📍','Findo Nearby','Yaqin atrofdagi e’lonlar'],business:['🏢','Business Mode','Tashkilotlar uchun Lost & Found'],reward:['💰','Reward','Mukofot va rag‘bat'],proof:['🔐','Owner Proof','Egalikni tasdiqlash'],hero:['🏆','Findo Hero','Hamjamiyat ishonch ballari'],safety:['🛡️','Safety Center','Xavfsizlik va report'],qr:['🔗','Findo ID + QR','Buyumni QR bilan himoyalash'],saved:['❤️','Saqlanganlar','Siz saqlagan e’lonlar'],profile:['👤','Profil','Findo hisobingiz va faollik']
  };
  function decorate(id){
    const m=document.getElementById(id);if(!m||m.dataset.proDecorated)return;
    const box=m.querySelector('.box');if(!box)return;
    const meta=META[id]||['✨','Findo',''];
    const oldHead=box.querySelector('.head');
    if(oldHead){
      const title=oldHead.querySelector('h2');
      const sub=document.createElement('div');sub.className='pro-sub';sub.textContent=meta[2];
      const icon=document.createElement('div');icon.className='pro-icon';icon.textContent=meta[0];
      const titleWrap=document.createElement('div');
      titleWrap.innerHTML=`<h2 class="pro-title">${title?title.textContent:meta[1]}</h2>`;
      titleWrap.appendChild(sub);
      oldHead.innerHTML='';oldHead.className='pro-head';oldHead.append(icon,titleWrap);
      const x=document.createElement('button');x.className='x';x.textContent='×';x.onclick=window.closeM||(()=>{});oldHead.appendChild(x);
    }
    const head=box.querySelector('.pro-head');
    if(head){const body=document.createElement('div');body.className='pro-body';while(box.firstChild&&box.firstChild!==head){box.removeChild(box.firstChild)};while(head.nextSibling){body.appendChild(head.nextSibling)};box.appendChild(body)}
    m.classList.add('findo-pro-modal');m.dataset.proDecorated='1';
  }
  function scan(){Object.keys(META).forEach(decorate)}
  const mo=new MutationObserver(scan);mo.observe(document.body,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scan,{once:true});else scan();
})();
