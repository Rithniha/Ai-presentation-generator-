/**
 * AI-Powered Layout & Theme Recommendation Engine
 */

// Basic keyword maps for content profiling
const TOPIC_KEYWORDS = {
  technology: ['ai', 'artificial intelligence', 'machine learning', 'data', 'software', 'app', 'digital', 'cloud', 'cyber', 'security', 'network', 'code', 'future', 'robot', 'tech'],
  corporate: ['business', 'proposal', 'corporate', 'sales', 'report', 'strategy', 'finance', 'revenue', 'consulting', 'management', 'growth', 'annual', 'fiscal', 'quarterly', 'budget'],
  academic: ['research', 'study', 'academic', 'education', 'learning', 'university', 'science', 'theory', 'history', 'literature', 'thesis', 'methodology', 'experiment', 'results'],
  forest: ['nature', 'environment', 'forest', 'green', 'sustainability', 'ecology', 'climate', 'organic', 'agriculture', 'wellness', 'outdoor', 'wood', 'plant'],
  sunset: ['travel', 'vacation', 'sunset', 'sunrise', 'trip', 'beach', 'leisure', 'tourism', 'explore', 'adventure', 'island', 'hotel', 'resort'],
  marketing: ['marketing', 'campaign', 'brand', 'advertising', 'product launch', 'creative', 'audience', 'engagement', 'social media', 'promotion', 'influence'],
  cyberpunk: ['cyberpunk', 'hacker', 'neon', 'crypto', 'blockchain', 'futuristic', 'metaverse', 'gaming', 'glitch', 'virtual reality', 'vr', 'synthwave']
};

/**
 * Get user preferences history from localStorage
 */
export const getUserPreferences = () => {
  try {
    const prefs = localStorage.getItem('deckflow_user_preferences');
    return prefs ? JSON.parse(prefs) : { themes: {}, layouts: {} };
  } catch (e) {
    return { themes: {}, layouts: {} };
  }
};

/**
 * Record a selected theme/layout to update the learning system
 */
export const recordUserSelection = (type, id) => {
  try {
    const prefs = getUserPreferences();
    if (type === 'theme') {
      prefs.themes[id] = (prefs.themes[id] || 0) + 1;
    } else if (type === 'layout') {
      prefs.layouts[id] = (prefs.layouts[id] || 0) + 1;
    }
    localStorage.setItem('deckflow_user_preferences', JSON.stringify(prefs));
  } catch (e) {
    console.warn('Failed to save user preference:', e);
  }
};

/**
 * Analyze presentation and active slide content to create a profile
 */
export const analyzeContent = (presentation, activeSlideIdx = 0) => {
  if (!presentation) return null;

  const slides = presentation.slides || [];
  const activeSlide = slides[activeSlideIdx] || { title: '', content: [] };
  
  const titleText = (presentation.title || '').toLowerCase();
  const slideTitle = (activeSlide.title || '').toLowerCase();
  const allSlideTitlesText = slides.map(s => s.title || '').join(' ').toLowerCase();
  const slideContentText = (activeSlide.content || []).join(' ').toLowerCase();
  const allContentText = slides.map(s => (s.content || []).join(' ')).join(' ').toLowerCase();

  // 1. Analyze metadata fields (use preset values or search text)
  const meta = {
    title: presentation.title || '',
    topic: presentation.topic || '',
    audience: presentation.audience || '',
    tone: presentation.tone || 'professional',
    purpose: presentation.purpose || '',
    industry: presentation.industry || '',
  };

  // If fields are empty, guess them based on title/all content text
  let guessedTopic = meta.topic || 'General';
  let guessedPurpose = meta.purpose || 'Presentation';
  
  // Topic detection
  let maxTopicScore = 0;
  Object.entries(TOPIC_KEYWORDS).forEach(([topic, keywords]) => {
    let score = 0;
    keywords.forEach(kw => {
      if (titleText.includes(kw)) score += 5;
      if (allSlideTitlesText.includes(kw)) score += 2;
      if (allContentText.includes(kw)) score += 1;
    });
    if (score > maxTopicScore) {
      maxTopicScore = score;
      guessedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
    }
  });

  // Purpose detection
  if (/proposal|sales|report|annual|quarterly/i.test(titleText + ' ' + allContentText)) {
    guessedPurpose = 'business';
  } else if (/pitch|startup|investor|deck/i.test(titleText + ' ' + allContentText)) {
    guessedPurpose = 'startup pitch';
  } else if (/campaign|marketing|launch/i.test(titleText + ' ' + allContentText)) {
    guessedPurpose = 'marketing';
  } else if (/class|lecture|student|study|learn/i.test(titleText + ' ' + allContentText)) {
    guessedPurpose = 'education';
  } else if (/research|paper|thesis|scientific|experimental/i.test(titleText + ' ' + allContentText)) {
    guessedPurpose = 'research';
  }

  // 2. Scan slide elements
  const bulletCount = activeSlide.content ? activeSlide.content.length : 0;
  
  // Check timeline data (dates, step/phase counts, roadmap, milestones)
  const hasTimelineData = /phase|step|milestone|roadmap|year|stage|quarter|evolution|timeline|history|then|after|first|second|third|finally|\b(19|20)\d{2}\b/i.test(slideTitle + ' ' + slideContentText);
  
  // Check statistics (numbers, percentages, currencies, multipliers)
  const hasStatistics = /%|\b\d+x\b|\b\$\d+(\.\d+)?[m|b|k]?\b|\b\d+(percent|%)\b|statistics|revenue|sales|profit|metrics|growth|numerical/i.test(slideTitle + ' ' + slideContentText);
  
  // Check comparison (vs, compare, features, differences, alternative)
  const hasComparison = /vs|compare|comparison|features|benefits|different|differences|advantages|contrast|pillars/i.test(slideTitle + ' ' + slideContentText);

  // Check tables & charts indicators in text
  const hasCharts = /chart|graph|plot|visualized/i.test(slideTitle + ' ' + slideContentText);
  const hasTables = /table|matrix|data grid/i.test(slideTitle + ' ' + slideContentText);

  return {
    presentationTitle: meta.title,
    inferredTopic: guessedTopic,
    inferredPurpose: guessedPurpose,
    audience: meta.audience || 'General Audience',
    tone: meta.tone,
    activeSlide: {
      title: activeSlide.title,
      bulletCount,
      hasTimelineData,
      hasStatistics,
      hasComparison,
      hasCharts,
      hasTables,
    }
  };
};

