import React from 'react';
export default function Timeline({timeline=[]}){return <section className="rounded-lg border bg-card p-4"><h3 className="font-semibold mb-2">Workflow timeline</h3><ol className="space-y-2">{(Array.isArray(timeline)?timeline:[]).map((s,i)=><li key={i} className="text-sm">{s.label||s.step||`Step ${i+1}`} — {s.status||'complete'}</li>)}</ol></section>}
