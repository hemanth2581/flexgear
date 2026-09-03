import React from 'react';
import Link from 'next/link';
import { BookOpen, Clock, ArrowRight, User, Tag } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cinematography Insights & Rigging Guides | FlexGear',
  description: 'Masterclass cinema gear guides, camera comparisons, lighting tutorials, and lens shoot-outs from industry DPs and gaffers.',
};

const blogPosts = [
  {
    slug: 'sony-fx3-solo-cinema-rig-guide',
    title: 'How to Rig the Sony FX3 for Solo Run-and-Gun Cinema Commercials',
    excerpt: 'Step-by-step masterclass on optimizing the FX3 with V-mount power distribution, wireless video transmitters, and custom S-Cinetone exposure profiles.',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    category: 'Rigging & Power',
    author: 'Vikram Sundaram (Head of Camera Operations)',
    readTime: '6 min read',
    date: 'Aug 28, 2026',
  },
  {
    slug: 'top-5-cinema-lenses-2026',
    title: 'Top 5 Cinema Lenses Every Cinematographer Should Rent in 2026',
    excerpt: 'An optical comparison between full-frame cine primes, fast zooms, and modern anamorphic glass for digital sensors.',
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800&auto=format&fit=crop&q=80',
    category: 'Optics & Lenses',
    author: 'Aarav Nair (Technical Director)',
    readTime: '8 min read',
    date: 'Aug 24, 2026',
  },
  {
    slug: 'location-lighting-aputure-600d-guide',
    title: 'Lighting On Location: How to Master Aputure 600d Pro & Diffusers',
    excerpt: 'Learn how to shape daylight, punch through soft silks, and simulate sunbeams through window frames with high-power COB LEDs.',
    image: 'https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?w=800&auto=format&fit=crop&q=80',
    category: 'Studio & Location Lighting',
    author: 'Rhea Sharma (Gaffer & Lighting Designer)',
    readTime: '5 min read',
    date: 'Aug 19, 2026',
  },
];

export default function BlogListingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            FlexGear Technical Journal
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
            Cinematography & Production Guides
          </h1>
          <p className="text-neutral-400 text-lg">
            Practical rigging blueprints, optical tests, lighting breakdowns, and workflow insights from experienced filmmakers.
          </p>
        </div>

        {/* Featured Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="group bg-neutral-900/60 border border-neutral-800 rounded-2xl overflow-hidden hover:border-amber-500/40 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/5 flex flex-col"
            >
              <div className="relative h-52 overflow-hidden bg-neutral-800">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-md border border-neutral-700/50 px-2.5 py-1 rounded-md text-xs font-medium text-amber-400 flex items-center gap-1.5">
                  <Tag className="w-3 h-3" />
                  {post.category}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-4 text-xs text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime}
                    </span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-neutral-400 text-sm line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between">
                  <span className="text-xs text-neutral-400 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-neutral-500" />
                    {post.author.split('(')[0].trim()}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    Read Article
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
