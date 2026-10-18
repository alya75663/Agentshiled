import React from 'react';
export default function ProvenanceCard({provenance}){return <section className="rounded-lg border bg-card p-4"><h3 className="font-semibold mb-2">Provenance</h3><pre className="text-xs whitespace-pre-wrap">{JSON.stringify(provenance||{},null,2)}</pre></section>}