/**
 * Score themes based on profile and user preferences
 */
export const getThemeRecommendations = (presentation, profile) => {
  if (!presentation || !profile) return [];

  const prefs = getUserPreferences();
  const themeCounts = prefs.themes || {};

  const topic = profile.inferredTopic.toLowerCase();
  const purpose = profile.inferredPurpose.toLowerCase();
  const tone = profile.tone.toLowerCase();
  const title = (presentation.title || '').toLowerCase();

  const themes = [
    { id: 'corporate', name: 'Corporate', description: 'Clean, structured, and formal design.', psychologist: 'Inspires trust, stability, and authority.' },
    { id: 'technology', name: 'Technology', description: 'Deep, neon blue lines with digital grid features.', psychologist: 'Highlights innovation, security, and forward thinking.' },
    { id: 'academic', name: 'Academic', description: 'Soft parchment style, merriweather fonts.', psychologist: 'Conveys deep research, logic, and structure.' },
    { id: 'forest', name: 'Forest', description: 'Clean light green panels with leafy SVG outlines.', psychologist: 'Represents growth, ecology, and wellness.' },
    { id: 'sunset', name: 'Sunset', description: 'Warm orange gradients with fluid design shapes.', psychologist: 'Feels energetic, optimistic, and welcoming.' },
    { id: 'marketing', name: 'Marketing', description: 'Vibrant violet-to-pink mesh gradients.', psychologist: 'High energy, creativity, and customer-focused.' },
    { id: 'cyberpunk', name: 'Cyberpunk', description: 'Glowing grid overlays and monospace styles.', psychologist: 'Bold, tech-saturated, and highly modern.' },
    { id: 'classic', name: 'Classic', description: 'Minimalist white background with clean blue lines.', psychologist: 'Classic, readable, and highly professional.' }
  ];

  const scoredThemes = themes.map(t => {
    let score = 50; // base score
    let reasons = [];

    // Topic matching
    if (topic === 'technology' || topic === 'cyberpunk') {
      if (t.id === 'technology') { score += 35; reasons.push(`Perfect match for technology topic: "${profile.inferredTopic}"`); }
      if (t.id === 'cyberpunk') { score += 25; reasons.push('Futuristic tone complements tech presentation'); }
    }
    if (topic === 'corporate') {
      if (t.id === 'corporate') { score += 35; reasons.push('Corporate style matches business/finance keywords'); }
      if (t.id === 'classic') { score += 20; reasons.push('Classic theme provides clean business presentation'); }
    }
    if (topic === 'academic') {
      if (t.id === 'academic') { score += 35; reasons.push('Academic design supports educational & literature content'); }
      if (t.id === 'classic') { score += 15; reasons.push('Minimalist structure helps detail-heavy slides'); }
    }
    if (topic === 'forest') {
      if (t.id === 'forest') { score += 40; reasons.push('Forest theme colors represent natural & environmental topics'); }
    }
    if (topic === 'sunset') {
      if (t.id === 'sunset') { score += 40; reasons.push('Warm colors highlight travel & leisure topic'); }
    }
    if (topic === 'marketing') {
      if (t.id === 'marketing') { score += 35; reasons.push('High-energy gradients draw attention to marketing content'); }
    }

    // Purpose matching
    if (purpose === 'business') {
      if (t.id === 'corporate') { score += 20; reasons.push('Corporate colors suit business reporting'); }
      if (t.id === 'classic') { score += 15; reasons.push('Classic clean style helps structured reporting'); }
    } else if (purpose === 'startup pitch') {
      if (t.id === 'technology' || t.id === 'marketing') { score += 25; reasons.push('Highly energetic theme matches startup pitching'); }
    } else if (purpose === 'education' || purpose === 'research') {
      if (t.id === 'academic') { score += 25; reasons.push('Perfect match for study & lecture materials'); }
    }

    // Tone & title keywords matching
    if (tone === 'academic' && t.id === 'academic') { score += 15; reasons.push('Scholarly tone alignment'); }
    if (tone === 'creative' && (t.id === 'marketing' || t.id === 'sunset')) { score += 15; reasons.push('Creative delivery tone match'); }
    if (tone === 'professional' && (t.id === 'corporate' || t.id === 'technology')) { score += 15; reasons.push('Professional corporate setting match'); }
    
    if (title.includes('cyber') && t.id === 'cyberpunk') { score += 20; reasons.push('Title specifically mentions cyber security/tech'); }
    if (title.includes('sales') && t.id === 'corporate') { score += 15; reasons.push('Sells pitch fits Corporate colors'); }

    // Color psychology reasons
    if (t.id === 'technology') reasons.push('Cool cyan and dark backgrounds inspire innovation');
    if (t.id === 'corporate') reasons.push('Navy accents evoke trust and corporate professionalism');
    if (t.id === 'marketing') reasons.push('High-impact purple-pink vibes enhance engagement');

    // Learning System preference boost
    const preferenceCount = themeCounts[t.id] || 0;
    if (preferenceCount > 0) {
      const boost = Math.min(preferenceCount * 8, 25);
      score += boost;
      reasons.push(`Preferred theme (boosted by user history)`);
    }

    // Caps
    score = Math.min(Math.max(score, 10), 99);

    return {
      ...t,
      score: Math.round(score),
      reason: reasons[0] || 'Matches general presentation guidelines.',
      reasons
    };
  });

  // Sort descending by score
  return scoredThemes.sort((a, b) => b.score - a.score);
};

