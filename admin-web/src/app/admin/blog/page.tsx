'use client';

import React, { useState } from 'react';
import { BookOpen, Plus, Edit2, Trash2, Eye, CheckCircle, Clock } from 'lucide-react';

const mockAdminPosts = [
  {
    id: 'post_001',
    title: 'How to Rig the Sony FX3 for Solo Run-and-Gun Cinema Commercials',
    slug: 'sony-fx3-solo-cinema-rig-guide',
    author: 'Vikram Sundaram',
    category: 'Rigging & Power',
    status: 'PUBLISHED',
    views: 1420,
    publishedAt: '2026-08-28',
  },
  {
    id: 'post_002',
    title: 'Top 5 Cinema Lenses Every Cinematographer Should Rent in 2026',
    slug: 'top-5-cinema-lenses-2026',
    author: 'Aarav Nair',
    category: 'Optics & Lenses',
    status: 'PUBLISHED',
    views: 980,
    publishedAt: '2026-08-24',
  },
  {
    id: 'post_003',
    title: 'Lighting On Location: How to Master Aputure 600d Pro & Diffusers',
    slug: 'location-lighting-aputure-600d-guide',
    author: 'Rhea Sharma',
    category: 'Studio & Location Lighting',
    status: 'PUBLISHED',
    views: 810,
    publishedAt: '2026-08-19',
  },
];

export default function AdminBlogManagementPage() {
  const [posts, setPosts] = useState(mockAdminPosts);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Camera Guides');
  const [newAuthor, setNewAuthor] = useState('FlexGear Technical Team');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    const newPost = {
      id: `post_${Date.now()}`,
      title: newTitle,
      slug: newTitle.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-'),
      author: newAuthor,
      category: newCategory,
      status: 'PUBLISHED',
      views: 0,
      publishedAt: new Date().toISOString().split('T')[0],
    };
    setPosts([newPost, ...posts]);
    setIsCreating(false);
    setNewTitle('');
  };

  const handleDelete = (id: string) => {
    setPosts(posts.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-500" />
            Blog & Technical Guides CMS
          </h1>
          <p className="text-sm text-neutral-400">
            Publish camera tutorials, lighting breakdowns, and cinema optics guides to boost SEO and customer education.
          </p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Article
        </button>
      </div>

      {/* Creation Modal / Form */}
      {isCreating && (
        <div className="bg-neutral-900 border border-amber-500/30 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-white">Create New Field Production Guide</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">Article Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Masterclass: RED KOMODO 6K Global Shutter Shooting"
                className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Rigging & Power">Rigging & Power</option>
                  <option value="Optics & Lenses">Optics & Lenses</option>
                  <option value="Studio & Location Lighting">Studio & Location Lighting</option>
                  <option value="Audio & Field Recording">Audio & Field Recording</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Author Name</label>
                <input
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 text-sm font-semibold hover:bg-neutral-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-amber-500 text-neutral-950 text-sm font-bold hover:bg-amber-400 transition-colors"
              >
                Publish Article
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Articles Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-800 bg-neutral-950/50 text-neutral-400 text-xs uppercase tracking-wider">
                <th className="p-4">Article Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Author</th>
                <th className="p-4">Status</th>
                <th className="p-4">Views</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="p-4 font-semibold text-white max-w-xs truncate">{post.title}</td>
                  <td className="p-4 text-neutral-300">{post.category}</td>
                  <td className="p-4 text-neutral-400">{post.author}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle className="w-3 h-3" />
                      {post.status}
                    </span>
                  </td>
                  <td className="p-4 text-neutral-300">{post.views.toLocaleString()}</td>
                  <td className="p-4 text-neutral-400 text-xs">{post.publishedAt}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                      title="Delete Article"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
