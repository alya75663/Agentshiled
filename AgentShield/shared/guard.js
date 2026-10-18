// Reconstructed deterministic guard. Unknown actions fail closed.
export const KNOWN_ACTIONS = new Set(['create_event','update_event','delete_event','query_calendar','send_message','noop']);
function matchesCondition(condition, action) {
  if (!condition) return true;
  const m = String(condition).match(/^time\s*(>=|<=|>|<|==)\s*(\d{1,2}:\d{2})$/i);
  if (!m) return false;
  const time = String(action?.parameters?.time || action?.time || action?.parameters?.start_time || '').slice(0,5);
  if (!/^\d{2}:\d{2}$/.test(time)) return false;
  const a = Number(time.replace(':','')), b = Number(m[2].replace(':',''));
  return ({'>':a>b,'>=':a>=b,'<':a<b,'<=':a<=b,'==':a===b})[m[1]] ?? false;
}
function policyMatches(p, action, provenance) {
  const r=p.rule||{}; const type=action.action_type||action.type;
  if (r.action && r.action!=='*' && String(r.action).toLowerCase()!==String(type).toLowerCase()) return false;
  if (r.source_trust && r.source_trust!==provenance?.trust_level) return false;
  if (r.condition && !matchesCondition(r.condition, action)) return false;
  return true;
}
export function evaluateAction(action, policies=[], provenance={trust_level:'untrusted'}) {
  const type=String(action?.action_type||action?.type||'');
  if (!KNOWN_ACTIONS.has(type)) return {decision:'BLOCK',policy_id:null,reason:`Unknown or unsupported action: ${type||'(empty)'}`};
  if (type==='delete_event' || type==='send_message') return {decision:'ASK_USER',policy_id:null,reason:'Sensitive action requires explicit approval unless a stricter policy blocks it.'};
  if (provenance?.trust_level!=='trusted' && type!=='noop') return {decision:'ASK_USER',policy_id:null,reason:'Request provenance is untrusted; confirmation is required.'};
  const enabled=(policies||[]).filter(p=>p.enabled!==false).sort((a,b)=>(a.priority??100)-(b.priority??100));
  const matched=enabled.filter(p=>policyMatches(p,action,provenance));
  const block=matched.find(p=>p.effect==='BLOCK'); if(block)return {decision:'BLOCK',policy_id:block.policy_id,reason:block.description||'Blocked by security policy'};
  const ask=matched.find(p=>p.effect==='ASK_USER'); if(ask)return {decision:'ASK_USER',policy_id:ask.policy_id,reason:ask.description||'Approval required by security policy'};
  const allow=matched.find(p=>p.effect==='ALLOW'); if(allow)return {decision:'ALLOW',policy_id:allow.policy_id,reason:allow.description||'Allowed by security policy'};
  if(type==='noop')return {decision:'ALLOW',policy_id:null,reason:'No operation to execute'};
  return {decision:'ASK_USER',policy_id:null,reason:'No explicit allow policy matched; confirmation required.'};
}