/**
 * Score layouts for active slide based on profile
 */
export const getLayoutRecommendations = (presentation, profile, activeSlideIdx = 0) => {
  if (!presentation || !profile) return [];

  const prefs = getUserPreferences();
  const layoutCounts = prefs.layouts || {};
  const slide = profile.activeSlide;

  const layouts = [
    { id: 'title', name: 'Title', description: 'Bold heading, full-bleed images, clean dividers.', bestFor: 'Introductory or wrap-up slides.' },
    { id: 'bullets', name: 'Bullets', description: 'Traditional list layout with elegant bullet markers.', bestFor: 'Detailed point-by-point explanations.' },
    { id: 'columns', name: 'Columns', description: 'Side-by-side cards comparing traits/topics.', bestFor: 'Comparisons, features, and columns.' },
    { id: 'stats', name: 'Stats', description: 'Grid of large highlight metrics and key tags.', bestFor: 'Financial reports and statistics.' },
    { id: 'timeline', name: 'Timeline', description: 'Progress milestones along a clean axis.', bestFor: 'Process flows and company history.' }
  ];

  const scoredLayouts = layouts.map(l => {
    let score = 50; // base score
    let reasons = [];

    // Title layout
    if (l.id === 'title') {
      if (activeSlideIdx === 0) {
        score += 45; reasons.push('First slide should establish presentation title');
      } else if (slide.bulletCount <= 1 && slide.title.length > 20) {
        score += 20; reasons.push('Short bullet count is best suited for visual title layout');
      } else {
        score -= 25;
      }
    }

    // Timeline layout
    if (l.id === 'timeline') {
      if (slide.hasTimelineData) {
        score += 45; reasons.push('Content contains milestones or sequential stages');
      } else {
        score -= 20;
      }
    }

    // Stats layout
    if (l.id === 'stats') {
      if (slide.hasStatistics) {
        score += 45; reasons.push('Slide includes key statistics or numerical metrics');
      } else {
        score -= 15;
      }
    }

    // Columns layout
    if (l.id === 'columns') {
      if (slide.hasComparison) {
        score += 40; reasons.push('Text compares features, pillars, or options side-by-side');
      } else if (slide.bulletCount === 3) {
        score += 25; reasons.push('Contains exactly 3 points, perfect for 3-column layout');
      } else {
        score -= 10;
      }
    }

    // Bullets layout
    if (l.id === 'bullets') {
      if (slide.bulletCount >= 4) {
        score += 35; reasons.push('Contains 4+ points, best organized in bullet list');
      } else if (!slide.hasTimelineData && !slide.hasStatistics && !slide.hasComparison) {
        score += 25; reasons.push('General text structures are cleanest in bullet formats');
      }
    }

    // Learning System preference boost
    const preferenceCount = layoutCounts[l.id] || 0;
    if (preferenceCount > 0) {
      const boost = Math.min(preferenceCount * 6, 20);
      score += boost;
      reasons.push('Preferred layout (boosted by user history)');
    }

    // Caps
    score = Math.min(Math.max(score, 10), 99);

    return {
      ...l,
      score: Math.round(score),
      reason: reasons[0] || 'Clean default layout layout for this content.',
      reasons
    };
  });

  // Sort descending by score
  return scoredLayouts.sort((a, b) => b.score - a.score);
};
