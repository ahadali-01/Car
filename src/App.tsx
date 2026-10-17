/**
 * AUTO CRAFT 3D - Precision Performance Workshop
 * Developed & Designed by Ahad Ali Nisar
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar.js';
import { Footer } from './components/common/Footer.js';
import { DeveloperModal } from './components/common/DeveloperModal.js';
import { AuthModal } from './components/auth/AuthModal.js';
import { WorkshopHeroScene } from './three/WorkshopHeroScene.js';
import { StatsSection } from './components/home/StatsSection.js';
import { FeaturedServices } from './components/home/FeaturedServices.js';
import { WhyChooseUs } from './components/home/WhyChooseUs.js';
import { ProcessTimeline } from './components/home/ProcessTimeline.js';
import { BeforeAfterSlider } from './components/home/BeforeAfterSlider.js';
import { FeaturedProjects } from './components/home/FeaturedProjects.js';
import { ReviewsCarousel } from './components/home/ReviewsCarousel.js';
import { PerformanceBanner } from './components/home/PerformanceBanner.js';
import { FaqAccordion } from './components/home/FaqAccordion.js';
import { ServicesView } from './components/services/ServicesView.js';
import { CostEstimatorView } from './components/pricing/CostEstimatorView.js';
import { BookingWizard } from './components/appointments/BookingWizard.js';
import { GalleryView } from './components/gallery/GalleryView.js';
import { ReviewsView } from './components/reviews/ReviewsView.js';
import { AboutWorkshopView } from './components/about/AboutWorkshopView.js';
import { ContactView } from './components/contact/ContactView.js';
import { CustomerDashboard } from './components/customer/CustomerDashboard.js';
import { AdminDashboard } from './components/admin/AdminDashboard.js';
import { PrivacyPolicy } from './components/legal/PrivacyPolicy.js';
import { TermsOfService } from './components/legal/TermsOfService.js';
import { NotFoundView } from './components/common/NotFoundView.js';
import { api, authStorage } from './services/api.js';
import { User, WorkshopService, GalleryItem, Review, WorkshopStatusResponse } from './types/index.js';
import { updateSEO, getPageMetadata } from './lib/seo.js';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(authStorage.getUser());
  const [devModalOpen, setDevModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // App data state
  const [statusData, setStatusData] = useState<WorkshopStatusResponse | null>(null);
  const [services, setServices] = useState<WorkshopService[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Cross-view state transfer (e.g. from estimator to booking wizard)
  const [bookingPrefill, setBookingPrefill] = useState<any>(null);
  const [estimatorPreselectedServiceId, setEstimatorPreselectedServiceId] = useState<string | undefined>(undefined);

  // Initial data loading
  useEffect(() => {
    const loadData = async () => {
      try {
        const [stat, srvs, gal, revs] = await Promise.all([
          api.getStatus().catch(() => null),
          api.getServices().catch(() => []),
          api.getGallery().catch(() => []),
          api.getReviews().catch(() => []),
        ]);
        if (stat) setStatusData(stat);
        setServices(srvs);
        setGalleryItems(gal);
        setReviews(revs);

        // Verify active token if present
        if (authStorage.getToken()) {
          api.getMe()
            .then((res) => {
              setCurrentUser(res.user);
              authStorage.setUser(res.user);
            })
            .catch(() => {
              authStorage.clear();
              setCurrentUser(null);
            });
        }
      } catch (err) {
        console.error('Initial data fetch error:', err);
      } finally {
        setLoadingInitial(false);
      }
    };

    loadData();
  }, []);

  // Dynamically update document title and meta tags based on current view
  useEffect(() => {
    const meta = getPageMetadata(currentView);
    updateSEO(meta);
  }, [currentView]);

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    if (currentView === 'dashboard' || currentView === 'admin') {
      handleNavigate('home');
    }
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'ADMIN') {
      handleNavigate('admin');
    } else {
      handleNavigate('dashboard');
    }
  };

  const handleSelectServiceFromHome = (service: WorkshopService) => {
    setBookingPrefill({
      category: 'sports',
      serviceIds: [service.id],
      isPriority: false,
      make: 'Porsche',
      model: '911',
      year: 2023,
    });
    handleNavigate('booking');
  };

  const handleCalculateCostForService = (serviceId: string) => {
    setEstimatorPreselectedServiceId(serviceId);
    handleNavigate('estimator');
  };

  const handleProceedToBookingFromEstimator = (config: any) => {
    setBookingPrefill(config);
    handleNavigate('booking');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0D0F12] text-zinc-100 selection:bg-[#00F0FF]/30 selection:text-white">
      {/* Global Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenDeveloperModal={() => setDevModalOpen(true)}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1">
        {currentView === 'home' && (
          <div className="animate-fade-in">
            {/* 3D WebGL Hero Scene */}
            <WorkshopHeroScene
              onExploreServices={() => handleNavigate('services')}
              onBookSlot={() => handleNavigate('booking')}
            />

            {/* Real-Time Telemetry Stats */}
            <StatsSection statusData={statusData} />

            {/* Featured Services */}
            <FeaturedServices
              services={services}
              onSelectService={handleSelectServiceFromHome}
              onExploreAll={() => handleNavigate('services')}
              onCalculateCost={handleCalculateCostForService}
            />

            {/* Engineering Pillars */}
            <WhyChooseUs />

            {/* 4-Step Process Timeline */}
            <ProcessTimeline />

            {/* Interactive Before/After Restoration Slider */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <BeforeAfterSlider
                beforeImage="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80"
                afterImage="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80"
                beforeLabel="ORIGINAL INTAKE (OXIDATION & CHIPS)"
                afterLabel="CONCOURS 9H CERAMIC RESTORATION"
                title="PRECISION RESTORATION & PAINT LEVELING"
                subtitle="Examine our multi-stage wet sanding and spectrophotometer color leveling."
              />
            </div>

            {/* Featured Projects Gallery */}
            <FeaturedProjects
              items={galleryItems}
              onViewAllGallery={() => handleNavigate('gallery')}
            />

            {/* Customer Review Carousel */}
            <ReviewsCarousel
              reviews={reviews}
              onReviewSubmitted={(newRev) => setReviews([newRev, ...reviews])}
            />

            {/* High-Octane Performance Banner */}
            <PerformanceBanner
              onBookNow={() => handleNavigate('booking')}
              onContact={() => handleNavigate('contact')}
            />

            {/* Frequently Asked Questions Accordion */}
            <FaqAccordion />
          </div>
        )}

        {currentView === 'services' && (
          <ServicesView
            services={services}
            onBookService={(sId) => {
              setBookingPrefill({
                category: 'sports',
                serviceIds: [sId],
                isPriority: false,
                make: 'Porsche',
                model: '911',
                year: 2023,
              });
              handleNavigate('booking');
            }}
            onEstimateService={(sId) => {
              setEstimatorPreselectedServiceId(sId);
              handleNavigate('estimator');
            }}
          />
        )}

        {currentView === 'estimator' && (
          <CostEstimatorView
            services={services}
            preselectedServiceId={estimatorPreselectedServiceId}
            onProceedToBooking={handleProceedToBookingFromEstimator}
          />
        )}

        {currentView === 'booking' && (
          <BookingWizard
            services={services}
            currentUser={currentUser}
            initialConfig={bookingPrefill}
            onBookingComplete={() => {}}
            onViewDashboard={() => handleNavigate('dashboard')}
          />
        )}

        {currentView === 'gallery' && (
          <GalleryView items={galleryItems} />
        )}

        {currentView === 'reviews' && (
          <ReviewsView
            reviews={reviews}
            onReviewSubmitted={(newRev) => setReviews([newRev, ...reviews])}
          />
        )}

        {currentView === 'about' && (
          <AboutWorkshopView
            onOpenDeveloperModal={() => setDevModalOpen(true)}
            onBookTour={() => handleNavigate('booking')}
          />
        )}

        {currentView === 'contact' && (
          <ContactView />
        )}

        {currentView === 'dashboard' && (
          currentUser ? (
            <CustomerDashboard
              currentUser={currentUser}
              onBookNewSlot={() => handleNavigate('booking')}
            />
          ) : (
            <div className="py-24 text-center">
              <h2 className="text-2xl font-heading font-bold text-white uppercase mb-2">
                Authentication Required
              </h2>
              <p className="text-sm font-mono text-zinc-400 mb-6">
                Please log in to access your Customer Garage and service passports.
              </p>
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-6 py-2.5 rounded-xl bg-[#00F0FF] text-[#090B0E] font-bold text-xs uppercase"
              >
                Open Sign In Portal
              </button>
            </div>
          )
        )}

        {currentView === 'admin' && (
          currentUser && currentUser.role === 'ADMIN' ? (
            <AdminDashboard currentUser={currentUser} />
          ) : (
            <div className="py-24 text-center">
              <h2 className="text-2xl font-heading font-bold text-white uppercase mb-2">
                Administrator Privileges Required
              </h2>
              <p className="text-sm font-mono text-zinc-400 mb-6">
                You must be authenticated as a workshop master admin to access this console.
              </p>
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-6 py-2.5 rounded-xl bg-[#FF1E27] text-white font-bold text-xs uppercase"
              >
                Sign In as Admin
              </button>
            </div>
          )
        )}

        {currentView === 'privacy' && (
          <PrivacyPolicy onBackHome={() => handleNavigate('home')} />
        )}

        {currentView === 'terms' && (
          <TermsOfService onBackHome={() => handleNavigate('home')} />
        )}

        {currentView === '404' && (
          <NotFoundView
            onBackHome={() => handleNavigate('home')}
            onExploreServices={() => handleNavigate('services')}
          />
        )}
      </main>

      {/* Visible Global Footer with Exact Creator Credit: Developed & Designed by Ahad Ali Nisar */}
      <Footer
        onOpenDeveloperModal={() => setDevModalOpen(true)}
        onNavigate={handleNavigate}
      />

      {/* Interactive About Developer Modal */}
      <DeveloperModal
        isOpen={devModalOpen}
        onClose={() => setDevModalOpen(false)}
      />

      {/* Authentication Gateway Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}
