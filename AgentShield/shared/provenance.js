// Reconstructed from the code excerpt shared in the conversation. Treat browser-supplied trust as untrusted.
const UNTRUSTED_SOURCES = new Set(['external_prompt_injection','unknown_sender','external','untrusted','demo_injection','demo_suspicious','incoming_message']);
export function deriveProvenance(source, trustLevel) {
  const src = typeof source === 'string' ? source : 'unknown_sender';
  // Never trust a browser-provided trusted label. Trusted sources must be established server-side.
  const trust = UNTRUSTED_SOURCES.has(src) ? 'untrusted' : (trustLevel === 'trusted' && src === 'demo_safe' ? 'trusted' : 'untrusted');
  return { source: src, source_type: trust === 'trusted' ? 'internal' : 'external', trust_level: trust, timestamp: new Date().toISOString() };
}
