"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ProgressBar } from "@/components/ProgressBar";
import { siteConfig } from "@/config/site";

type FormState = {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  resumeUrl: string;
  referral: string;
  screening: string[];
  miniCase: { next10: string; next2h: string; nextWeek: string; metrics: string };
  writing: { teamsMessage: string; patientEmail: string };
  confirmNoPhi: boolean;
  confirmOriginal: boolean;
};

const defaultState: FormState = {
  name: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  resumeUrl: "",
  referral: "",
  screening: ["", "", "", "", ""],
  miniCase: { next10: "", next2h: "", nextWeek: "", metrics: "" },
  writing: { teamsMessage: "", patientEmail: "" },
  confirmNoPhi: false,
  confirmOriginal: false
};

const screeningQs = [
  "Describe the most complex ops role you’ve owned and what changed because of you.",
  "Describe a process/system you built from scratch. Before/after metrics?",
  "What KPIs would you want in week 1 for a multi-line practice and why?",
  "How do you handle a toxic high performer?",
  "How do you prioritize when 12 fires hit at once?"
];

export default function ApplyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(() => {
    if (typeof window === "undefined") return defaultState;
    const saved = localStorage.getItem("candidate-draft");
    return saved ? JSON.parse(saved) : defaultState;
  });

  const total = 5;
  const canNext = useMemo(() => {
    if (step === 1) return form.name && form.email && form.phone && form.location;
    if (step === 2) return form.screening.every((v) => v.trim().length > 10);
    if (step === 3) return Object.values(form.miniCase).every((v) => v.trim().length > 10);
    if (step === 4) return Object.values(form.writing).every((v) => v.trim().length > 10);
    return true;
  }, [form, step]);

  function save(next: FormState) {
    setForm(next);
    localStorage.setItem("candidate-draft", JSON.stringify(next));
  }

  async function submit() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone,
        location: form.location,
        linkedin: form.linkedin,
        resumeUrl: form.resumeUrl,
        referral: form.referral,
        answers: { screening: form.screening, miniCase: form.miniCase, writing: form.writing },
        confirmNoPhi: form.confirmNoPhi,
        confirmOriginal: form.confirmOriginal
      })
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Something went wrong.");
      setLoading(false);
      return;
    }

    localStorage.removeItem("candidate-draft");
    router.push("/thanks");
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">Application + Assessment</h1>
      <p className="mb-4 text-sm text-slate-600">{siteConfig.disclaimers.noPhi}</p>
      <ProgressBar step={step} total={total} />

      <div className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
        {step === 1 && (
          <>
            <Field label="Full name"><input value={form.name} onChange={(e) => save({ ...form, name: e.target.value })} /></Field>
            <Field label="Email"><input type="email" value={form.email} onChange={(e) => save({ ...form, email: e.target.value })} /></Field>
            <Field label="Phone"><input value={form.phone} onChange={(e) => save({ ...form, phone: e.target.value })} /></Field>
            <Field label="City/State"><input value={form.location} onChange={(e) => save({ ...form, location: e.target.value })} /></Field>
            <Field label="LinkedIn URL (optional)"><input value={form.linkedin} onChange={(e) => save({ ...form, linkedin: e.target.value })} /></Field>
            <Field label="Resume URL (optional)"><input placeholder="Paste URL to PDF/DOC" value={form.resumeUrl} onChange={(e) => save({ ...form, resumeUrl: e.target.value })} /></Field>
            <Field label="How did you hear about us? (optional)"><input value={form.referral} onChange={(e) => save({ ...form, referral: e.target.value })} /></Field>
          </>
        )}

        {step === 2 && screeningQs.map((q, idx) => (
          <Field key={q} label={q}>
            <textarea rows={4} value={form.screening[idx]} onChange={(e) => {
              const next = [...form.screening]; next[idx] = e.target.value; save({ ...form, screening: next });
            }} />
          </Field>
        ))}

        {step === 3 && (
          <>
            <p className="rounded-md bg-slate-100 p-3 text-sm">Scenario: Front desk wait times doubled, show rate dropped 12%, and patient complaints increased after staffing changes.</p>
            <Field label="1) Next 10 minutes actions"><textarea rows={4} value={form.miniCase.next10} onChange={(e) => save({ ...form, miniCase: { ...form.miniCase, next10: e.target.value } })} /></Field>
            <Field label="2) Next 2 hours actions"><textarea rows={4} value={form.miniCase.next2h} onChange={(e) => save({ ...form, miniCase: { ...form.miniCase, next2h: e.target.value } })} /></Field>
            <Field label="3) Changes for next week"><textarea rows={4} value={form.miniCase.nextWeek} onChange={(e) => save({ ...form, miniCase: { ...form.miniCase, nextWeek: e.target.value } })} /></Field>
            <Field label="4) Metrics to track immediately"><textarea rows={4} value={form.miniCase.metrics} onChange={(e) => save({ ...form, miniCase: { ...form.miniCase, metrics: e.target.value } })} /></Field>
          </>
        )}

        {step === 4 && (
          <>
            <Field label="Write the Teams message you’d send staff to align everyone today."><textarea rows={6} value={form.writing.teamsMessage} onChange={(e) => save({ ...form, writing: { ...form.writing, teamsMessage: e.target.value } })} /></Field>
            <Field label="Write the email you’d send a patient who had a poor experience."><textarea rows={6} value={form.writing.patientEmail} onChange={(e) => save({ ...form, writing: { ...form.writing, patientEmail: e.target.value } })} /></Field>
          </>
        )}

        {step === 5 && (
          <>
            <h2 className="text-xl font-semibold">Review & Submit</h2>
            <label className="flex items-start gap-2"><input type="checkbox" checked={form.confirmNoPhi} onChange={(e) => save({ ...form, confirmNoPhi: e.target.checked })} /><span>I confirm I did not include any patient PHI.</span></label>
            <label className="flex items-start gap-2"><input type="checkbox" checked={form.confirmOriginal} onChange={(e) => save({ ...form, confirmOriginal: e.target.checked })} /><span>I confirm my answers are my own.</span></label>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </>
        )}

        <div className="flex justify-between pt-2">
          <button disabled={step === 1} onClick={() => setStep((s) => Math.max(1, s - 1))} className="rounded-md border px-4 py-2 disabled:opacity-40">Back</button>
          {step < total ? (
            <button disabled={!canNext} onClick={() => setStep((s) => Math.min(total, s + 1))} className="rounded-md bg-brand px-4 py-2 text-white disabled:opacity-40">Continue</button>
          ) : (
            <button disabled={!form.confirmNoPhi || !form.confirmOriginal || loading} onClick={submit} className="rounded-md bg-brand px-4 py-2 text-white disabled:opacity-40">{loading ? "Submitting..." : "Submit"}</button>
          )}
        </div>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label>{label}</label>{children}</div>;
}
