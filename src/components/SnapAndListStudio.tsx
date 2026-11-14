import React, { useState } from 'react';
import { Listing, Category, ConditionGrade } from '../types';
import { Upload, Sparkles, CheckCircle2, ArrowLeft, Camera, ShieldCheck, Leaf, Box, DollarSign } from 'lucide-react';

interface SnapAndListStudioProps {
  onPublish: (newListing: Listing) => void;
  onBack: () => void;
}

export const SnapAndListStudio: React.FC<SnapAndListStudioProps> = ({ onPublish, onBack }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('Timber & Wood');
  const [conditionGrade, setConditionGrade] = useState<ConditionGrade>('Grade A');
  const [conditionNotes, setConditionNotes] = useState('');
  const [estimatedDimensions, setEstimatedDimensions] = useState('');
  const [price, setPrice] = useState<number>(250);
  const [retailPrice, setRetailPrice] = useState<number>(750);
  const [co2SavedKg, setCo2SavedKg] = useState<number>(350);
  const [weightDivertedKg, setWeightDivertedKg] = useState<number>(180);
  const [location, setLocation] = useState('San Francisco EcoYard, CA');

  const samplePhotos = [
    {
      name: 'Reclaimed Oak Planks',
      url: 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=1200&q=80',
      category: 'Timber & Wood' as Category
    },
    {
      name: 'Copper Piping Offcuts',
      url: 'https://images.unsplash.com/photo-1615873968403-89e0676297c5?auto=format&fit=crop&w=1200&q=80',
      category: 'Metals & Alloys' as Category
    }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMimeType(file.type);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImagePreview(result);
        const base64 = result.split(',')[1];
        setImageBase64(base64);
        runAiAnalysis(base64, file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = async (sampleUrl: string) => {
    setImagePreview(sampleUrl);
    setIsScanning(true);
    setScanStep(1);

    try {
      // Fetch sample image and convert to base64
      const response = await fetch(sampleUrl);
      const blob = await response.blob();
      setMimeType(blob.type || 'image/jpeg');
      const reader = new FileReader();
      reader.onload = async () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        setImageBase64(base64);
        await runAiAnalysis(base64, blob.type || 'image/jpeg');
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error('Sample photo error:', err);
      setIsScanning(false);
      setError('Failed to load sample photo.');
    }
  };

  const runAiAnalysis = async (base64Data: string, mType: string) => {
    setIsScanning(true);
    setScanStep(1);
    setError(null);

    const interval = setInterval(() => {
      setScanStep(prev => (prev < 3 ? prev + 1 : prev));
    }, 800);

    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Data, mimeType: mType })
      });
      const data = await res.json();
      clearInterval(interval);
      if (data.title) {
        setTitle(data.title);
        setCategory(data.category || 'Timber & Wood');
        setConditionGrade(data.conditionGrade || 'Grade A');
        setConditionNotes(data.conditionNotes || 'Inspected by Gemini AI Vision.');
        setEstimatedDimensions(data.estimatedDimensions || 'Standard salvage lot');
        setPrice(data.suggestedPrice || 250);
        setRetailPrice(data.estimatedRetailPrice || 600);
        setCo2SavedKg(data.co2SavedKg || 300);
        setWeightDivertedKg(data.weightDivertedKg || 150);
      } else {
        setError(data.error || 'AI analysis returned incomplete data.');
      }
    } catch (err: any) {
      clearInterval(interval);
      console.error('Gemini analyze error:', err);
      setError(err.message || 'Failed to analyze image.');
    } finally {
      setIsScanning(false);
      setScanStep(0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please provide a listing title or upload an image to analyze.');
      return;
    }

    const newListing: Listing = {
      id: `rec-${Date.now().toString().slice(-4)}`,
      title,
      category,
      conditionGrade,
      conditionNotes: conditionNotes || 'AI Assessed Reclaimed Material',
      estimatedDimensions: estimatedDimensions || 'Standard lot',
      price: Number(price),
      retailPrice: Number(retailPrice),
      co2SavedKg: Number(co2SavedKg),
      weightDivertedKg: Number(weightDivertedKg),
      imageUrl: imagePreview || 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?auto=format&fit=crop&w=1200&q=80',
      location,
      coordinates: { x: Math.floor(Math.random() * 60) + 20, y: Math.floor(Math.random() * 60) + 20, lat: 37.7749, lng: -122.4194 },
      seller: {
        name: 'Verified Circular Contributor',
        rating: 5.0,
        verified: true,
        type: 'Commercial Salvage',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
      },
      status: 'Available',
      createdAt: new Date().toISOString().split('T')[0]
    };

    onPublish(newListing);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-[#1E4D3B] transition-colors bg-white px-4 py-2 rounded-xl border border-stone-200 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Marketplace
        </button>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E4D3B]/10 text-[#1E4D3B] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#0F766E]" />
          Gemini Multimodal Vision Studio
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-stone-900">AI "Snap & List" Material Studio</h1>
          <p className="text-sm text-stone-600">
            Upload a photo of your salvaged material or architectural timber. Gemini vision will instantly inspect grade, dimensions, pricing, and carbon savings.
          </p>
        </div>

        {/* Upload / Sample Zone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="border-2 border-dashed border-stone-300 hover:border-[#1E4D3B] rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer bg-stone-50/50 transition-colors group relative overflow-hidden">
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            {imagePreview && !isScanning ? (
              <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="space-y-3 relative z-10">
                <div className="w-14 h-14 bg-[#1E4D3B]/10 text-[#1E4D3B] rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Camera className="w-7 h-7 text-[#1E4D3B]" />
                </div>
                <div>
                  <span className="text-sm font-bold text-stone-900 block">Click to upload material photo</span>
                  <span className="text-xs text-stone-500">or drag and drop PNG, JPG</span>
                </div>
              </div>
            )}
          </label>

          {/* Quick Sample Photos */}
          <div className="bg-stone-50 rounded-3xl p-6 border border-stone-200 flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">Or Test With Sample Photos</h3>
              <div className="grid grid-cols-2 gap-3">
                {samplePhotos.map((s, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSample(s.url)}
                    className="group bg-white rounded-2xl p-3 border border-stone-200 hover:border-[#1E4D3B] text-left transition-all shadow-2xs hover:shadow-md cursor-pointer"
                  >
                    <img src={s.url} alt="" className="w-full h-20 object-cover rounded-xl mb-2" />
                    <span className="text-xs font-bold text-stone-900 block truncate">{s.name}</span>
                    <span className="text-[10px] text-stone-500">{s.category}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-stone-500 bg-white p-3 rounded-xl border border-stone-200">
              ⚡ Gemini Vision extracts accurate grading, weight diversion, and market valuation in under 2 seconds.
            </div>
          </div>
        </div>

        {/* Scanning Animation Modal / Banner */}
        {isScanning && (
          <div className="bg-[#1E4D3B] text-white p-6 rounded-2xl flex items-center gap-4 animate-pulse">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-[#85E3B5] animate-spin" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold">Gemini AI Vision Analyzing Material...</h4>
              <p className="text-xs text-stone-300">
                {scanStep === 1 && "Inspecting surface grain, cracks, and condition grade..."}
                {scanStep === 2 && "Calculating volumetric dimensions & embodied carbon savings..."}
                {scanStep >= 3 && "Synthesizing market valuation & generating listing..."}
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs">
            {error}
          </div>
        )}

        {/* Auto-Populated Listing Form */}
        <form onSubmit={handleSubmit} className="space-y-6 pt-4 border-t border-stone-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Listing Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Reclaimed Douglas Fir Beams"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-medium text-stone-900 focus:outline-none focus:border-[#1E4D3B]"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as Category)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-medium text-stone-900 focus:outline-none focus:border-[#1E4D3B]"
              >
                <option value="Timber & Wood">Timber & Wood</option>
                <option value="Metals & Alloys">Metals & Alloys</option>
                <option value="Brick & Masonry">Brick & Masonry</option>
                <option value="Glass & Acrylic">Glass & Acrylic</option>
                <option value="Textiles & Foam">Textiles & Foam</option>
                <option value="Hardware">Hardware</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Condition Grade</label>
              <select
                value={conditionGrade}
                onChange={e => setConditionGrade(e.target.value as ConditionGrade)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-medium text-stone-900 focus:outline-none focus:border-[#1E4D3B]"
              >
                <option value="Grade A">Grade A (Pristine / Historic)</option>
                <option value="Grade B">Grade B (Minor Wear / Solid)</option>
                <option value="Grade C">Grade C (Heavy Patina / Refurbish)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Suggested Price ($)</label>
              <input
                type="number"
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-medium text-stone-900 focus:outline-none focus:border-[#1E4D3B]"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Estimated Retail ($)</label>
              <input
                type="number"
                value={retailPrice}
                onChange={e => setRetailPrice(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-medium text-stone-900 focus:outline-none focus:border-[#1E4D3B]"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Physical Condition Assessment</label>
            <input
              type="text"
              value={conditionNotes}
              onChange={e => setConditionNotes(e.target.value)}
              placeholder="e.g. Old-growth tight grain, kiln dried."
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-medium text-stone-900 focus:outline-none focus:border-[#1E4D3B]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Estimated Dimensions</label>
              <input
                type="text"
                value={estimatedDimensions}
                onChange={e => setEstimatedDimensions(e.target.value)}
                placeholder="e.g. 12ft length x 6in"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-medium text-stone-900 focus:outline-none focus:border-[#1E4D3B]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">CO₂ Saved (kg)</label>
              <input
                type="number"
                value={co2SavedKg}
                onChange={e => setCo2SavedKg(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-medium text-stone-900 focus:outline-none focus:border-[#1E4D3B]"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Weight Diverted (kg)</label>
              <input
                type="number"
                value={weightDivertedKg}
                onChange={e => setWeightDivertedKg(Number(e.target.value))}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-3 text-sm font-medium text-stone-900 focus:outline-none focus:border-[#1E4D3B]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3.5 bg-[#1E4D3B] hover:bg-[#16382a] text-white text-sm font-bold rounded-2xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-[#85E3B5]" />
              Publish to Marketplace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
