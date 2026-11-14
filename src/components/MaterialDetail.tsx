import React, { useState } from 'react';
import { Listing, UpcycleIdea } from '../types';
import { ArrowLeft, Sparkles, MapPin, ShieldCheck, Calendar, MessageSquare, Wrench, Clock, CheckCircle2, Leaf, Box, DollarSign } from 'lucide-react';

interface MaterialDetailProps {
  listing: Listing;
  onBack: () => void;
  onOpenReserve: () => void;
  onOpenMessage: () => void;
}

export const MaterialDetail: React.FC<MaterialDetailProps> = ({ listing, onBack, onOpenReserve, onOpenMessage }) => {
  const [ideas, setIdeas] = useState<UpcycleIdea[]>([]);
  const [isGeneratingIdeas, setIsGeneratingIdeas] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateIdeas = async () => {
    setIsGeneratingIdeas(true);
    setError(null);
    try {
      const res = await fetch('/api/gemini/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ material: listing })
      });
      const data = await res.json();
      if (data.ideas) {
        setIdeas(data.ideas);
      } else {
        setError('Failed to generate ideas. Please try again.');
      }
    } catch (err: any) {
      console.error('Co-pilot error:', err);
      setError(err.message || 'Failed to generate ideas.');
    } finally {
      setIsGeneratingIdeas(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8 animate-fadeIn">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-[#1E4D3B] transition-colors bg-white px-4 py-2 rounded-xl border border-stone-200 shadow-xs"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Marketplace
      </button>

      {/* Main Grid: Image Gallery & Contiguous Purchase Module */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Image & Eco Badges */}
        <div className="space-y-4">
          <div className="rounded-3xl overflow-hidden bg-white border border-stone-200 shadow-lg relative group">
            <img
              src={listing.imageUrl}
              alt={listing.title}
              className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-stone-900 text-xs font-bold shadow-sm">
                {listing.category}
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-[#1E4D3B] text-[#85E3B5] text-xs font-bold shadow-sm">
                {listing.conditionGrade}
              </span>
            </div>
          </div>

          {/* Eco Impact Metrics Card */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1E4D3B]/5 border border-[#1E4D3B]/20 rounded-2xl p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-[#1E4D3B] font-bold">
                <Leaf className="w-4 h-4 text-[#0F766E]" />
                Embodied Carbon Saved
              </div>
              <div className="text-2xl font-extrabold text-[#1E4D3B]">{listing.co2SavedKg} kg CO₂</div>
              <div className="text-[10px] text-stone-500">Equivalent to ~350 miles driven</div>
            </div>
            <div className="bg-[#0F766E]/5 border border-[#0F766E]/20 rounded-2xl p-4 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-[#0F766E] font-bold">
                <Box className="w-4 h-4 text-[#0F766E]" />
                Landfill Weight Diverted
              </div>
              <div className="text-2xl font-extrabold text-[#0F766E]">{listing.weightDivertedKg} kg</div>
              <div className="text-[10px] text-stone-500">Zero waste architectural salvage</div>
            </div>
          </div>
        </div>

        {/* Right: Contiguous Purchase Module */}
        <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <MapPin className="w-4 h-4 text-[#D96B27]" />
              {listing.location}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 leading-tight">
              {listing.title}
            </h1>
            <div className="text-sm text-stone-600 bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
              <span className="font-semibold text-stone-800">Physical Assessment: </span>
              {listing.conditionNotes}
            </div>
          </div>

          {/* Dimensions & Specs */}
          <div className="grid grid-cols-2 gap-4 py-4 border-y border-stone-100 text-xs">
            <div>
              <span className="text-stone-400 block mb-0.5 uppercase tracking-wider font-semibold">Dimensions</span>
              <span className="font-bold text-stone-800">{listing.estimatedDimensions}</span>
            </div>
            <div>
              <span className="text-stone-400 block mb-0.5 uppercase tracking-wider font-semibold">Status</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full inline-block">
                {listing.status}
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs text-stone-400 uppercase tracking-wider font-semibold block">Marketplace Price</span>
              <div className="text-3xl font-extrabold text-[#D96B27]">${listing.price}</div>
            </div>
            <div className="text-right">
              <span className="text-xs text-stone-400 uppercase tracking-wider font-semibold block">Estimated Retail</span>
              <div className="text-xl font-bold text-stone-400 line-through">${listing.retailPrice}</div>
            </div>
          </div>

          {/* Seller Profile Box */}
          <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-200">
            <div className="flex items-center gap-3">
              <img src={listing.seller.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <div className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                  {listing.seller.name}
                  {listing.seller.verified && <ShieldCheck className="w-4 h-4 text-[#1E4D3B]" />}
                </div>
                <div className="text-xs text-stone-500">{listing.seller.type} · ⭐ {listing.seller.rating}</div>
              </div>
            </div>
            <button
              onClick={onOpenMessage}
              className="px-4 py-2.5 bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-xs"
            >
              <MessageSquare className="w-4 h-4 text-[#0F766E]" />
              Message Seller
            </button>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex gap-4">
            <button
              onClick={onOpenReserve}
              className="flex-1 py-4 bg-[#1E4D3B] hover:bg-[#16382a] text-white text-sm font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#85E3B5]" />
              Reserve Lot & Schedule Pickup
            </button>
          </div>
        </div>
      </div>

      {/* AI Upcycle & Build Co-Pilot Section */}
      <div className="bg-gradient-to-br from-[#1E4D3B] to-[#0F766E] rounded-3xl p-8 md:p-12 text-white space-y-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#85E3B5] text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Gemini Co-Pilot Architecture
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              AI Upcycle & Build Co-Pilot
            </h2>
            <p className="text-stone-200 text-sm">
              Generate 3 practical, high-value DIY or commercial construction build ideas tailored specifically to these dimensions and material grade.
            </p>
          </div>
          <button
            onClick={handleGenerateIdeas}
            disabled={isGeneratingIdeas}
            className="px-6 py-4 bg-[#D96B27] hover:bg-[#c25c1f] text-white text-sm font-bold rounded-2xl shadow-lg transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGeneratingIdeas ? 'Synthesizing Build Ideas...' : 'Generate Custom Build Ideas'}</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/40 p-4 rounded-xl text-xs text-red-100">
            {error}
          </div>
        )}

        {ideas.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 animate-slideUp">
            {ideas.map((idea, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#85E3B5]">
                      Project 0{idx + 1}
                    </span>
                    <span className="text-xs bg-white/20 px-2.5 py-1 rounded-full font-medium">
                      {idea.materialUtilizationPercent}% Utilization
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{idea.title}</h3>
                  <p className="text-xs text-stone-300 leading-relaxed">{idea.description}</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
                  <div className="flex items-center gap-2 text-stone-200">
                    <Clock className="w-4 h-4 text-[#85E3B5]" />
                    <span>Est. Build Time: {idea.estimatedBuildTime}</span>
                  </div>
                  <div className="flex items-start gap-2 text-stone-200">
                    <Wrench className="w-4 h-4 text-[#85E3B5] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block">Required Tools:</span>
                      <span className="text-stone-300">{idea.requiredTools.join(', ')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
