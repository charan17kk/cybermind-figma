'use client'

import { Navigation } from '../_components/Navigation'
import { Target, Users, Zap, Globe, Award, Heart, TrendingUp, Shield } from 'lucide-react'

export default function AboutUsPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900">Our Story</h1>
            <p className="mt-2 text-gray-600">A compact team building tools for modern engineering orgs to hire faster and better.</p>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 border border-gray-100 rounded-2xl shadow-sm">
              <h3 className="text-lg font-semibold">What we build</h3>
              <p className="mt-2 text-sm text-gray-600">Lightweight hiring tools focused on speed, fairness, and developer experience.</p>
            </div>
            <div className="p-6 border border-gray-100 rounded-2xl shadow-sm">
              <h3 className="text-lg font-semibold">How we work</h3>
              <p className="mt-2 text-sm text-gray-600">Small teams, rapid experiments, shipping weekly to learn from real customers.</p>
            </div>
            <div className="p-6 border border-gray-100 rounded-2xl shadow-sm">
              <h3 className="text-lg font-semibold">Our values</h3>
              <p className="mt-2 text-sm text-gray-600">Pragmatism, empathy, and continuous improvement guide our decisions.</p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">People behind the product</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['Alice', 'Ravi', 'Mei'].map((name, i) => (
                <div key={name} className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm text-center">
                  <div className="text-4xl mb-3">👩‍💻</div>
                  <h3 className="font-semibold">{name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{i === 0 ? 'Product' : i === 1 ? 'Engineering' : 'Design'}</p>
                </div>
              ))}
            </div>
          </section>

          <footer className="mt-12 text-center text-gray-600">
            <small>We are focused on building tools that scale with your team.</small>
          </footer>
        </div>
      </main>
    </>
  )
}
