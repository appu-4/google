export type Category = 
  | 'Timber & Wood'
  | 'Metals & Alloys'
  | 'Brick & Masonry'
  | 'Glass & Acrylic'
  | 'Textiles & Foam'
  | 'Hardware';

export type ConditionGrade = 'Grade A' | 'Grade B' | 'Grade C';

export interface Listing {
  id: string;
  title: string;
  category: Category;
  conditionGrade: ConditionGrade;
  conditionNotes: string;
  estimatedDimensions: string;
  price: number;
  retailPrice: number;
  co2SavedKg: number;
  weightDivertedKg: number;
  imageUrl: string;
  location: string;
  coordinates: { x: number; y: number; lat: number; lng: number }; // map pin relative coordinates & lat/lng
  seller: {
    name: string;
    rating: number;
    verified: boolean;
    type: 'Commercial Salvage' | 'Demolition Contractor' | 'Artisanal Studio';
    avatar: string;
  };
  status: 'Available' | 'Reserved' | 'Completed';
  createdAt: string;
}

export interface UpcycleIdea {
  title: string;
  description: string;
  estimatedBuildTime: string;
  requiredTools: string[];
  materialUtilizationPercent: number;
}

export interface ImpactStats {
  totalCo2SavedKg: number;
  totalWeightDivertedKg: number;
  totalCostSavedUsd: number;
  reservedCount: number;
}
