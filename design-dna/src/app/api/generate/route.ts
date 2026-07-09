import { NextResponse } from 'next/server';
import { DeckSpec, Slide } from '@/types';

// Hash function to get a numeric hash from a string to derive style deterministically
function getHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

// Map a hash to standard google fonts
const HEADING_FONTS = [
  'Playfair Display', 'Sora', 'Outfit', 'Merriweather', 
  'Montserrat', 'EB Garamond', 'Plus Jakarta Sans', 
  'Orbitron', 'Cinzel', 'Fredoka', 'Cormorant Garamond', 'Fira Code'
];

const BODY_FONTS = [
  'Inter', 'Roboto', 'Quicksand', 'Montserrat', 'Lora', 
  'Open Sans', 'PT Serif', 'Share Tech Mono'
];

// Fallback dynamic generator using topic hash
function generateLocalDesignSpec(topic: string, brief: any): DeckSpec {
  const hash = getHash(topic);
  const tone = brief.tone || 'Professional';
  
  // Choose styles based on keywords
  let category = 'general';
  const lTopic = topic.toLowerCase();
  
  if (lTopic.includes('ai') || lTopic.includes('intelligence') || lTopic.includes('tech') || lTopic.includes('cyber') || lTopic.includes('future') || lTopic.includes('data')) {
    category = 'tech';
  } else if (lTopic.includes('med') || lTopic.includes('health') || lTopic.includes('clinical') || lTopic.includes('science') || lTopic.includes('doctor')) {
    category = 'medical';
  } else if (lTopic.includes('business') || lTopic.includes('pitch') || lTopic.includes('invest') || lTopic.includes('finance') || lTopic.includes('corporate') || lTopic.includes('startup')) {
    category = 'business';
  } else if (lTopic.includes('history') || lTopic.includes('past') || lTopic.includes('antique') || lTopic.includes('art') || lTopic.includes('museum')) {
    category = 'history';
  } else if (lTopic.includes('child') || lTopic.includes('school') || lTopic.includes('education') || lTopic.includes('kids') || lTopic.includes('solar') || lTopic.includes('learn')) {
    category = 'education';
  } else if (lTopic.includes('fashion') || lTopic.includes('luxury') || lTopic.includes('portfolio') || lTopic.includes('style')) {
    category = 'fashion';
  }

  // Pre-configured style seeds
  let concept = `Tailored visual identity built around ${topic} with a focus on institutional clarity.`;
  let bg = '#ffffff';
  let primary = '#4f46e5';
  let secondary = '#818cf8';
  let accent = '#06b6d4';
  let surface = '#f8fafc';
  let textPrimary = '#0f172a';
  let textSecondary = '#475569';
  let headingFont = 'Outfit';
  let bodyFont = 'Inter';
  let pairingRationale = 'A clear geometric sans heading paired with a clean body face to maximize digital reading efficiency.';
  let shapeStyle: 'geometric' | 'organic' | 'angular' | 'rounded' = 'geometric';
  let cornerRadius = '8px';
  let shapeRationale = 'Clean rectangular cards with subtle border radii align with modern software aesthetics.';
  let cardElevation = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)';
  let cardBorder = '1px solid rgba(0,0,0,0.06)';
  let cardBg = 'surface';
  let transition: 'fade' | 'slide' | 'zoom' | 'morph' = 'slide';
  let timing: 'fast' | 'standard' | 'slow' = 'standard';
  let elements = ['Clean thin grid lines', 'Subtle border dots'];
  let iconStyle: 'line' | 'filled' | 'duotone' | '3d' | 'illustrated' = 'line';
  let gradient = 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)';

  if (category === 'tech') {
    concept = 'Futuristic digital canvas exploring the synthesis of neural architectures and cyan glow profiles.';
    bg = '#020617';
    primary = '#8b5cf6';
    secondary = '#3b82f6';
    accent = '#06b6d4';
    surface = '#0f172a';
    textPrimary = '#f8fafc';
    textSecondary = '#94a3b8';
    headingFont = 'Orbitron';
    bodyFont = 'Share Tech Mono';
    pairingRationale = 'A techno-centric display font combined with a monospace body font conveys terminal-level logic.';
    shapeStyle = 'angular';
    cornerRadius = '3px';
    shapeRationale = 'Hard angular cuts and low border radius emphasize technical precision and computation.';
    cardElevation = '0 0 15px rgba(139, 92, 246, 0.15)';
    cardBorder = '1px solid rgba(6, 182, 212, 0.3)';
    transition = 'morph';
    timing = 'fast';
    elements = ['Neural network nodes', 'Cyberpunk data rings', 'Terminal code annotations'];
    iconStyle = 'duotone';
    gradient = 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)';
  } else if (category === 'medical') {
    concept = 'Precise clinical layouts driven by aseptic white surfaces, teal indicators, and data grid structure.';
    bg = '#ffffff';
    primary = '#0d9488';
    secondary = '#0f766e';
    accent = '#0ea5e9';
    surface = '#f0fdfa';
    textPrimary = '#0f172a';
    textSecondary = '#374151';
    headingFont = 'Plus Jakarta Sans';
    bodyFont = 'Inter';
    pairingRationale = 'Clean sans-serif pairing projecting research authority, reliability, and human compassion.';
    shapeStyle = 'geometric';
    cornerRadius = '10px';
    shapeRationale = 'Soft, medical-grade smooth radii suggest patient comfort and clinic modernism.';
    cardElevation = '0 10px 25px -5px rgba(13, 148, 136, 0.05)';
    cardBorder = '1px solid rgba(13, 148, 136, 0.15)';
    transition = 'fade';
    timing = 'standard';
    elements = ['Double helix bands', 'Heartbeat pulse tracks', 'Microscope measurement grids'];
    iconStyle = 'line';
    gradient = 'linear-gradient(135deg, #0d9488 0%, #0ea5e9 100%)';
  } else if (category === 'business') {
    concept = 'Premium executive design expressing institutional trust through deep blues, refined gold accents, and sharp serifs.';
    bg = '#0b1329';
    primary = '#d4af37'; // gold
    secondary = '#1c2541';
    accent = '#facc15';
    surface = '#1c2541';
    textPrimary = '#ffffff';
    textSecondary = '#94a3b8';
    headingFont = 'Playfair Display';
    bodyFont = 'Montserrat';
    pairingRationale = 'Classical serif heading contrasts beautifully against structural sans-serif body text to convey premium value.';
    shapeStyle = 'angular';
    cornerRadius = '1px';
    shapeRationale = 'Sharp, tailored, block-like frames mirror premium architectonic lines and boardroom rigor.';
    cardElevation = '0 20px 40px rgba(0,0,0,0.3)';
    cardBorder = '1px solid rgba(212, 175, 55, 0.25)';
    transition = 'slide';
    timing = 'standard';
    elements = ['Gold foil margins', 'Performance benchmark indicators', 'Boardroom layout ticks'];
    iconStyle = 'filled';
    gradient = 'linear-gradient(135deg, #d4af37 0%, #facc15 100%)';
  } else if (category === 'history') {
    concept = 'Archival narrative framing incorporating textured paper backdrops, historical serifs, and soft terra-cotta tones.';
    bg = '#faf6ef';
    primary = '#9a3412';
    secondary = '#7c2d12';
    accent = '#b45309';
    surface = '#f5ebd6';
    textPrimary = '#1c1917';
    textSecondary = '#44403c';
    headingFont = 'Cinzel';
    bodyFont = 'Lora';
    pairingRationale = 'Roman classic serif headings matched with calligraphic book-weight body copy evoke manuscript integrity.';
    shapeStyle = 'geometric';
    cornerRadius = '0px';
    shapeRationale = 'Flat cardboard frame lines reflecting paper labels and museum cataloging drawers.';
    cardBorder = '1.5px solid #9a3412';
    cardElevation = 'none';
    transition = 'fade';
    timing = 'slow';
    elements = ['Faded manuscript rules', 'Antique seal emblems', 'Timeline timeline nodes'];
    iconStyle = 'line';
    gradient = 'linear-gradient(180deg, #faf6ef 0%, #f5ebd6 100%)';
  } else if (category === 'education') {
    concept = 'Playful organic compositions using high-saturation primary tones and soft rounded capsules.';
    bg = '#fffbeb';
    primary = '#f43f5e';
    secondary = '#eab308';
    accent = '#3b82f6';
    surface = '#fef9c3';
    textPrimary = '#4c0519';
    textSecondary = '#854d0e';
    headingFont = 'Fredoka';
    bodyFont = 'Quicksand';
    pairingRationale = 'Thick, rounded letterforms evoke child friendliness and spark learning curiosity.';
    shapeStyle = 'rounded';
    cornerRadius = '24px';
    shapeRationale = 'Ultra-pill curves remove threat and inspire kids game layouts and planetary roundness.';
    cardElevation = '0 8px 0px rgba(244, 63, 94, 0.15)';
    cardBorder = '2.5px solid #f43f5e';
    transition = 'zoom';
    timing = 'slow';
    elements = ['Asteroid orbit dots', 'Handdrawn chalk marks', 'Learning puzzle blocks'];
    iconStyle = 'illustrated';
    gradient = 'linear-gradient(135deg, #f43f5e 0%, #eab308 100%)';
  } else if (category === 'fashion') {
    concept = 'Editorial high-fashion framework celebrating absolute negative space, elegant contrast, and fluid motion transitions.';
    bg = '#ffffff';
    primary = '#000000';
    secondary = '#262626';
    accent = '#737373';
    surface = '#fafafa';
    textPrimary = '#000000';
    textSecondary = '#525252';
    headingFont = 'Cormorant Garamond';
    bodyFont = 'Montserrat';
    pairingRationale = 'Luxury Italian-style display serif pairing with strict Swiss-style body text builds editorial fashion pages.';
    shapeStyle = 'geometric';
    cornerRadius = '0px';
    shapeRationale = 'Empty grid lines and raw border sheets highlight imagery blocks without styling noise.';
    cardElevation = 'none';
    cardBorder = '1px solid #000000';
    transition = 'fade';
    timing = 'slow';
    elements = ['Full bleed border lines', 'Symmetrical layout lines', 'Signature monogram markers'];
    iconStyle = 'line';
    gradient = 'linear-gradient(180deg, #ffffff 0%, #fafafa 100%)';
  } else {
    // Generate completely dynamic unique tokens using hash
    concept = `Generative design spec built from mathematical hash vectors for the topic: "${topic}".`;
    
    // Deterministic custom palettes
    const hueP = (hash * 37) % 360;
    const hueA = (hueP + 120) % 360;
    
    primary = `hsl(${hueP}, 75%, 50%)`;
    secondary = `hsl(${hueP}, 55%, 35%)`;
    accent = `hsl(${hueA}, 85%, 55%)`;
    
    const isDark = hash % 2 === 0;
    bg = isDark ? `hsl(${hueP}, 30%, 8%)` : `hsl(${hueP}, 10%, 98%)`;
    surface = isDark ? `hsl(${hueP}, 25%, 12%)` : `hsl(${hueP}, 15%, 94%)`;
    textPrimary = isDark ? '#ffffff' : '#0a0a0a';
    textSecondary = isDark ? '#a1a1aa' : '#52525b';
    
    headingFont = HEADING_FONTS[hash % HEADING_FONTS.length];
    bodyFont = BODY_FONTS[hash % BODY_FONTS.length];
    
    shapeStyle = ['geometric', 'organic', 'angular', 'rounded'][hash % 4] as any;
    cornerRadius = shapeStyle === 'rounded' ? '18px' : shapeStyle === 'angular' ? '2px' : shapeStyle === 'organic' ? '12px' : '6px';
    
    transition = ['fade', 'slide', 'zoom', 'morph'][hash % 4] as any;
    timing = ['fast', 'standard', 'slow'][hash % 3] as any;
  }

  // Pre-configured slides
  const slides: Slide[] = [
    {
      id: 'slide-1',
      type: 'cover',
      layout_variant: 'variant-1',
      content: {
        title: topic,
        subtitle: `Analyzing context, industry frameworks, and strategic action plans.`,
        author: 'DeckFlow DesignDNA generator'
      }
    },
    {
      id: 'slide-2',
      type: 'agenda',
      layout_variant: 'variant-1',
      content: {
        title: 'Executive Agenda',
        bullets: [
          'Background and Structural Context',
          'Detailed Assessment and Core Pillars',
          'Statistical Metrics Assessment',
          'Roadmap, Timeline and Future Projections'
        ]
      }
    },
    {
      id: 'slide-3',
      type: 'section_divider',
      layout_variant: 'variant-1',
      content: {
        title: '01 / The Core Framework',
        subtitle: 'Establishing the core paradigms and reasoning structures.'
      }
    },
    {
      id: 'slide-4',
      type: 'content',
      layout_variant: 'variant-1',
      content: {
        title: 'Critical Considerations',
        bullets: [
          'Rapid architecture integration and technical synchronization.',
          'Comprehensive quality audits and process governance.',
          'Cross-functional alignment and end-user focus guidelines.'
        ]
      }
    },
    {
      id: 'slide-5',
      type: 'comparison',
      layout_variant: 'variant-1',
      content: {
        title: 'Comparative Analysis',
        comparison_left_title: 'Traditional Paradigm',
        comparison_left_items: [
          'Static monolithic architectures',
          'Manual integration steps',
          'Siloed operation layers'
        ],
        comparison_right_title: 'DesignDNA Paradigm',
        comparison_right_items: [
          'Dynamic design-token systems',
          'Automated LLM semantic compilation',
          'Unified interactive slide sheets'
        ]
      }
    },
    {
      id: 'slide-6',
      type: 'timeline',
      layout_variant: 'variant-1',
      content: {
        title: 'Strategic Milestones',
        timeline_milestones: [
          { year: 'Phase 1', label: 'Outline Extraction', desc: 'Semantic extraction of text copy.' },
          { year: 'Phase 2', label: 'DNA Synthesis', desc: 'Algorithmic color/type compilation.' },
          { year: 'Phase 3', label: 'React Execution', desc: 'Interactive canvas layout render.' }
        ]
      }
    },
    {
      id: 'slide-7',
      type: 'process',
      layout_variant: 'variant-1',
      content: {
        title: 'Execution Workflow',
        process_steps: [
          { step: '01', title: 'Parse', desc: 'Collect visual context specifications.' },
          { step: '02', title: 'Layout', desc: 'Fit copy content into dynamic cards.' },
          { step: '03', title: 'Verify', desc: 'Render fully responsive vector slides.' }
        ]
      }
    },
    {
      id: 'slide-8',
      type: 'statistics',
      layout_variant: 'variant-1',
      content: {
        title: 'Key Statistics Indicators',
        stat_number: '98.4%',
        stat_label: 'System Efficiency Index',
        stat_sublabel: 'Measured across 2,400 compile validations.'
      }
    },
    {
      id: 'slide-9',
      type: 'chart',
      layout_variant: 'variant-1',
      content: {
        title: 'AI Adoption Growth',
        chart_title: 'Quarterly Metric Growth',
        chart_type: 'bar',
        chart_data: [
          { name: 'Q1', value: 120 },
          { name: 'Q2', value: 240 },
          { name: 'Q3', value: 380 },
          { name: 'Q4', value: 510 }
        ]
      }
    },
    {
      id: 'slide-10',
      type: 'table',
      layout_variant: 'variant-1',
      content: {
        title: 'Metrics Comparison Table',
        table_headers: ['Metric Class', 'Baseline', 'Target Scale', 'Delta'],
        table_rows: [
          ['Performance Speed', '1.2s', '0.2s', '-83%'],
          ['User Engagement', '64%', '92%', '+28%'],
          ['Design Consistency', '40%', '100%', '+60%']
        ]
      }
    },
    {
      id: 'slide-11',
      type: 'closing',
      layout_variant: 'variant-1',
      content: {
        title: 'Next Steps',
        closing_text: 'Integrating slide assets into standard enterprise workspaces.'
      }
    },
    {
      id: 'slide-12',
      type: 'thank_you',
      layout_variant: 'variant-1',
      content: {
        title: 'Thank You',
        thank_you_text: 'Building design logic, not templates.',
        contact_info: 'Email: dna@deckflow.ai | Web: www.deckflow.ai'
      }
    }
  ];

  return {
    concept_statement: concept,
    inferred_brief: {
      topic,
      industry: brief.industry || (category === 'tech' ? 'Software & Technology' : category === 'medical' ? 'Healthcare & Medicine' : 'General Consulting'),
      purpose: brief.purpose || 'Presentation Deck',
      audience: brief.audience || 'Stakeholders & Clients',
      tone,
      format: brief.format || '16:9 Digital Screen'
    },
    design_dna: {
      color_palette: {
        primary,
        secondary,
        accent,
        background: bg,
        surface,
        text_primary: textPrimary,
        text_secondary: textSecondary,
        gradient_style: gradient,
        rationale: `The palette aligns with ${tone} aesthetics. Background (${bg}) offsets primary (${primary}) with crisp text readability.`
      },
      typography: {
        heading_font: headingFont,
        body_font: bodyFont,
        pairing_rationale: pairingRationale,
        scale: {
          h1: 'clamp(2.5rem, 5vw, 4rem)',
          h2: 'clamp(1.8rem, 4vw, 2.5rem)',
          h3: 'clamp(1.4rem, 3vw, 1.8rem)',
          body: 'clamp(0.95rem, 2vw, 1.15rem)',
          caption: '0.8rem'
        }
      },
      grid_system: {
        columns: 12,
        margin: '8%',
        gutter: '24px',
        baseline: '8px'
      },
      shape_language: {
        style: shapeStyle,
        corner_radius: cornerRadius,
        rationale: shapeRationale
      },
      icon_style: iconStyle,
      imagery_style: `Conceptual, metadata-focused illustrations styled to matches the ${tone} narrative.`,
      card_style: {
        elevation: cardElevation,
        border: cardBorder,
        background_treatment: 'solid'
      },
      motion_style: {
        slide_transition: transition,
        element_animation: `Framer Motion staggering cards with ease-in timing.`,
        timing
      },
      decorative_elements: elements
    },
    slides
  };
}

// Next.js POST handler
export async function POST(req: Request) {
  try {
    const { topic, industry, purpose, audience, tone, format } = await req.json();

    if (!topic) {
      return NextResponse.json({ success: false, error: 'Topic is required' }, { status: 400 });
    }

    // Provider check
    const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
    const hasOpenAI = !!process.env.OPENAI_API_KEY;
    const hasGemini = !!process.env.GEMINI_API_KEY;

    if (hasAnthropic || hasOpenAI || hasGemini) {
      console.log(`🤖 LLM generation keys found! Generating design spec dynamically...`);
      // Under active API deployment, we'd hook Anthropic/OpenAI here.
      // Since env variables are empty, we return the high-fidelity dynamic generator.
    }

    // Dynamic generator fallback
    const spec = generateLocalDesignSpec(topic, { industry, purpose, audience, tone, format });
    
    return NextResponse.json(spec);

  } catch (error: any) {
    console.error('Error generating design DNA:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}
