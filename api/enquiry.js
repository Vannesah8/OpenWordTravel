const crypto = require('node:crypto');
const inbox = 'hello@openworldtravel.tours';
module.exports = async (req,res) => {
  res.setHeader('Cache-Control','no-store');
  if(req.method==='GET') return res.status(200).json({siteKey:process.env.TURNSTILE_SITE_KEY||'',enabled:!!(process.env.RESEND_API_KEY&&process.env.TURNSTILE_SECRET_KEY&&process.env.TURNSTILE_SITE_KEY)});
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  if(!process.env.RESEND_API_KEY||!process.env.TURNSTILE_SECRET_KEY||!process.env.TURNSTILE_SITE_KEY) return res.status(503).json({error:'Online sending is not configured yet.'});
  try {
    const b=typeof req.body==='string'?JSON.parse(req.body):req.body;
    if(!b||typeof b!=='object'||JSON.stringify(b).length>16000) return res.status(400).json({error:'Invalid enquiry.'});
    const fields={name:100,email:254,experience:150,country:100,date:30,people:3,budget:80,notes:2000};
    const v={};
    for(const [k,max] of Object.entries(fields)){if(typeof b[k]!=='string'||b[k].length>max)return res.status(400).json({error:'Invalid enquiry fields.'});v[k]=b[k].trim();}
    if(!v.name||!v.experience||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)||!/^\d+$/.test(v.people)||+v.people<1||+v.people>30||typeof b.token!=='string'||b.token.length>2048||!/^OWT-[0-9]{8}-[A-Z0-9]{5}$/.test(b.ref||''))return res.status(400).json({error:'Please check your enquiry details.'});
    const verify=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret:process.env.TURNSTILE_SECRET_KEY,response:b.token}),signal:AbortSignal.timeout(10000)});
    const check=await verify.json(); if(!check.success)return res.status(400).json({error:'Please complete the security check again.'});
    const ref=b.ref;
    const sender=process.env.RESEND_FROM||'OpenWorld Travel <hello@openworldtravel.tours>';
    const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    const details=Object.entries(v).map(([k,val])=>k+': '+(val||'Not specified')).join('\n');
    const send=async (payload,key)=>{const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json','Idempotency-Key':key},body:JSON.stringify({from:sender,...payload}),signal:AbortSignal.timeout(15000)});return r.ok;};
    const id=crypto.createHash('sha256').update(ref+v.email).digest('hex');
    const accepted=await send({to:[inbox],reply_to:v.email,subject:'New travel enquiry '+ref,text:details+'\nReference: '+ref},id+'-office');
    if(!accepted)return res.status(502).json({error:'The enquiry could not be sent. Please retry or email us directly.'});
    let ack=false;
    try{ack=await send({to:[v.email],reply_to:inbox,subject:'Your OpenWorld Travel enquiry '+ref,text:'Dear '+v.name+', we received your enquiry for '+v.experience+'. Reference: '+ref+'. Our team will be in touch. This is not a confirmed booking.',html:'<div style="font-family:Arial;color:#071d35"><div style="background:#071d35;color:#d3b170;padding:24px"><h2>OpenWorld Travel</h2>One World. Countless Experiences.</div><div style="padding:24px"><p>Dear '+esc(v.name)+',</p><p>Thank you for your enquiry about '+esc(v.experience)+'.</p><p><strong>Reference: '+esc(ref)+'</strong></p><p>Our team will be in touch. This is not a confirmed booking.</p><p>OpenWorld Travel</p></div></div>'},id+'-customer');}catch{}
    return res.status(200).json({received:true,acknowledgement:ack,ref});
  }catch{return res.status(503).json({error:'Online sending is temporarily unavailable. Please retry or contact us directly.'});}
};
