'use client'

import { Navigation } from '../_components/Navigation'
import { Search, Filter, MapPin, Clock, DollarSign, Briefcase, TrendingUp, Users } from 'lucide-react'

export default function FindJobsPage() {
  // New simplified and distinctive layout
  const spotlight = [
    { title: 'Lightning Hires', desc: 'Roles that emphasize speed-of-hire for urgent engineering needs.' },
    { title: 'Greenfield Projects', desc: 'Work on brand new products and ship user-facing features quickly.' },
    { title: 'Senior IC Roles', desc: 'High-impact individual contributor roles across backend and infra.' }
  ]

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900">Quick Matches</h1>
            <p className="mt-2 text-gray-600">Jobs surfaced by skill-match and recent hiring activity.</p>
          </header>

          <section className="grid gap-6 md:grid-cols-3 mb-12">
            {spotlight.map(s => (
              <div key={s.title} className="p-6 border border-gray-100 rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{s.desc}</p>
                <div className="mt-4 flex gap-2">
                  <span className="px-3 py-1 text-xs bg-gray-100 rounded-full">Remote</span>
                  <span className="px-3 py-1 text-xs bg-gray-100 rounded-full">Mid-Senior</span>
                </div>
              </div>
            ))}
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Featured Openings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <article key={i} className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
                  <h3 className="font-semibold">Senior Engineer — Platform</h3>
                  <p className="text-sm text-gray-600 mt-1">Company — Remote — ₹1.8L/month</p>
                  <p className="mt-3 text-sm text-gray-700">Work on observability and scaling challenges. 8+ years preferred.</p>
                  <div className="mt-4">
                    <a className="text-sm font-medium text-blue-600" href="#">View role</a>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <footer className="mt-12 text-center text-gray-600">
            <small>Listings updated hourly based on verified employer activity.</small>
          </footer>
        </div>
      </main>
    </>
  )
}
