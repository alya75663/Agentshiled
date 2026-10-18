import React from 'react';
export default function DecisionBadge({decision}){const cls=decision==='ALLOW'?'bg-green-100 text-green-800':decision==='BLOCK'?'bg-red-100 text-red-800':'bg-amber-100 text-amber-800';return <span className={'inline-flex rounded-full px-2 py-1 text-xs font-semibold '+cls}>{decision||'UNKNOWN'}</span>}
