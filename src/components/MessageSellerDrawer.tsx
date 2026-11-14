import React, { useState } from 'react';
import { X, Send, Bot, User, ShieldCheck } from 'lucide-react';
import { Listing } from '../types';

interface MessageSellerDrawerProps {
  listing: Listing;
  onClose: () => void;
}

interface Message {
  sender: 'user' | 'seller' | 'ai';
  text: string;
  time: string;
}

export const MessageSellerDrawer: React.FC<MessageSellerDrawerProps> = ({ listing, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'seller',
      text: `Hello! Thanks for your interest in the "${listing.title}". Let me know if you have questions about dimensions, loading dock access, or pickup scheduling.`,
      time: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickChips = [
    "Is loading dock assistance available?",
    "Can you provide exact dimensions?",
    "What is the best time for pickup?",
    "Is delivery negotiable for bulk?"
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    const newMsg: Message = {
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = `Thanks for asking! Yes, we can assist with loading onto your truck. Pickup is available Mon-Fri 8am-4pm at our ${listing.location}.`;
      if (text.toLowerCase().includes('dimension')) {
        reply = `The exact measurements are ${listing.estimatedDimensions}. All pieces are inspected and ready for transport.`;
      } else if (text.toLowerCase().includes('delivery')) {
        reply = `We partner with local flatbed haulers who can deliver within a 50-mile radius for an additional fee.`;
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'seller',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-slideLeft">
        {/* Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-[#1E4D3B] text-white">
          <div className="flex items-center gap-3">
            <img 
              src={listing.seller.avatar} 
              alt={listing.seller.name} 
              className="w-10 h-10 rounded-full object-cover border-2 border-[#85E3B5]" 
            />
            <div>
              <div className="font-semibold text-sm flex items-center gap-1.5">
                {listing.seller.name}
                {listing.seller.verified && <ShieldCheck className="w-4 h-4 text-[#85E3B5]" />}
              </div>
              <div className="text-xs text-stone-300">Typically replies within 15 mins</div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-stone-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Item context banner */}
        <div className="bg-stone-50 p-3 border-b border-stone-200 flex items-center gap-3">
          <img src={listing.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
          <div className="overflow-hidden">
            <h4 className="text-xs font-semibold text-stone-900 truncate">{listing.title}</h4>
            <div className="text-xs text-[#D96B27] font-semibold">${listing.price} · {listing.location}</div>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F9F8F6]">
          {messages.map((m, idx) => (
            <div 
              key={idx} 
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-xs ${
                  m.sender === 'user' 
                    ? 'bg-[#1E4D3B] text-white rounded-br-xs' 
                    : 'bg-white text-stone-800 border border-stone-200 rounded-bl-xs'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-stone-400 mt-1 px-1">{m.time}</span>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-stone-500 bg-white px-4 py-2.5 rounded-2xl w-fit border border-stone-200 animate-pulse">
              <Bot className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>Seller is typing...</span>
            </div>
          )}
        </div>

        {/* Quick Question Chips */}
        <div className="p-3 bg-white border-t border-stone-200 overflow-x-auto flex gap-2 shrink-0">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(chip)}
              className="px-3 py-1.5 text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full whitespace-nowrap transition-colors border border-stone-200"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input area */}
        <div className="p-4 bg-white border-t border-stone-200 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Type your question..."
            className="flex-1 bg-stone-100 border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-800 focus:outline-none focus:border-[#1E4D3B]"
          />
          <button
            onClick={() => handleSend()}
            className="p-2.5 bg-[#1E4D3B] text-white rounded-xl hover:bg-[#16382a] transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
