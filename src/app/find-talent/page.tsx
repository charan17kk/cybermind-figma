'use client'

import { Navigation } from '../_components/Navigation'
import { Search, Filter, MapPin, Star, Award, Code, Palette, BarChart3, Users, Shield, Clock } from 'lucide-react'

export default function FindTalentPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-white pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900">Hire on Demand</h1>
            <p className="mt-2 text-gray-600">Fast access to freelance and full-time professionals matched to your brief.</p>
          </header>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 border border-gray-100 rounded-2xl shadow-sm">
              <h3 className="text-lg font-semibold">Short-term contracts</h3>
              <p className="mt-2 text-sm text-gray-600">Access contractors for 3-6 month projects with vetted reviews.</p>
            </div>
            <div className="p-6 border border-gray-100 rounded-2xl shadow-sm">
              <h3 className="text-lg font-semibold">Dedicated teams</h3>
              <p className="mt-2 text-sm text-gray-600">Hire managed teams for accelerated product delivery.</p>
            </div>
            <div className="p-6 border border-gray-100 rounded-2xl shadow-sm">
              <h3 className="text-lg font-semibold">Technical interviews</h3>
              <p className="mt-2 text-sm text-gray-600">Run skill-focused interviews and coding assessments in-platform.</p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Featured Candidates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">Candidate #{i + 1}</h3>
                      <p className="text-sm text-gray-600 mt-1">Full Stack Engineer • Remote</p>
                    </div>
                    <div className="text-sm font-medium text-gray-700">₹80k</div>
                  </div>
                  <p className="mt-3 text-sm text-gray-700">Experience across React, Node.js and cloud deployments.</p>
                </div>
              ))}
            </div>
          </section>

          <footer className="mt-12 text-center text-gray-600">
            <small>Post a brief and get matched within 24 hours.</small>
          </footer>
        </div>
      </main>
    </>
  )
}
