import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, CheckCircle2, Shield } from 'lucide-react';
import { Listing } from '../types';
import confetti from 'canvas-confetti';

interface ReserveModalProps {
  listing: Listing;
  onClose: () => void;
  onConfirmReservation: (listingId: string) => void;
}

export const ReserveModal: React.FC<ReserveModalProps> = ({ listing, onClose, onConfirmReservation }) => {
  const [date, setDate] = useState('2026-11-15');
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 12:00 PM');
  const [confirmed, setConfirmed] = useState(false);

  const timeSlots = [
    '08:00 AM - 10:00 AM',
    '10:00 AM - 12:00 PM',
    '01:00 PM - 03:00 PM',
    '03:00 PM - 05:00 PM'
  ];

  const handleReserve = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    setConfirmed(true);
    setTimeout(() => {
      onConfirmReservation(listing.id);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-scaleUp">
        {confirmed ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-[#1E4D3B] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-[#1E4D3B]" />
            </div>
            <h3 className="text-2xl font-bold text-stone-900">Lot Reserved Successfully!</h3>
            <p className="text-sm text-stone-600 max-w-sm mx-auto">
              Your pickup has been scheduled for <span className="font-semibold">{date} ({timeSlot})</span> at <span className="font-semibold">{listing.location}</span>.
            </p>
            <div className="bg-[#F9F8F6] p-4 rounded-xl border border-stone-200 text-xs text-stone-700">
              +{listing.co2SavedKg} kg CO₂ saved · +${listing.retailPrice - listing.price} estimated cost savings added to your Impact Dashboard!
            </div>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-[#1E4D3B] text-white">
              <div>
                <h3 className="text-lg font-bold">Reserve Reclaimed Lot</h3>
                <p className="text-xs text-[#85E3B5]">Lock in inventory and schedule pickup</p>
              </div>
              <button onClick={onClose} className="p-2 text-stone-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Item summary */}
              <div className="flex items-center gap-4 bg-[#F9F8F6] p-4 rounded-xl border border-stone-200">
                <img src={listing.imageUrl} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-stone-900">{listing.title}</h4>
                  <div className="text-xs text-stone-500 mt-0.5">{listing.estimatedDimensions}</div>
                  <div className="text-sm font-bold text-[#D96B27] mt-1">${listing.price} <span className="text-xs text-stone-400 font-normal line-through">${listing.retailPrice}</span></div>
                </div>
              </div>

              {/* Date selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#0F766E]" />
                  Select Pickup Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-800 focus:outline-none focus:border-[#1E4D3B]"
                />
              </div>

              {/* Time slot selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#0F766E]" />
                  Select Pickup Time Slot
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map(slot => (
                    <button
                      key={slot}
                      onClick={() => setTimeSlot(slot)}
                      className={`py-2.5 px-3 text-xs font-medium rounded-xl border transition-all text-center ${
                        timeSlot === slot
                          ? 'bg-[#1E4D3B] text-white border-[#1E4D3B] shadow-sm'
                          : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location info */}
              <div className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600">
                <MapPin className="w-4 h-4 text-[#D96B27] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-stone-800">Pickup Location:</span> {listing.location}
                  <div className="text-stone-500 mt-0.5">Please bring vehicle with adequate hauling capacity and secure tie-downs.</div>
                </div>
              </div>

              {/* Footer action */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReserve}
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-[#1E4D3B] hover:bg-[#16382a] rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Shield className="w-4 h-4 text-[#85E3B5]" />
                  Confirm Reservation & Hold
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
