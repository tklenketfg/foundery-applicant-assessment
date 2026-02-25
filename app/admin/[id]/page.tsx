import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export default async function SubmissionDetail({ params }: { params: { id: string } }) {
  if (!requireAdmin()) redirect("/admin/login");
  const submission = await prisma.submission.findUnique({ where: { id: params.id } });
  if (!submission) notFound();

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">{submission.name}</h1>
      <p className="mb-6 text-sm text-slate-600">{submission.email} • {submission.phone} • {submission.location}</p>

      <section className="mb-4 rounded-lg bg-white p-4 shadow-sm">
        <h2 className="mb-2 font-semibold">Score Breakdown</h2>
        <pre className="overflow-auto rounded bg-slate-100 p-3 text-sm">{JSON.stringify(submission.rubricScores, null, 2)}</pre>
        <p className="mt-2 font-medium">Total Score: {submission.totalScore}</p>
        <p>Flags: {(submission.flags as string[]).join(", ")}</p>
      </section>

      <section className="mb-4 rounded-lg bg-white p-4 shadow-sm">
        <h2 className="mb-2 font-semibold">Answers</h2>
        <pre className="overflow-auto rounded bg-slate-100 p-3 text-sm">{JSON.stringify(submission.answers, null, 2)}</pre>
      </section>

      <form action={`/api/admin/submissions/${submission.id}`} method="post" className="space-y-3 rounded-lg bg-white p-4 shadow-sm">
        <h2 className="font-semibold">Admin Review</h2>
        <select name="status" defaultValue={submission.status}>
          <option value="NEW">New</option><option value="REVIEWING">Reviewing</option><option value="PASS">Pass</option><option value="MAYBE">Maybe</option><option value="NO">No</option><option value="ARCHIVED">Archived</option>
        </select>
        <textarea name="adminNotes" rows={5} defaultValue={submission.adminNotes || ""} />
        <button className="rounded-md bg-brand px-4 py-2 text-white">Save Review</button>
      </form>
    </main>
  );
}
