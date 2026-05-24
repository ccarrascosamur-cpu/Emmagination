export interface ProjectMetric {
  label: string;
  value: string;
  trend: "up" | "down" | "neutral";
}

export interface ChartDataPoint {
  month: string;
  before: number;
  after: number;
}

export interface Project {
  id: string;
  title: string;
  category: "ecommerce" | "web" | "branding";
  categoryLabel: string;
  tags: string[];
  description: string;
  longDescription: string;
  beforeDescription: string;
  afterDescription: string;
  metrics: ProjectMetric[];
  techStack: string[];
  chartData: ChartDataPoint[];
  color: string; // Gradient accent class
  glowColor: string; // Shadow glow class
  textColor: string;
  imageAccent: string; // Tailored graphic element representation or symbol
}

export interface MetricCalculatorState {
  monthlyTraffic: number;
  averageTicket: number;
  conversionRate: number;
}
