import React from 'react';
import { Listing } from '../types';
import { Leaf, Box, DollarSign, Calendar, ArrowUpRight, ShieldCheck, Award, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface ImpactDashboardProps {
  reservedListings: Listing[];
  onSelectListing: (listing: Listing) => void;
}

export const ImpactDashboard: React.FC<ImpactDashboardProps> = ({ reservedListings, onSelectListing }) => {
  // Calculate stats
  const totalCo2 = reservedListings.reduce((acc, item) => acc + item.co2SavedKg, 1850); // baseline seed offset
  const totalWeight = reservedListings.reduce((acc, item) => acc + item.weightDivertedKg, 3400);
  const totalSavings = reservedListings.reduce((acc, item) => acc + (item.retailPrice - item.price), 4200);

  const chartData = [
    { month: 'Jun', diverted: 420, savings: 850 },
    { month: 'Jul', diverted: 680, savings: 1200 },
    { month: 'Aug', diverted: 950, savings: 1900 },
    { month: 'Sep', diverted: 1400, savings: 2800 },
    { month: 'Oct', diverted: 2100, savings: 3600 },
    { month: 'Nov', diverted: totalWeight, savings: totalSavings },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl p-8 border border-stone-200 shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E4D3B]/10 text-[#1E4D3B] text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-[#0F766E]" />
            Circular Economy Impact & ESG Audit
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900">Impact & Inventory Dashboard</h1>
          <p className="text-xs md:text-sm text-stone-600">
            Real-time tracking of embodied carbon savings, landfill weight diversion, and material acquisitions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-[#1E4D3B] text-white px-5 py-3 rounded-2xl flex items-center gap-3 shadow-md">
            <ShieldCheck className="w-6 h-6 text-[#85E3B5]" />
            <div>
              <div className="text-[10px] text-stone-300 uppercase tracking-wider">ESG Compliance</div>
              <div className="text-sm font-bold">Tier 1 Verified Contributor</div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#1E4D3B]/10 text-[#1E4D3B] flex items-center justify-center">
            <Leaf className="w-6 h-6 text-[#1E4D3B]" />
          </div>
          <div>
            <span className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Total CO₂ Saved</span>
            <div className="text-3xl font-extrabold text-[#1E4D3B] mt-1">{totalCo2.toLocaleString()} kg</div>
            <div className="text-[11px] text-emerald-600 flex items-center gap-1 mt-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> +28% vs last month
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#0F766E]/10 text-[#0F766E] flex items-center justify-center">
            <Box className="w-6 h-6 text-[#0F766E]" />
          </div>
          <div>
            <span className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Landfill Diverted</span>
            <div className="text-3xl font-extrabold text-[#0F766E] mt-1">{totalWeight.toLocaleString()} kg</div>
            <div className="text-[11px] text-[#0F766E] flex items-center gap-1 mt-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> Zero waste audit passed
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#D96B27]/10 text-[#D96B27] flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-[#D96B27]" />
          </div>
          <div>
            <span className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Cost Savings</span>
            <div className="text-3xl font-extrabold text-[#D96B27] mt-1">${totalSavings.toLocaleString()}</div>
            <div className="text-[11px] text-[#D96B27] flex items-center gap-1 mt-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5" /> Compared to virgin retail
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-800 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-stone-800" />
          </div>
          <div>
            <span className="text-xs text-stone-500 font-semibold uppercase tracking-wider">Reserved Lots</span>
            <div className="text-3xl font-extrabold text-stone-900 mt-1">{reservedListings.length}</div>
            <div className="text-[11px] text-stone-500 mt-1 font-medium">
              Ready for scheduled pickup
            </div>
          </div>
        </div>
      </div>

      {/* Recharts Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Waste Diverted Chart */}
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900">Landfill Weight Diversion Trend</h3>
              <p className="text-xs text-stone-500">Monthly total weight diverted in kilograms (kg)</p>
            </div>
            <span className="text-xs font-bold text-[#0F766E] bg-[#0F766E]/10 px-3 py-1 rounded-full">
              Live ESG Metrics
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorDiverted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F766E" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0F766E" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#a8a29e" fontSize={12} />
                <YAxis stroke="#a8a29e" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1E4D3B', color: '#fff', borderRadius: '12px', border: 'none' }} />
                <Area type="monotone" dataKey="diverted" stroke="#0F766E" strokeWidth={3} fillOpacity={1} fill="url(#colorDiverted)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost Savings Chart */}
        <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-stone-900">Acquisition Cost Savings</h3>
              <p className="text-xs text-stone-500">Cumulative USD saved vs virgin materials</p>
            </div>
            <span className="text-xs font-bold text-[#D96B27] bg-[#D96B27]/10 px-3 py-1 rounded-full">
              Financial ROI
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="month" stroke="#a8a29e" fontSize={12} />
                <YAxis stroke="#a8a29e" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1E4D3B', color: '#fff', borderRadius: '12px', border: 'none' }} />
                <Bar dataKey="savings" fill="#D96B27" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Reserved Inventory Table */}
      <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-stone-900">Your Reserved Lots & Pickup Schedule</h3>
        
        {reservedListings.length === 0 ? (
          <div className="text-center py-12 bg-stone-50 rounded-2xl border border-stone-200 text-stone-500 text-xs">
            No reserved lots yet. Explore the marketplace and reserve salvage inventory to track pickups here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-100 text-stone-600 uppercase font-semibold">
                <tr>
                  <th className="p-4 rounded-l-xl">Material</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">CO₂ Saved</th>
                  <th className="p-4">Location</th>
                  <th className="p-4 rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {reservedListings.map(item => (
                  <tr key={item.id} className="hover:bg-stone-50 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img src={item.imageUrl} alt="" className="w-10 h-10 rounded-xl object-cover" />
                      <span className="font-bold text-stone-900">{item.title}</span>
                    </td>
                    <td className="p-4">{item.category}</td>
                    <td className="p-4 font-bold text-[#D96B27]">${item.price}</td>
                    <td className="p-4 font-bold text-[#1E4D3B]">{item.co2SavedKg} kg</td>
                    <td className="p-4 text-stone-500">{item.location}</td>
                    <td className="p-4">
                      <button
                        onClick={() => onSelectListing(item)}
                        className="px-3 py-1.5 bg-[#1E4D3B] text-white font-semibold rounded-lg hover:bg-[#16382a] transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
