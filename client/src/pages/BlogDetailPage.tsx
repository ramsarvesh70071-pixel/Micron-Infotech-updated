import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Clock, User } from "lucide-react";
import TopBanner from "../components/TopBanner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import EnrollModal from "../components/EnrollModal";
import SearchModal from "../components/SearchModal";
import { DataBoundary } from "../components/DataState";
import { useFetch } from "../hooks/useApi";
import { getBlogBySlug } from "../services/api";
import { formatDate } from "../lib/adapters";

/** Renders blog content written in the admin panel: blank line = new paragraph, "## " = sub heading. */
function renderContent(text: string) {
  return text
    .split(/\n{2,}/)
    .map((block, i) => {
      const t = block.trim();
      if (!t) return null;
      if (t.startsWith("## ")) return <h2 key={i} className="text-xl font-black text-slate-900 mt-6">{t.slice(3)}</h2>;
      return <p key={i} className="leading-relaxed text-slate-700">{t}</p>;
    });
}

export default function BlogDetailPage() {
  const { slug = "" } = useParams();
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const q = useFetch<any>(() => getBlogBySlug(slug), (r) => r.data, [slug]);
  const post = q.data;

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      <TopBanner onSelectCourse={() => setEnrollModalOpen(true)} />
      <Navbar onOpenSearch={() => setSearchModalOpen(true)} onCallClick={() => setEnrollModalOpen(true)} />
      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-5">
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2E2EF2] hover:underline">
            <ArrowLeft className="w-3.5 h-3.5" /> All articles
          </Link>
          <DataBoundary loading={q.loading} error={q.error} empty={!post} emptyLabel="Article not found." onRetry={q.reload}>
            {post && (
              <>
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#2E2EF2] bg-blue-50 px-2.5 py-1 rounded-full">{post.category}</span>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">{post.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  {post.author && <span className="inline-flex items-center gap-1"><User className="w-3.5 h-3.5" />{post.author}</span>}
                  <span>{formatDate(post.publishedAt)}</span>
                  {post.readTime && <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{post.readTime}</span>}
                </div>
                {post.image && <img src={post.image} alt={post.title} className="w-full rounded-2xl object-cover max-h-[420px]" />}
                <p className="text-base font-medium text-slate-800">{post.excerpt}</p>
                <div className="space-y-4 text-sm sm:text-[15px]">{post.content ? renderContent(post.content) : null}</div>
                <div className="pt-6 border-t border-slate-100">
                  <button onClick={() => setEnrollModalOpen(true)} className="px-5 py-2.5 rounded-lg bg-[#2E2EF2] text-white text-xs font-bold hover:bg-[#2525d4] cursor-pointer">
                    Talk to a Counsellor
                  </button>
                </div>
              </>
            )}
          </DataBoundary>
        </article>
      </main>
      <Footer />
      <EnrollModal isOpen={enrollModalOpen} onClose={() => setEnrollModalOpen(false)} />
      <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </div>
  );
}
