import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { Plus, Trash2, Pencil, Loader2, Languages, Check, X, Power } from 'lucide-react';
import DecisionBadge from '@/components/agentshield/DecisionBadge';
import JsonViewer from '@/components/agentshield/JsonViewer';
import { cn } from '@/lib/utils';

const EMPTY = { policy_id: '', name: '', description: '', rule_type: 'action_match', effect: 'BLOCK', enabled: true, rule: { action: '*' } };

export default function Policies() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [arText, setArText] = useState('');
  const [translating, setTranslating] = useState(false);
  const [translated, setTranslated] = useState(null);
  const [translateError, setTranslateError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await base44.entities.Policy.list();
      setPolicies(res || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const startEdit = (p) => {
    setEditing(p.id);
    setForm({ ...p, rule: { ...(p.rule || {}) } });
  };
  const startNew = () => {
    setEditing('new');
    setForm({ ...EMPTY, policy_id: 'POL-' + String((policies.length || 0) + 1).padStart(3, '0') });
  };
  const cancel = () => { setEditing(null); setForm(EMPTY); };

  const save = async () => {
    if (!form.name || !form.policy_id || !form.effect) return;
    setSaving(true);
    try {
      if (editing === 'new') {
        await base44.entities.Policy.create(form);
      } else {
        await base44.entities.Policy.update(editing, form);
      }
      setEditing(null);
      setForm(EMPTY);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    await base44.entities.Policy.delete(id);
    await load();
  };

  const toggle = async (p) => {
    await base44.entities.Policy.update(p.id, { enabled: !p.enabled });
    await load();
  };

  const translate = async () => {
    if (!arText.trim()) return;
    setTranslating(true);
    setTranslateError(null);
    setTranslated(null);
    try {
      const res = await base44.functions.invoke('translateArabicPolicy', { text: arText });
      setTranslated(res.data.policy);
    } catch (e) {
      setTranslateError(e?.response?.data?.error || e.message || 'Translation failed');
    } finally {
      setTranslating(false);
    }
  };

  const approveTranslated = async () => {
    if (!translated) return;
    setSaving(true);
    try {
      const policy_id = 'POL-' + String((policies.length || 0) + 1).padStart(3, '0');
      await base44.entities.Policy.create({
        policy_id,
        name: translated.name,
        description: translated.description,
        rule_type: translated.rule_type,
        effect: translated.effect,
        enabled: true,
        priority: 50,
        rule: translated.rule,
      });
      setTranslated(null);
      setArText('');
      await load();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-5 md:p-8 max-w-6xl mx-auto">
      <header className="mb-6">
        <h1 className="font-heading text-2xl font-bold">Policy Management</h1>
        <p className="text-sm text-muted-foreground">Deterministic rules the Guard evaluates every planned action against.</p>
      </header>

      {/* Arabic translator */}
      <section className="mb-8 rounded-lg border border-purple-500/30 bg-purple-500/5 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Languages className="h-4 w-4 text-purple-500" />
          <h2 className="font-heading font-semibold">Policy Translator</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-3">Write a policy naturally in English. Approve the generated rule before it becomes active.</p>
        <textarea
          value={arText}
          onChange={(e) => setArText(e.target.value)}
          dir="auto"
          rows={2}
          placeholder="e.g. I do not want the assistant to delete any calendar events."
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          onClick={translate}
          disabled={translating || !arText.trim()}
          className="mt-2 inline-flex items-center gap-2 rounded-md bg-purple-600 text-white px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {translating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Languages className="h-4 w-4" />}
          Translate to Structured Rule
        </button>
        {translateError && <div className="mt-3 text-sm text-red-500">⛔ {translateError}</div>}
        {translated && (
          <div className="mt-4 rounded-md border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">Generated Policy</span>
              <div className="flex gap-2">
                <button onClick={approveTranslated} disabled={saving} className="inline-flex items-center gap-1 rounded-md bg-green-600 text-white px-3 py-1.5 text-xs font-medium disabled:opacity-50">
                  <Check className="h-3.5 w-3.5" /> Approve & Activate
                </button>
                <button onClick={() => setTranslated(null)} className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs">
                  <X className="h-3.5 w-3.5" /> Discard
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-3">
              <Mini label="Name" value={translated.name} />
              <Mini label="Type" value={translated.rule_type} />
              <Mini label="Effect" value={translated.effect} />
              <Mini label="Description" value={translated.description} />
            </div>
            <JsonViewer data={translated.rule} />
          </div>
        )}
      </section>

      <div className="flex items-center justify-between mb-3">
        <h2 className="font-heading font-semibold">Active Policies</h2>
        <button onClick={startNew} className="inline-flex items-center gap-1.5 rounded-md bg-primary text-primary-foreground px-3 py-1.5 text-sm font-medium">
          <Plus className="h-4 w-4" /> New Policy
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="space-y-3">
          {editing === 'new' && <PolicyForm form={form} setForm={setForm} onSave={save} onCancel={cancel} saving={saving} />}
          {policies.map((p) => (
            <div key={p.id} className="rounded-lg border border-border bg-card p-4">
              {editing === p.id ? (
                <PolicyForm form={form} setForm={setForm} onSave={save} onCancel={cancel} saving={saving} />
              ) : (
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-muted-foreground">{p.policy_id}</span>
                      <span className="font-semibold">{p.name}</span>
                      <DecisionBadge decision={p.effect} />
                      {!p.enabled && <span className="text-xs text-muted-foreground">(disabled)</span>}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{p.description}</p>
                    <div className="text-xs">
                      <span className="text-muted-foreground">Rule: </span>
                      <span className="font-mono">{JSON.stringify(p.rule)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => toggle(p)} title="Toggle" className="rounded-md p-2 hover:bg-muted">
                      <Power className={cn('h-4 w-4', p.enabled ? 'text-green-500' : 'text-muted-foreground')} />
                    </button>
                    <button onClick={() => startEdit(p)} title="Edit" className="rounded-md p-2 hover:bg-muted">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => remove(p.id)} title="Delete" className="rounded-md p-2 hover:bg-muted text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Mini({ label, value }) {
  return (
    <div className="rounded-md bg-muted/40 px-2 py-1.5 min-w-0">
      <div className="text-[10px] uppercase text-muted-foreground">{label}</div>
      <div className="text-sm truncate">{value || '—'}</div>
    </div>
  );
}

function PolicyForm({ form, setForm, onSave, onCancel, saving }) {
  const update = (k, v) => setForm({ ...form, [k]: v });
  const updateRule = (k, v) => setForm({ ...form, rule: { ...form.rule, [k]: v } });
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <input value={form.policy_id} onChange={(e) => update('policy_id', e.target.value)} placeholder="POL-001" className="rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
        <input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Policy name" className="rounded-md border border-input bg-background px-2 py-1.5 text-sm col-span-2" />
        <select value={form.effect} onChange={(e) => update('effect', e.target.value)} className="rounded-md border border-input bg-background px-2 py-1.5 text-sm">
          <option value="BLOCK">BLOCK</option>
          <option value="ASK_USER">ASK_USER</option>
          <option value="ALLOW">ALLOW</option>
        </select>
      </div>
      <input value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Description" className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <select value={form.rule_type} onChange={(e) => update('rule_type', e.target.value)} className="rounded-md border border-input bg-background px-2 py-1.5 text-sm">
          <option value="action_match">action_match</option>
          <option value="time_condition">time_condition</option>
          <option value="source_trust">source_trust</option>
          <option value="combined">combined</option>
          <option value="all">all</option>
        </select>
        <input value={form.rule?.action || ''} onChange={(e) => updateRule('action', e.target.value)} placeholder="rule.action (e.g. delete_event)" className="rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
        <input value={form.rule?.condition || ''} onChange={(e) => updateRule('condition', e.target.value)} placeholder="rule.condition (e.g. time > 20:00)" className="rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
      </div>
      <input value={form.rule?.source_trust || ''} onChange={(e) => updateRule('source_trust', e.target.value)} placeholder="rule.source_trust (trusted/untrusted)" className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-sm" />
      <div className="flex gap-2">
        <button onClick={onSave} disabled={saving} className="inline-flex items-center gap-1.5 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium disabled:opacity-50">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Save
        </button>
        <button onClick={onCancel} className="rounded-md border border-border px-4 py-2 text-sm">Cancel</button>
      </div>
    </div>
  );
}