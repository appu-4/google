import React, { useState } from 'react';
import { Listing } from './types';
import { INITIAL_LISTINGS } from './data/seed';
import { Navbar } from './components/Navbar';
import { ExploreMarketplace } from './components/ExploreMarketplace';
import { MaterialDetail } from './components/MaterialDetail';
import { SnapAndListStudio } from './components/SnapAndListStudio';
import { ImpactDashboard } from './components/ImpactDashboard';
import { ReserveModal } from './components/ReserveModal';
import { MessageSellerDrawer } from './components/MessageSellerDrawer';

export default function App() {
  const [currentView, setCurrentView] = useState<'explore' | 'detail' | 'snap' | 'dashboard'>('explore');
  const [listings, setListings] = useState<Listing[]>(INITIAL_LISTINGS);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [reservedIds, setReservedIds] = useState<string[]>([]);
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [isMessageDrawerOpen, setIsMessageDrawerOpen] = useState(false);

  const handleSelectListing = (listing: Listing) => {
    setSelectedListing(listing);
    setCurrentView('detail');
  };

  const handlePublishListing = (newListing: Listing) => {
    setListings(prev => [newListing, ...prev]);
    setSelectedListing(newListing);
    setCurrentView('detail');
  };

  const handleConfirmReservation = (listingId: string) => {
    if (!reservedIds.includes(listingId)) {
      setReservedIds(prev => [...prev, listingId]);
    }
    setListings(prev => prev.map(item => item.id === listingId ? { ...item, status: 'Reserved' as const } : item));
    setTimeout(() => {
      setIsReserveModalOpen(false);
    }, 1200);
  };

  const reservedListings = listings.filter(item => reservedIds.includes(item.id) || item.status === 'Reserved');

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#1c2621] flex flex-col font-sans selection:bg-[#85E3B5] selection:text-[#1E4D3B]">
      {/* Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        reservedCount={reservedListings.length}
      />

      {/* Main Body Views */}
      <main className="flex-1 pb-16">
        {currentView === 'explore' && (
          <ExploreMarketplace
            listings={listings}
            onSelectListing={handleSelectListing}
          />
        )}

        {currentView === 'detail' && selectedListing && (
          <MaterialDetail
            listing={selectedListing}
            onBack={() => setCurrentView('explore')}
            onOpenReserve={() => setIsReserveModalOpen(true)}
            onOpenMessage={() => setIsMessageDrawerOpen(true)}
          />
        )}

        {currentView === 'snap' && (
          <SnapAndListStudio
            onPublish={handlePublishListing}
            onBack={() => setCurrentView('explore')}
          />
        )}

        {currentView === 'dashboard' && (
          <ImpactDashboard
            reservedListings={reservedListings}
            onSelectListing={handleSelectListing}
          />
        )}
      </main>

      {/* Modals & Drawers */}
      {isReserveModalOpen && selectedListing && (
        <ReserveModal
          listing={selectedListing}
          onClose={() => setIsReserveModalOpen(false)}
          onConfirmReservation={handleConfirmReservation}
        />
      )}

      {isMessageDrawerOpen && selectedListing && (
        <MessageSellerDrawer
          listing={selectedListing}
          onClose={() => setIsMessageDrawerOpen(false)}
        />
      )}
    </div>
  );
}
