import express from 'express';
import {OAuth2Client} from 'google-auth-library';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const __dirname=path.dirname(fileURLToPath(import.meta.url));
const app=express(); const port=process.env.PORT||8080;
const expectedAudience=process.env.IAP_EXPECTED_AUDIENCE;
const allowed=(process.env.CRM_ALLOWED_EMAILS||'').split(',').map(x=>x.trim().toLowerCase()).filter(Boolean);
const oauth=new OAuth2Client();
app.disable('x-powered-by'); app.use(express.json({limit:'100kb'}));
app.use((_req,res,next)=>{res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');res.setHeader('X-Frame-Options','DENY');next();});
async function requireIAP(req,res,next){
  try{
    if(!expectedAudience) return res.status(503).send('CRM not configured: IAP_EXPECTED_AUDIENCE is missing.');
    if(allowed.length===0) return res.status(503).send('CRM not configured: CRM_ALLOWED_EMAILS is empty. Access is closed until an explicit allowlist is configured.');
    const assertion=req.get('x-goog-iap-jwt-assertion');
    if(!assertion) return res.status(401).send('IAP authentication required.');
    const keys=await oauth.getIapPublicKeys();
    const ticket=await oauth.verifySignedJwtWithCertsAsync(assertion,keys.pubkeys,expectedAudience,['https://cloud.google.com/iap']);
    const payload=ticket.getPayload();
    if(!payload?.email||!payload?.sub) return res.status(403).send('IAP identity is incomplete.');
    const email=String(payload.email).toLowerCase();
    if(!allowed.includes(email)) return res.status(403).send('Your identity is not authorised for this CRM.');
    req.iapUser={email,subject:payload.sub}; next();
  }catch(err){ console.error('IAP verification failed:',err.message); return res.status(401).send('Unable to verify IAP identity.');}
}
app.get('/healthz',(_req,res)=>res.status(200).send('ok'));
app.use('/crm',requireIAP,express.static(path.join(__dirname,'public'),{index:'index.html',fallthrough:false}));
app.get('/',(_req,res)=>res.redirect('/crm/'));
app.listen(port,()=>console.log(`THODS CRM listening on ${port}`));
