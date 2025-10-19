'use client'

import { Navigation } from '../_components/Navigation'
import { Star, Quote, Briefcase, Users, TrendingUp, Award } from 'lucide-react'

export default function TestimonialsPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900">Voices from the Community</h1>
            <p className="mt-2 text-gray-600">Short, honest notes from people who used the platform.</p>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {[
              { name: 'Arjun', text: 'Found a role in <2 weeks. Smooth process.' },
              { name: 'Maya', text: 'Great candidate pipeline for our growth stage startup.' },
              { name: 'Kunal', text: 'Simple interface, better matches.' },
              { name: 'Priya', text: 'Transparent hiring and quick responses.' }
            ].map((t, i) => (
              <blockquote key={i} className="p-6 bg-gray-50 rounded-2xl">
                <p className="text-gray-800">“{t.text}”</p>
                <footer className="mt-4 text-sm text-gray-600">— {t.name}</footer>
              </blockquote>
            ))}
          </section>

          <footer className="mt-12 text-center text-gray-600">
            <small>Community-first feedback helps us iterate faster.</small>
          </footer>
        </div>
      </main>
    </>
  )
}
