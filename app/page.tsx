import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-8">
        <p className="text-sm font-semibold text-brand">{siteConfig.orgName}</p>
        <h1 className="mt-2 text-4xl font-bold">{siteConfig.roleTitle}</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          {siteConfig.brands.map((brand) => (
            <span key={brand} className="rounded-full bg-slate-200 px-3 py-1 text-sm">{brand}</span>
          ))}
        </div>
      </header>

      <section className="space-y-6 rounded-xl bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-xl font-semibold">Role snapshot</h2>
          <p className="text-slate-700">High-ownership operator role across multiple sites with responsibility for metrics, team leadership, and process execution.</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">What success looks like</h2>
          <ul className="ml-5 list-disc text-slate-700">
            <li>Drives measurable growth in patient experience and operational efficiency</li>
            <li>Builds systems that scale across locations and service lines</li>
            <li>Develops people and creates accountability</li>
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-semibold">What this assessment includes</h2>
          <p className="text-slate-700">Application + short-answer screening + mini-case + writing test (20–30 minutes total).</p>
        </div>
        <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          <p>{siteConfig.disclaimers.confidentiality} {siteConfig.disclaimers.noPhi}</p>
        </div>
        <Link href="/apply" className="inline-flex rounded-md bg-brand px-5 py-3 font-medium text-white hover:bg-blue-700">Start Application</Link>
      </section>
    </main>
  );
}
