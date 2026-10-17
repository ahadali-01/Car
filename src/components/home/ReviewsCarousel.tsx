import React, { useState } from 'react';
import { Review } from '../../types/index.js';
import { Star, ChevronLeft, ChevronRight, CheckCircle2, MessageSquare, Plus, X } from 'lucide-react';
import { api } from '../../services/api.js';

interface ReviewsCarouselProps {
  reviews: Review[];
  onReviewSubmitted: (newReview: Review) => void;
}

export const ReviewsCarousel: React.FC<ReviewsCarouselProps> = ({ reviews, onReviewSubmitted }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [authorName, setAuthorName] = useState('');
  const [vehicleBadge, setVehicleBadge] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [serviceRendered, setServiceRendered] = useState('');
  const [msg, setMsg] = useState('');

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

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
      setMsg('Review submitted successfully! Thank you.');
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

  const current = reviews[currentIndex] || reviews[0];

  return (
    <section className="py-16 sm:py-24 bg-[#0A0D11] border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F0FF]/10 border border-[#00F0FF]/30 text-xs font-mono text-[#00F0FF] uppercase mb-3">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>TESTIMONIALS & AUDIT LOGS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-white tracking-tight uppercase">
              CLIENT TESTIMONIALS & <span className="text-[#00F0FF]">VERIFIED LOGS</span>
            </h2>
            <p className="text-zinc-400 text-sm mt-1">
              Feedback from performance drivers and collectors across Pakistan.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-mono text-zinc-200 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-[#00F0FF]" />
              <span>Submit Feedback</span>
            </button>
            <div className="flex items-center gap-1">
              <button
                onClick={prevSlide}
                className="p-2 rounded-xl bg-[#141A22] border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors"
                aria-label="Previous Review"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-xl bg-[#141A22] border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white transition-colors"
                aria-label="Next Review"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Card */}
        {current && (
          <div className="relative bg-[#10141B] border border-zinc-800 rounded-3xl p-8 sm:p-12 shadow-2xl max-w-4xl mx-auto">
            {/* Top row: stars + verified badge */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < current.rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'}`}
                  />
                ))}
                <span className="ml-2 font-mono text-sm font-bold text-white">
                  {current.rating}.0
                </span>
              </div>

              {current.verifiedClient && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>VERIFIED WORKSHOP CLIENT</span>
                </div>
              )}
            </div>

            {/* Comment */}
            <blockquote className="text-lg sm:text-xl font-heading text-zinc-100 leading-relaxed italic mb-8">
              "{current.comment}"
            </blockquote>

            {/* Author info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-zinc-800/80">
              <div>
                <h4 className="text-base font-heading font-black text-white uppercase">
                  {current.authorName}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-[11px] font-mono text-[#00F0FF] border border-zinc-700">
                    {current.vehicleBadge}
                  </span>
                  <span className="text-xs text-zinc-400 font-sans">
                    • {current.serviceRendered}
                  </span>
                </div>
              </div>

              <div className="text-xs font-mono text-zinc-400">
                Logged: {current.createdAt}
              </div>
            </div>

            {/* Carousel dots */}
            <div className="flex justify-center gap-1.5 mt-8">
              {reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === currentIndex ? 'w-6 bg-[#00F0FF]' : 'w-2 bg-zinc-700'
                  }`}
                  aria-label={`Jump to review ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Review Submission Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg bg-[#12161E] border border-[#00F0FF]/30 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-heading font-black text-white uppercase mb-1">
              Submit Workshop Feedback
            </h3>
            <p className="text-xs font-mono text-zinc-400 mb-6">
              Share your track and workshop service experience.
            </p>

            {msg && (
              <div className="p-3 mb-4 rounded-xl bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-xs font-mono text-[#00F0FF]">
                {msg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0D11] border border-zinc-700 focus:border-[#00F0FF] text-white text-sm outline-none"
                  placeholder="e.g. Asad Malik"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Vehicle Make & Model
                </label>
                <input
                  type="text"
                  value={vehicleBadge}
                  onChange={(e) => setVehicleBadge(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0D11] border border-zinc-700 focus:border-[#00F0FF] text-white text-sm outline-none"
                  placeholder="e.g. Audi RS6 Avant"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Service Rendered
                </label>
                <input
                  type="text"
                  value={serviceRendered}
                  onChange={(e) => setServiceRendered(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0D11] border border-zinc-700 focus:border-[#00F0FF] text-white text-sm outline-none"
                  placeholder="e.g. Dyno ECU Tuning"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Rating (1-5 Stars)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-zinc-600'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1">
                  Experience / Review Comments *
                </label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0D11] border border-zinc-700 focus:border-[#00F0FF] text-white text-sm outline-none resize-none"
                  placeholder="Describe the precision and results of the service..."
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
    </section>
  );
};
