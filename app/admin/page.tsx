import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

type SubmissionRow = Awaited<ReturnType<typeof prisma.submission.findMany>>[number];

export default async function AdminPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  if (!requireAdmin()) redirect("/admin/login");

  const status = typeof searchParams.status === "string" ? searchParams.status : undefined;
  const minScore = typeof searchParams.minScore === "string" ? Number(searchParams.minScore) : undefined;
  const q = typeof searchParams.q === "string" ? searchParams.q : undefined;

  const submissions: SubmissionRow[] = await prisma.submission.findMany({
    where: {
      ...(status ? { status: status as any } : {}),
      ...(minScore ? { totalScore: { gte: minScore } } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q } },
              { email: { contains: q } }
            ]
          }
        : {})
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          <a href="/api/admin/export" className="rounded-md border px-3 py-2">Export CSV</a>
          <form action="/api/admin/logout" method="post"><button className="rounded-md border px-3 py-2">Logout</button></form>
        </div>
      </div>

      <form className="mb-4 grid gap-2 rounded-lg bg-white p-4 shadow-sm md:grid-cols-4">
        <input name="q" placeholder="Search name/email" defaultValue={q} />
        <select name="status" defaultValue={status || ""}><option value="">All statuses</option><option value="NEW">New</option><option value="REVIEWING">Reviewing</option><option value="PASS">Pass</option><option value="MAYBE">Maybe</option><option value="NO">No</option></select>
        <input name="minScore" placeholder="Min score" type="number" defaultValue={minScore} />
        <button className="rounded-md bg-brand px-3 py-2 text-white">Filter</button>
      </form>

      <div className="overflow-auto rounded-xl bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-100 text-left">
            <tr><th className="p-2">Submitted</th><th className="p-2">Name</th><th className="p-2">Email</th><th className="p-2">Location</th><th className="p-2">Score</th><th className="p-2">Flags</th><th className="p-2">Status</th></tr>
          </thead>
          <tbody>
            {submissions.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-2">{new Date(s.createdAt).toLocaleString()}</td>
                <td className="p-2"><Link className="text-brand underline" href={`/admin/${s.id}`}>{s.name}</Link></td>
                <td className="p-2">{s.email}</td>
                <td className="p-2">{s.location}</td>
                <td className="p-2">{s.totalScore}</td>
                <td className="p-2">{(s.flags as string[]).join(", ")}</td>
                <td className="p-2">{s.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
