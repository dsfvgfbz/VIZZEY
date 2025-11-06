
export interface Article {
  id: string;
  headline: string;
  summary: string;
  source: string;
  country: string;
  images: {
    url: string;
    placeholder: string;
  }[];
  influences: string[];
  keywords: string[];
}

export interface ArchitecturalProposal {
    title: string;
    description: string;
    keyFeatures: string[];
    materials: string[];
}

export interface AnalysisTopic {
    question: string;
    answer: string;
    sources: { title: string; uri: string }[];
}
