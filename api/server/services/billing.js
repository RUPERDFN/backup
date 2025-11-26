const PLANS = new Map(); // userId -> { active, plan, updatedAt }

export async function verifyPlay({ userId, purchaseToken }){
  const active = typeof purchaseToken === 'string' && purchaseToken.endsWith('OK');
  if (active) PLANS.set(userId, { active:true, plan:'pro', updatedAt: Date.now() });
  return { active, plan: active ? 'pro' : 'free' };
}
export function getStatus(userId){
  return PLANS.get(userId) || { active:false, plan:'free' };
}
