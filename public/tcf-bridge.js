// Inclúyelo en tu WebApp (o sirve este archivo estático si conviene)
window.tcf = {
  getUserId(){
    if (window.Android?.getUserId) return window.Android.getUserId();
    return localStorage.getItem('uid') || (localStorage.setItem('uid', crypto.randomUUID()), localStorage.getItem('uid'));
  },
  async status(){
    const uid = this.getUserId();
    const r = await fetch(`/api/subscription-status?userId=${encodeURIComponent(uid)}`);
    return r.json();
  },
  openSubscription(){
    const uid = this.getUserId();
    if (window.Android?.openSubscription) return window.Android.openSubscription(uid);
    location.href = 'https://play.google.com/store/apps/details?id=com.thecookflow.app';
  },
  setPro(active){ if (window.Android?.setPro) window.Android.setPro(!!active); }
};

window.addEventListener('tcf:deeplink', async (e)=>{
  const {userId, token} = e.detail || {};
  if (!token) return;
  await fetch('/api/billing/verify', {
    method:'POST',
    headers:{'content-type':'application/json'},
    body: JSON.stringify({ userId, purchaseToken: token })
  });
  window.tcf.setPro(true);
});
