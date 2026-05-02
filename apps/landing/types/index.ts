export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
  borderColor?: string;
}

export interface FeatureItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  stat?: string;
  codeSnippet?: string;
}

export interface LiveStat {
  label: string;
  value: number;
  suffix: string;
}

export interface ScanResult {
  score: number;
  verdict: string;
  headers: string;
  ssl: string;
  vulnerabilities: number;
}
