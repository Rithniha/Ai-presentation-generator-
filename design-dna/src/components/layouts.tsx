import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  ResponsiveContainer, XAxis, YAxis, Tooltip 
} from 'recharts';
import { 
  Sparkles, CheckCircle2, ChevronRight, Activity, Globe, Shield, 
  Award, Briefcase, TrendingUp, Users, Database, Cloud, FileText, Phone, Mail 
} from 'lucide-react';
import { DesignDNA, SlideContent } from '../types';

interface LayoutProps {
  dna: DesignDNA;
  content: SlideContent;
  variant: 'variant-1' | 'variant-2';
}

// Icon mapper helper
const IconMap: { [key: string]: any } = {
  Sparkles, Globe, Shield, Award, Briefcase, TrendingUp, Users, Database, Cloud, FileText, Phone, Mail, Activity
};

const getIcon = (name?: string) => {
  const IconComp = IconMap[name || 'Sparkles'] || Sparkles;
  return <IconComp className="w-6 h-6 text-[var(--accent)]" />;
};

// Shape utility wrapper
const getCardStyle = (dna: DesignDNA) => {
  return {
    borderRadius: dna.shape_language.corner_radius,
    boxShadow: dna.card_style.elevation !== 'none' ? dna.card_style.elevation : undefined,
    border: dna.card_style.border,
    background: dna.color_palette.surface,
  };
};

/* ── IMAGE PLACEHOLDER BLOCK ── */
export function ImagePlaceholderBlock({ dna, concept }: { dna: DesignDNA; concept?: string }) {
  const roundedClass = dna.shape_language.style === 'rounded' ? 'rounded-2xl' : dna.shape_language.style === 'angular' ? 'rounded-none' : 'rounded-md';
  return (
    <div 
      className={`w-full h-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-[var(--accent)]/30 ${roundedClass} relative overflow-hidden`}
      style={{ background: `linear-gradient(135deg, ${dna.color_palette.surface} 0%, ${dna.color_palette.background} 100%)` }}
    >
      <div className="absolute top-2 left-2 text-[10px] uppercase font-mono tracking-widest text-[var(--text-secondary)]/50">
        IMAGE SCHEME // {dna.imagery_style.split(' ')[0] || 'CONCEPTUAL'}
      </div>
      <Sparkles className="w-10 h-10 text-[var(--accent)]/50 mb-3 animate-pulse" />
      <span className="text-xs font-semibold text-center text-[var(--text-secondary)] max-w-[200px]">
        {concept || 'Visual placeholder matching DNA guidelines'}
      </span>
      {dna.decorative_elements.length > 0 && (
        <span className="text-[9px] font-mono text-[var(--accent)] mt-2">
          ◆ Motif: {dna.decorative_elements[0]}
        </span>
      )}
    </div>
  );
}

/* ── 1. COVER SLIDE ── */
export function CoverSlide({ dna, content, variant }: LayoutProps) {
  if (variant === 'variant-1') {
    // Big Split Layout
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full gap-8 items-center p-8">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center"
        >
          <h1 className="font-bold tracking-tight text-[var(--primary)] leading-tight mb-4" style={{ fontSize: dna.typography.scale.h1 }}>
            {content.title}
          </h1>
          <p className="text-[var(--text-secondary)] mb-6" style={{ fontSize: dna.typography.scale.h3 }}>
            {content.subtitle}
          </p>
          {content.author && (
            <div className="text-xs font-mono tracking-wider text-[var(--accent)] uppercase mt-4">
              {content.author}
            </div>
          )}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="h-full max-h-[350px] md:max-h-full"
        >
          <ImagePlaceholderBlock dna={dna} concept="Cover art abstract layout" />
        </motion.div>
      </div>
    );
  }

  // Centered Minimal Variant
  return (
    <div className="flex flex-col justify-center items-center text-center h-full w-full p-12 relative overflow-hidden border border-[var(--primary)]/10" style={{ borderRadius: dna.shape_language.corner_radius }}>
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full filter blur-3xl opacity-10 bg-[var(--primary)]" />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full filter blur-3xl opacity-10 bg-[var(--accent)]" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-[750px]"
      >
        <span className="text-xs font-mono uppercase tracking-widest text-[var(--accent)] mb-4 block">
          ✦ CONCEPT SPEC // {dna.shape_language.style}
        </span>
        <h1 className="font-bold tracking-tight text-[var(--text-primary)] leading-tight mb-6" style={{ fontSize: dna.typography.scale.h1 }}>
          {content.title}
        </h1>
        <div className="w-16 h-1 bg-[var(--accent)] mx-auto mb-6" />
        <p className="text-[var(--text-secondary)]" style={{ fontSize: dna.typography.scale.h3 }}>
          {content.subtitle}
        </p>
      </motion.div>
    </div>
  );
}

