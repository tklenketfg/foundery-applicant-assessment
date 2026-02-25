import Link from "next/link";

export default function ThanksPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-3xl font-bold">Thanks for your submission.</h1>
      <p className="mt-4 text-slate-700">Our team will review your responses and typically follow up within 5–10 business days.</p>
      <Link href="/" className="mt-8 inline-block rounded-md bg-brand px-4 py-2 text-white">Back to home</Link>
    </main>
  );
}
