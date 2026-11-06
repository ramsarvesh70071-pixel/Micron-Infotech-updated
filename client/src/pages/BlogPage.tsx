import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useList } from "../hooks/useApi";
import { getBlogs } from "../services/api";
import { formatDate } from "../lib/adapters";
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowRight, 
  Search, 
  TrendingUp, 
  BookOpen, 
  Sparkles,
  Tag
} from "lucide-react";
import TopBanner from "../components/TopBanner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EnrollModal from "../components/EnrollModal";
import SearchModal from "../components/SearchModal";


export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const blogsQ = useList<any>(() => getBlogs());
  const BLOG_POSTS = blogsQ.items.map((b: any) => ({ ...b, id: b._id, date: formatDate(b.publishedAt) }));
  const categories = ["All", ...Array.from(new Set<string>(BLOG_POSTS.map((p: any) => p.category)))];

  const filteredPosts = BLOG_POSTS.filter((p: any) => {
    const matchesCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchesQuery = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const featuredPost = BLOG_POSTS.find((p: any) => p.featured) || BLOG_POSTS[0];

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-[#2E2EF2] selection:text-white">
      <TopBanner onSelectCourse={() => setEnrollModalOpen(true)} />
      <Navbar
        onOpenSearch={() => setSearchModalOpen(true)}
        onCallClick={() => setEnrollModalOpen(true)}
      />

      <main className="flex-1 pb-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50/70 via-white to-white py-12 lg:py-16 border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-xs font-bold text-[#2E2EF2]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>MicronInfoTech Knowledge Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Tech Career Guides, Insights & <span className="text-[#2E2EF2]">Placement Tips</span>
            </h1>
            <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600">
              Expert articles, tech tutorials, salary benchmarks, and interview preparation strategies curated by MicronInfoTech faculty and industry veterans.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto pt-4">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles on React, DevOps, AI, Interviews..."
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:border-[#2E2EF2] text-sm shadow-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#2E2EF2] text-white shadow-xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        {selectedCategory === "All" && !searchQuery && featuredPost && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <div className="rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 aspect-video lg:aspect-auto lg:h-[380px] overflow-hidden">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="lg:col-span-5 p-6 sm:p-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>Featured Article</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 hover:text-[#2E2EF2] transition-colors leading-snug">
                  {featuredPost.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 line-clamp-3">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span className="font-semibold text-slate-800">{featuredPost.author}</span>
                  <span>•</span>
                  <span>{featuredPost.date}</span>
                  <span>•</span>
                  <span>{featuredPost.readTime}</span>
                </div>
                <Link
                  to={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#2E2EF2] hover:underline pt-2 cursor-pointer"
                >
                  <span>Read Full Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Post Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {blogsQ.loading && <p className="text-center text-sm text-slate-500 py-6">Loading articles...</p>}
          {blogsQ.error && <p className="text-center text-sm text-red-600 py-6">{blogsQ.error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post: any) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[11px] font-bold text-slate-800 shadow-xs">
                      {post.category}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime}</span>
                      <span>•</span>
                      <span>{post.date}</span>
                    </div>

                    <h3 className="font-extrabold text-base text-slate-900 group-hover:text-[#2E2EF2] transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between mt-3 text-xs">
                  <span className="font-semibold text-slate-700">{post.author}</span>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-[#2E2EF2] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span>Read More</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-16 space-y-3">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-base text-slate-700">No articles found matching "{searchQuery}"</h3>
              <p className="text-xs text-slate-500">Try searching for other keywords like "React", "DevOps", or "AI".</p>
            </div>
          )}
        </section>
      </main>

      <Footer />

      <EnrollModal
        isOpen={enrollModalOpen}
        onClose={() => setEnrollModalOpen(false)}
        initialCourse="Career Guidance"
      />
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </div>
  );
}
