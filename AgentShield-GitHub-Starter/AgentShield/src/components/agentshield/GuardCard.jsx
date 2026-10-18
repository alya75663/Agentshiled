import React from 'react'; import DecisionBadge from './DecisionBadge';
export default function GuardCard({guard}){if(!guard)return null;return <section className="rounded-lg border bg-card p-4"><h3 className="font-semibold mb-2">Security Guard</h3><DecisionBadge decision={guard.decision}/><p className="text-sm mt-2">{guard.reason||guard.policy_name||'No reason provided'}</p></section>}