/* ── 2. AGENDA SLIDE ── */
export function AgendaSlide({ dna, content, variant }: LayoutProps) {
  const items = content.bullets || [];

  if (variant === 'variant-1') {
    // Grid Cards layout
    return (
      <div className="flex flex-col h-full w-full justify-between p-8">
        <h2 className="font-bold text-[var(--primary)] mb-6" style={{ fontSize: dna.typography.scale.h2 }}>
          {content.title || 'Agenda'}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 items-center">
          {items.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="p-5 flex gap-4 items-center"
              style={getCardStyle(dna)}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-mono font-bold bg-[var(--primary)]/10 text-[var(--primary)]">
                0{idx + 1}
              </div>
              <span className="text-[var(--text-primary)] font-semibold text-sm sm:text-base">
                {item}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Staggered timeline row
  return (
    <div className="flex flex-col h-full w-full p-8">
      <h2 className="font-bold text-[var(--text-primary)] mb-8" style={{ fontSize: dna.typography.scale.h2 }}>
        {content.title || 'Table of Contents'}
      </h2>
      <div className="flex flex-col gap-4 justify-center flex-1">
        {items.map((item, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
            className="flex items-center gap-6 group cursor-pointer"
          >
            <div className="text-xl font-mono text-[var(--accent)] font-bold">
              /0{idx + 1}
            </div>
            <div className="flex-1 h-[1px] bg-[var(--text-secondary)]/20 group-hover:bg-[var(--accent)]/50 transition-colors" />
            <div className="text-base sm:text-lg font-bold text-[var(--text-primary)] tracking-wide group-hover:text-[var(--accent)] transition-colors">
              {item}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── 3. SECTION DIVIDER SLIDE ── */
export function SectionDividerSlide({ dna, content, variant }: LayoutProps) {
  if (variant === 'variant-1') {
    // Saturated overlay color variant
    return (
      <div 
        className="flex flex-col justify-center h-full w-full p-12 relative overflow-hidden"
        style={{ 
          background: dna.color_palette.gradient_style || dna.color_palette.primary,
          borderRadius: dna.shape_language.corner_radius
        }}
      >
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-white"
        >
          <span className="text-xs uppercase tracking-widest font-mono text-white/70 block mb-3">
            NEXT MODULE
          </span>
          <h2 className="font-black mb-4 leading-tight" style={{ fontSize: dna.typography.scale.h1 }}>
            {content.title}
          </h2>
          <p className="text-white/80 max-w-[500px]" style={{ fontSize: dna.typography.scale.body }}>
            {content.subtitle}
          </p>
        </motion.div>
      </div>
    );
  }

  // Bordered Offset layout
  return (
    <div className="flex flex-col justify-center items-start h-full w-full p-12 relative">
      <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-[var(--accent)]" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-[var(--accent)]" />
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="pl-8"
      >
        <span className="text-xs font-mono text-[var(--accent)] uppercase tracking-wider block mb-2">
          SECTION BREAK
        </span>
        <h2 className="font-bold text-[var(--text-primary)] mb-4" style={{ fontSize: dna.typography.scale.h1 }}>
          {content.title}
        </h2>
        <p className="text-[var(--text-secondary)]" style={{ fontSize: dna.typography.scale.h3 }}>
          {content.subtitle}
        </p>
      </motion.div>
    </div>
  );
}

/* ── 4. CONTENT SLIDE ── */
export function ContentSlide({ dna, content, variant }: LayoutProps) {
  const bullets = content.bullets || [];

  if (variant === 'variant-1') {
    // List with badges
    return (
      <div className="flex flex-col h-full w-full justify-between p-8">
        <h2 className="font-bold text-[var(--primary)] mb-6" style={{ fontSize: dna.typography.scale.h2 }}>
          {content.title}
        </h2>
        <div className="flex flex-col gap-4 flex-1 justify-center">
          {bullets.map((bullet, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="flex gap-4 items-start"
            >
              <CheckCircle2 className="w-6 h-6 text-[var(--accent)] mt-0.5 flex-shrink-0" />
              <p className="text-[var(--text-primary)] leading-relaxed" style={{ fontSize: dna.typography.scale.body }}>
                {bullet}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Split Column with Image layout
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 h-full w-full gap-8 p-8">
      <div className="md:col-span-7 flex flex-col justify-between">
        <h2 className="font-bold text-[var(--text-primary)] mb-4" style={{ fontSize: dna.typography.scale.h2 }}>
          {content.title}
        </h2>
        <div className="flex flex-col gap-4 flex-1 justify-center">
          {bullets.map((bullet, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.4 }}
              className="flex gap-3"
            >
              <ChevronRight className="w-5 h-5 text-[var(--accent)] mt-1 flex-shrink-0" />
              <p className="text-[var(--text-secondary)] leading-relaxed" style={{ fontSize: dna.typography.scale.body }}>
                {bullet}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="md:col-span-5 h-full">
        <ImagePlaceholderBlock dna={dna} concept={content.image_concept || 'Side column illustrative concept'} />
      </div>
    </div>
  );
}

/* ── 5. TIMELINE SLIDE ── */
export function TimelineSlide({ dna, content, variant }: LayoutProps) {
  const milestones = content.timeline_milestones || [];

  if (variant === 'variant-1') {
    // Horizontal Timeline Layout
    return (
      <div className="flex flex-col h-full w-full justify-between p-8">
        <h2 className="font-bold text-[var(--primary)] mb-8" style={{ fontSize: dna.typography.scale.h2 }}>
          {content.title || 'Timeline'}
        </h2>
        <div className="relative flex flex-col justify-center flex-1">
          {/* Horizontal line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-[var(--accent)]/30 -translate-y-1/2" />
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
            {milestones.map((ms, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.15, duration: 0.4 }}
                className="flex flex-col items-center text-center p-4 bg-[var(--background)] border border-[var(--accent)]/20"
                style={{ borderRadius: dna.shape_language.corner_radius }}
              >
                <div className="w-12 h-12 rounded-full border-4 border-[var(--background)] bg-[var(--accent)] text-white font-bold flex items-center justify-center mb-3 shadow-lg">
                  {ms.year || idx + 1}
                </div>
                <h4 className="font-bold text-[var(--text-primary)] text-sm sm:text-base mb-1">{ms.label}</h4>
                <p className="text-xs text-[var(--text-secondary)]">{ms.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Vertical Timeline Track
  return (
    <div className="flex flex-col h-full w-full p-8">
      <h2 className="font-bold text-[var(--text-primary)] mb-6" style={{ fontSize: dna.typography.scale.h2 }}>
        {content.title || 'Progress Milestones'}
      </h2>
      <div className="relative flex-1 flex flex-col justify-center pl-8 border-l-2 border-[var(--accent)]/40 ml-4 py-4 gap-6">
        {milestones.map((ms, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.15, duration: 0.4 }}
            className="relative"
          >
            {/* Timeline dot */}
            <div className="absolute -left-[41px] top-1 w-[18px] h-[18px] rounded-full border-4 border-[var(--background)] bg-[var(--accent)]" />
            
            <div className="flex flex-col">
              <span className="text-xs font-mono font-bold text-[var(--accent)]">{ms.year}</span>
              <h4 className="font-bold text-sm sm:text-base text-[var(--text-primary)] mb-1">{ms.label}</h4>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">{ms.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── 6. COMPARISON SLIDE ── */
export function ComparisonSlide({ dna, content, variant }: LayoutProps) {
  const leftItems = content.comparison_left_items || [];
  const rightItems = content.comparison_right_items || [];

  if (variant === 'variant-1') {
    // Left-Right Split Cards
    return (
      <div className="flex flex-col h-full w-full justify-between p-8">
        <h2 className="font-bold text-[var(--primary)] mb-6" style={{ fontSize: dna.typography.scale.h2 }}>
          {content.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 h-full flex flex-col justify-center border-t-4 border-red-500/50"
            style={getCardStyle(dna)}
          >
            <h3 className="font-bold text-lg mb-4 text-[var(--text-primary)]">{content.comparison_left_title}</h3>
            <ul className="flex flex-col gap-2">
              {leftItems.map((item, idx) => (
                <li key={idx} className="text-sm text-[var(--text-secondary)] flex gap-2">
                  <span className="text-red-500">✕</span> {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="p-6 h-full flex flex-col justify-center border-t-4 border-green-500/50"
            style={getCardStyle(dna)}
          >
            <h3 className="font-bold text-lg mb-4 text-[var(--text-primary)]">{content.comparison_right_title}</h3>
            <ul className="flex flex-col gap-2">
              {rightItems.map((item, idx) => (
                <li key={idx} className="text-sm text-[var(--text-secondary)] flex gap-2">
                  <span className="text-green-500">✓</span> {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    );
  }

  // Simple Table-Split layout
  return (
    <div className="flex flex-col h-full w-full p-8">
      <h2 className="font-bold text-[var(--text-primary)] mb-6" style={{ fontSize: dna.typography.scale.h2 }}>
        {content.title}
      </h2>
      <div className="flex-1 grid grid-cols-2 border border-[var(--accent)]/20" style={{ borderRadius: dna.shape_language.corner_radius, overflow: 'hidden' }}>
        <div className="p-5 border-r border-[var(--accent)]/20 bg-[var(--accent)]/5">
          <h3 className="font-bold mb-4 text-[var(--text-primary)] text-sm sm:text-base border-b border-[var(--accent)]/10 pb-2">{content.comparison_left_title}</h3>
          <div className="flex flex-col gap-3">
            {leftItems.map((item, idx) => (
              <p key={idx} className="text-xs sm:text-sm text-[var(--text-secondary)]">• {item}</p>
            ))}
          </div>
        </div>
        <div className="p-5 bg-[var(--color-palette.surface)]">
          <h3 className="font-bold mb-4 text-[var(--accent)] text-sm sm:text-base border-b border-[var(--accent)]/10 pb-2">{content.comparison_right_title}</h3>
          <div className="flex flex-col gap-3">
            {rightItems.map((item, idx) => (
              <p key={idx} className="text-xs sm:text-sm text-[var(--text-primary)] font-semibold">• {item}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── 7. PROCESS SLIDE ── */
export function ProcessSlide({ dna, content, variant }: LayoutProps) {
  const steps = content.process_steps || [];

  if (variant === 'variant-1') {
    // Numbered Flow Blocks
    return (
      <div className="flex flex-col h-full w-full justify-between p-8">
        <h2 className="font-bold text-[var(--primary)] mb-6" style={{ fontSize: dna.typography.scale.h2 }}>
          {content.title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1 items-center">
          {steps.map((st, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15, duration: 0.4 }}
              className="p-5 relative overflow-hidden"
              style={getCardStyle(dna)}
            >
              <div className="text-5xl font-extrabold text-[var(--accent)]/15 absolute -right-2 -top-2 select-none">
                {st.step}
              </div>
              <h4 className="font-bold text-sm sm:text-base text-[var(--text-primary)] mb-2">{st.title}</h4>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">{st.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  // Horizontal Chevron Flow Loop
  return (
    <div className="flex flex-col h-full w-full p-8">
      <h2 className="font-bold text-[var(--text-primary)] mb-6" style={{ fontSize: dna.typography.scale.h2 }}>
        {content.title}
      </h2>
      <div className="flex-1 flex flex-col justify-center sm:flex-row gap-4 items-center">
        {steps.map((st, idx) => (
          <React.Fragment key={idx}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.15, duration: 0.4 }}
              className="p-4 flex-1 text-center border border-[var(--accent)]/20 bg-[var(--color-palette.surface)]"
              style={{ borderRadius: dna.shape_language.corner_radius }}
            >
              <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] font-bold flex items-center justify-center mx-auto mb-2">
                {st.step}
              </div>
              <h4 className="font-bold text-xs sm:text-sm text-[var(--text-primary)] mb-1">{st.title}</h4>
              <p className="text-[10px] sm:text-xs text-[var(--text-secondary)]">{st.desc}</p>
            </motion.div>
            {idx < steps.length - 1 && (
              <ChevronRight className="w-6 h-6 text-[var(--accent)] rotate-90 sm:rotate-0 flex-shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/* ── 8. STATISTICS SLIDE ── */
export function StatisticsSlide({ dna, content, variant }: LayoutProps) {
  if (variant === 'variant-1') {
    // Large Hero Number Layout
    return (
      <div className="flex flex-col h-full w-full justify-between p-8">
        <h2 className="font-bold text-[var(--primary)] mb-4" style={{ fontSize: dna.typography.scale.h2 }}>
          {content.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 items-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-6 text-center md:text-left"
          >
            <div className="font-black tracking-tighter text-[var(--accent)] leading-none" style={{ fontSize: 'clamp(3rem, 10vw, 6.5rem)' }}>
              {content.stat_number}
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-6 flex flex-col justify-center"
          >
            <h3 className="font-bold text-lg sm:text-xl text-[var(--text-primary)] mb-2">
              {content.stat_label}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {content.stat_sublabel}
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  // Dual Small KPI Grid Cards layout
  return (
    <div className="flex flex-col h-full w-full p-8">
      <h2 className="font-bold text-[var(--text-primary)] mb-6" style={{ fontSize: dna.typography.scale.h2 }}>
        {content.title}
      </h2>
      <div className="flex-1 grid grid-cols-2 gap-6 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 text-center"
          style={getCardStyle(dna)}
        >
          <div className="text-4xl font-extrabold text-[var(--primary)] mb-2">{content.stat_number}</div>
          <div className="text-sm font-bold text-[var(--text-primary)]">{content.stat_label}</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-6 text-center border-l border-[var(--accent)]/10"
        >
          <div className="text-sm text-[var(--text-secondary)] italic leading-relaxed">
            "{content.stat_sublabel}"
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ── 9. CHART SLIDE ── */
export function ChartSlide({ dna, content, variant }: LayoutProps) {
  const chartData = content.chart_data || [];
  const chartType = content.chart_type || 'bar';
  const colors = [
    dna.color_palette.primary,
    dna.color_palette.accent,
    dna.color_palette.secondary,
    '#f59e0b', '#10b981', '#ec4899'
  ];

  const renderChart = () => {
    if (chartType === 'line') {
      return (
        <LineChart data={chartData}>
          <XAxis dataKey="name" stroke={dna.color_palette.text_secondary} fontSize={10} />
          <YAxis stroke={dna.color_palette.text_secondary} fontSize={10} />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke={dna.color_palette.accent} strokeWidth={3} dot={{ r: 5 }} />
        </LineChart>
      );
    } else if (chartType === 'pie') {
      return (
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      );
    }
    
    // Bar chart fallback
    return (
      <BarChart data={chartData}>
        <XAxis dataKey="name" stroke={dna.color_palette.text_secondary} fontSize={10} />
        <YAxis stroke={dna.color_palette.text_secondary} fontSize={10} />
        <Tooltip />
        <Bar dataKey="value" fill={dna.color_palette.primary} radius={[4, 4, 0, 0]} />
      </BarChart>
    );
  };

  if (variant === 'variant-1') {
    // Pure Visual Themed Chart
    return (
      <div className="flex flex-col h-full w-full justify-between p-8">
        <h2 className="font-bold text-[var(--primary)] mb-4" style={{ fontSize: dna.typography.scale.h2 }}>
          {content.title}
        </h2>
        <div className="flex-1 w-full h-[180px] sm:h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  // Chart on Left, Text details on Right split
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 h-full w-full gap-8 p-8">
      <div className="md:col-span-7 flex flex-col justify-between">
        <h2 className="font-bold text-[var(--text-primary)] mb-2" style={{ fontSize: dna.typography.scale.h2 }}>
          {content.title}
        </h2>
        <div className="w-full h-[180px] sm:h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>
      <div className="md:col-span-5 flex flex-col justify-center p-4 bg-[var(--accent)]/5 border border-[var(--accent)]/10" style={{ borderRadius: dna.shape_language.corner_radius }}>
        <h4 className="font-bold text-[var(--primary)] mb-2">{content.chart_title}</h4>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          Interactive metrics mapping dynamically computed design values. Visual elements adjust height coordinates, line path vectors, and slice fields.
        </p>
      </div>
    </div>
  );
}

/* ── 10. TABLE SLIDE ── */
export function TableSlide({ dna, content, variant }: LayoutProps) {
  const headers = content.table_headers || [];
  const rows = content.table_rows || [];

  if (variant === 'variant-1') {
    // Clean Alternating Row Table Grid
    return (
      <div className="flex flex-col h-full w-full justify-between p-8">
        <h2 className="font-bold text-[var(--primary)] mb-4" style={{ fontSize: dna.typography.scale.h2 }}>
          {content.title || 'Data Table'}
        </h2>
        <div className="flex-1 overflow-x-auto flex items-center">
          <table className="w-full border-collapse text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[var(--accent)]/30">
                {headers.map((h, i) => (
                  <th key={i} className="pb-2 font-bold text-[var(--text-primary)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rIdx) => (
                <tr key={rIdx} className="border-b border-[var(--accent)]/10 hover:bg-[var(--accent)]/5 transition-colors">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="py-2.5 text-[var(--text-secondary)]">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Boxed Card Rows
  return (
    <div className="flex flex-col h-full w-full p-8">
      <h2 className="font-bold text-[var(--text-primary)] mb-4" style={{ fontSize: dna.typography.scale.h2 }}>
        {content.title || 'Metrics Index'}
      </h2>
      <div className="flex-1 flex flex-col gap-3 justify-center">
        {rows.map((row, rIdx) => (
          <motion.div 
            key={rIdx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: rIdx * 0.1 }}
            className="p-3 flex justify-between items-center text-xs sm:text-sm"
            style={getCardStyle(dna)}
          >
            <span className="font-bold text-[var(--primary)]">{row[0]}</span>
            <div className="flex gap-4">
              {row.slice(1).map((cell, cIdx) => (
                <span key={cIdx} className="text-[var(--text-secondary)]">{cell}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── 11. CLOSING SLIDE ── */
export function ClosingSlide({ dna, content, variant }: LayoutProps) {
  if (variant === 'variant-1') {
    // Action split
    return (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center h-full w-full p-8">
        <div className="md:col-span-8">
          <h2 className="font-bold text-[var(--primary)] mb-4" style={{ fontSize: dna.typography.scale.h1 }}>
            {content.title || 'Next Steps'}
          </h2>
          <p className="text-[var(--text-secondary)]" style={{ fontSize: dna.typography.scale.body }}>
            {content.closing_text}
          </p>
        </div>
        <div className="md:col-span-4 h-full max-h-[160px] md:max-h-full">
          <ImagePlaceholderBlock dna={dna} concept="Strategy outline" />
        </div>
      </div>
    );
  }

  // Elegant text quote layout
  return (
    <div className="flex flex-col justify-center items-center text-center h-full w-full p-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-[650px] p-8 border-l-4 border-[var(--accent)]"
        style={{ background: `${dna.color_palette.surface}60`, borderRadius: dna.shape_language.corner_radius }}
      >
        <p className="italic text-[var(--text-primary)] font-medium mb-4" style={{ fontSize: dna.typography.scale.h3 }}>
          "{content.closing_text}"
        </p>
        <span className="text-xs uppercase font-mono tracking-widest text-[var(--accent)]">
          {content.title || 'Summary Paradigm'}
        </span>
      </motion.div>
    </div>
  );
}

/* ── 12. THANK YOU SLIDE ── */
export function ThankYouSlide({ dna, content, variant }: LayoutProps) {
  if (variant === 'variant-1') {
    // Centered Callout
    return (
      <div className="flex flex-col justify-center items-center text-center h-full w-full p-12 relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-[500px]"
        >
          <h2 className="font-black text-[var(--primary)] mb-2" style={{ fontSize: dna.typography.scale.h1 }}>
            {content.title || 'Thank You'}
          </h2>
          <p className="text-[var(--text-secondary)] mb-6" style={{ fontSize: dna.typography.scale.body }}>
            {content.thank_you_text}
          </p>
          <div className="w-10 h-1 bg-[var(--accent)] mx-auto mb-6" />
          {content.contact_info && (
            <p className="text-xs font-mono text-[var(--text-secondary)] opacity-80 whitespace-pre-line leading-relaxed">
              {content.contact_info}
            </p>
          )}
        </motion.div>
      </div>
    );
  }

  // Left-Right Split contact layout
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center h-full w-full p-8">
      <div className="md:col-span-6">
        <h2 className="font-bold text-[var(--text-primary)] mb-2" style={{ fontSize: dna.typography.scale.h1 }}>
          {content.title || 'Thank You'}
        </h2>
        <p className="text-[var(--text-secondary)]" style={{ fontSize: dna.typography.scale.h3 }}>
          {content.thank_you_text}
        </p>
      </div>
      <div className="md:col-span-6 p-6" style={getCardStyle(dna)}>
        <h4 className="font-bold text-[var(--accent)] mb-4">Contact Details</h4>
        <div className="flex flex-col gap-3 text-xs sm:text-sm text-[var(--text-primary)]">
          <div className="flex gap-2 items-center">
            <Mail className="w-4 h-4 text-[var(--accent)]" />
            <span>dna@deckflow.ai</span>
          </div>
          <div className="flex gap-2 items-center">
            <Phone className="w-4 h-4 text-[var(--accent)]" />
            <span>+1 (800) DECKFLOW</span>
          </div>
          <div className="border-t border-[var(--accent)]/10 pt-3 mt-1 text-[10px] font-mono text-[var(--text-secondary)]">
            DeckFlow DesignDNA visual specification engine.
          </div>
        </div>
      </div>
    </div>
  );
}
