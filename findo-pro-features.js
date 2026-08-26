(() => {
  const db=window.supabase.createClient('https://neavvgcxakefvlvecndc.supabase.co','sb_publishable_1o7-MHRPV_jKSs-xWA3odw_UhTNCuVM');
  const visitor=()=>localStorage.getItem('findo_visitor_id')||'visitor_guest';
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  const items=()=>window.items||[];
  async function visualPro(file){
    const bytes=await file.arrayBuffer();
    const hashBuf=await crypto.subtle.digest('SHA-256',bytes);
    const hash=[...new Uint8Array(hashBuf)].map(x=>x.toString(16).padStart(2,'0')).join('');
    const {data,error}=await db.from('visual_searches').insert({visitor_id:visitor(),image_hash:hash,query_text:file.name}).select().single();
    if(error)throw error;
    const fd=new FormData();fd.append('image',file);
    const vr=await fetch('https://neavvgcxakefvlvecndc.supabase.co/functions/v1/visual-match',{method:'POST',headers:{apikey:'sb_publishable_1o7-MHRPV_jKSs-xWA3odw_UhTNCuVM'},body:fd});
    const vision=await vr.json();
    if(!vr.ok)throw new Error(vision.error||'AI Vision failed');
    const a=vision.analysis||{};
    const terms=[a.likely_item_name,a.brand_or_model,a.category,...(a.search_keywords||[]),...(a.dominant_colors||[]),...(a.distinctive_features||[])].filter(Boolean).join(' ').toLowerCase();
    const candidates=items().filter(x=>x.image_url||x.image_path).map(x=>{const text=[x.title,x.description,x.location,x.category].filter(Boolean).join(' ').toLowerCase();const hits=terms.split(/\s+/).filter(t=>t.length>2&&text.includes(t)).length;return {...x,score:Math.min(99,45+hits*11)}}).sort((a,b)=>b.score-a.score).slice(0,8);
    return {hash,id:data.id,analysis:a,candidates};
  }
  async function openVisual(){const m=document.getElementById('visual');if(!m)return;m.innerHTML=`<div class="box"><div class="head"><h2>📸 Visual Search AI</h2><button class="x" onclick="closeM()">×</button></div><p>Rasmni yuboring — AI buyum turi, ranglari, model/brend va ajralib turuvchi belgilarni tahlil qiladi.</p><input id="vpro" type="file" accept="image/*"><div id="vout" class="list"></div></div>`;vpro.onchange=async()=>{if(!vpro.files[0])return;vout.innerHTML='<div class="match">⏳ AI rasmni tahlil qilmoqda...</div>';try{const r=await visualPro(vpro.files[0]);const a=r.analysis||{};vout.innerHTML=`<div class="match"><div class="score">AI Match</div><b>${esc(a.likely_item_name||a.category||'Buyum')}</b><br>Rang: ${esc((a.dominant_colors||[]).join(', '))}<br>Model/brend: ${esc(a.brand_or_model||'aniqlanmadi')}<br><small>${esc((a.distinctive_features||[]).join(', '))}</small></div>`+(r.candidates.length?r.candidates.map(x=>`<div class="listItem">📷 <b>${esc(x.title)}</b> · ${esc(x.location)} · <b>${x.score}%</b></div>`).join(''):'<div class="listItem">Mos e’lon topilmadi.</div>')}catch(e){vout.innerHTML='<div class="alert">❌ AI Visual Search ishlamadi: '+esc(e.message)+'</div>'}};}
  async function liveMap(){const map=document.querySelector('.map');if(!map)return;const {data}=await db.from('items').select('id,title,type,location,latitude,longitude').eq('status','active').limit(300);const rows=(data||[]).filter(x=>x.latitude!=null&&x.longitude!=null);map.innerHTML='';if(!rows.length){map.innerHTML='<div style="display:grid;place-items:center;height:100%;color:#667085">📍 Hozircha geo-lokatsiyali e’lon yo‘q</div>';return;}const lats=rows.map(x=>+x.latitude),lons=rows.map(x=>+x.longitude),minLat=Math.min(...lats),maxLat=Math.max(...lats),minLon=Math.min(...lons),maxLon=Math.max(...lons);rows.forEach(x=>{const p=document.createElement('button');p.textContent=x.type==='found'?'🟢':'🔴';p.title=x.title;p.style.cssText=`position:absolute;left:${8+(+x.longitude-minLon)/Math.max(.0001,maxLon-minLon)*84}%;top:${88-(+x.latitude-minLat)/Math.max(.0001,maxLat-minLat)*76}%;transform:translate(-50%,-50%);border:0;background:transparent;font-size:27px`;map.appendChild(p)})}
  window.findoOpenVisualPro=openVisual;window.findoLiveMap=liveMap;setTimeout(liveMap,1600);window.addEventListener('findo:items-updated',liveMap);
})();