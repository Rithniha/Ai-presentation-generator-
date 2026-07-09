export interface InferredBrief {
  topic: string;
  industry: string;
  purpose: string;
  audience: string;
  tone: string;
  format: string;
}

export interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text_primary: string;
  text_secondary: string;
  gradient_style: string;
  rationale: string;
}

export interface Typography {
  heading_font: string;
  body_font: string;
  pairing_rationale: string;
  scale: {
    h1: string;
    h2: string;
    h3: string;
    body: string;
    caption: string;
  };
}

export interface GridSystem {
  columns: number;
  margin: string;
  gutter: string;
  baseline: string;
}

export interface ShapeLanguage {
  style: 'geometric' | 'organic' | 'angular' | 'rounded';
  corner_radius: string;
  rationale: string;
}

export interface CardStyle {
  elevation: string;
  border: string;
  background_treatment: string;
}

export interface MotionStyle {
  slide_transition: 'fade' | 'slide' | 'zoom' | 'morph';
  element_animation: string;
  timing: 'fast' | 'standard' | 'slow';
}

export interface DesignDNA {
  color_palette: ColorPalette;
  typography: Typography;
  grid_system: GridSystem;
  shape_language: ShapeLanguage;
  icon_style: 'line' | 'filled' | 'duotone' | '3d' | 'illustrated';
  imagery_style: string;
  card_style: CardStyle;
  motion_style: MotionStyle;
  decorative_elements: string[];
}

export interface SlideContent {
  title?: string;
  subtitle?: string;
  bullets?: string[];
  points?: string[];
  quote?: string;
  author?: string;
  stat_number?: string;
  stat_label?: string;
  stat_sublabel?: string;
  timeline_milestones?: { year?: string; label: string; desc: string }[];
  process_steps?: { step: string; title: string; desc: string }[];
  comparison_left_title?: string;
  comparison_left_items?: string[];
  comparison_right_title?: string;
  comparison_right_items?: string[];
  comparison_table_headers?: string[];
  comparison_table_rows?: string[][];
  chart_data?: { name: string; value: number }[];
  chart_title?: string;
  chart_type?: 'bar' | 'line' | 'pie';
  table_headers?: string[];
  table_rows?: string[][];
  image_concept?: string;
  image_url?: string;
  closing_text?: string;
  thank_you_text?: string;
  contact_info?: string;
  [key: string]: any;
}

export interface Slide {
  id: string;
  type: 
    | 'cover'
    | 'agenda'
    | 'section_divider'
    | 'content'
    | 'timeline'
    | 'comparison'
    | 'process'
    | 'statistics'
    | 'chart'
    | 'table'
    | 'closing'
    | 'thank_you';
  layout_variant: 'variant-1' | 'variant-2';
  content: SlideContent;
}

export interface DeckSpec {
  concept_statement: string;
  inferred_brief: InferredBrief;
  design_dna: DesignDNA;
  slides: Slide[];
}
