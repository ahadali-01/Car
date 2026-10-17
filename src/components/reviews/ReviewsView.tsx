import React, { useState } from 'react';
import { Review } from '../../types/index.js';
import { Star, CheckCircle2, MessageSquare, Plus, Filter, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api.js';

interface ReviewsViewProps {
  reviews: Review[];
  onReviewSubmitted: (newReview: Review) => void;
}

export const ReviewsView: React.FC<ReviewsViewProps> = ({ reviews, onReviewSubmitted }) => {
  const [filterRating, setFilterRating] = useState<number>(0); // 0 = all
  const [modalOpen, setModalOpen] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [vehicleBadge, setVehicleBadge] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [serviceRendered, setServiceRendered] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  const filtered = reviews.filter((r) => filterRating === 0 || r.rating === filterRating);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.submitReview({
        authorName,
        vehicleBadge,
        rating,
        comment,
        serviceRendered,
      });
      onReviewSubmitted(res);
      setMsg('Review submitted successfully! Thank you for your feedback.');
      setTimeout(() => {
        setModalOpen(false);
        setMsg('');
        setAuthorName('');
        setVehicleBadge('');
        setComment('');
        setServiceRendered('');
      }, 1500);
    } catch (err: any) {
      setMsg(err.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-xs font-mono text-[#00F0FF] uppercase mb-3">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>VERIFIED CLIENT INTELLIGENCE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-heading font-black text-white uppercase tracking-tight">
            MOTORSPORT & <span className="text-[#00F0FF]">CLIENT REVIEWS</span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base mt-2">
            Real track driver feedback, restoration ratings, and post-calibration assessments.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#0099FF] text-[#090B0E] font-heading font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.3)] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-mono uppercase text-zinc-400 flex items-center gap-1.5 mr-2">
          <Filter className="w-3.5 h-3.5 text-[#00F0FF]" /> Filter:
        </span>
        <button
          onClick={() => setFilterRating(0)}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase transition-colors ${
            filterRating === 0
              ? 'bg-[#00F0FF] text-[#090B0E] font-bold'
              : 'bg-[#12161E] text-zinc-400 hover:text-white border border-zinc-800'
          }`}
        >
          All Stars
        </button>
        {[5, 4, 3].map((star) => (
          <button
            key={star}
            onClick={() => setFilterRating(star)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase transition-colors flex items-center gap-1 ${
              filterRating === star
                ? 'bg-[#00F0FF] text-[#090B0E] font-bold'
                : 'bg-[#12161E] text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <span>{star} Stars</span>
          </button>
        ))}
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((r) => (
          <div
            key={r.id}
            className="bg-[#10141B] border border-zinc-800 hover:border-zinc-700 rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-colors shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'}`}
                    />
                  ))}
                  <span className="ml-1.5 text-xs font-mono font-bold text-white">
                    {r.rating}.0
                  </span>
                </div>

                {r.verifiedClient && (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> VERIFIED
                  </span>
                )}
              </div>

              <blockquote className="text-sm sm:text-base text-zinc-200 font-sans leading-relaxed mb-6 italic">
                "{r.comment}"
              </blockquote>
            </div>

            <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-mono">
              <div>
                <div className="font-bold text-white uppercase font-heading">{r.authorName}</div>
                <div className="text-[#00F0FF] text-[11px] mt-0.5">{r.vehicleBadge}</div>
              </div>
              <div className="text-zinc-400 text-[11px] text-right">
                <div>{r.serviceRendered}</div>
                <div>{r.createdAt}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Write Review Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg bg-[#12161E] border border-[#00F0FF]/30 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <h3 className="text-xl font-heading font-black text-white uppercase mb-1">
              Submit Customer Review
            </h3>
            <p className="text-xs font-mono text-zinc-400 mb-6">
              Share your track telemetry or vehicle service results.
            </p>

            {msg && (
              <div className="p-3 mb-4 rounded-xl bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-xs font-mono text-[#00F0FF]">
                {msg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Asad Malik"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0D11] border border-zinc-700 text-white text-sm outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Vehicle Badge</label>
                <input
                  type="text"
                  value={vehicleBadge}
                  onChange={(e) => setVehicleBadge(e.target.value)}
                  placeholder="e.g. Audi RS6 Avant"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0D11] border border-zinc-700 text-white text-sm outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Service Performed</label>
                <input
                  type="text"
                  value={serviceRendered}
                  onChange={(e) => setServiceRendered(e.target.value)}
                  placeholder="e.g. Dyno ECU Tuning"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0D11] border border-zinc-700 text-white text-sm outline-none focus:border-[#00F0FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400"
                    >
                      <Star
                        className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">Feedback *</label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Describe the precision and results..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0D11] border border-zinc-700 text-white text-sm outline-none focus:border-[#00F0FF] resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#0099FF] text-[#090B0E] font-heading font-black text-xs uppercase tracking-wider"
                >
                  {submitting ? 'Submitting...' : 'Post Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
