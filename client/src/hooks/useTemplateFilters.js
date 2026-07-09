import { useMemo } from 'react';

/**
 * Scores a template based on the presentation requirements, target audience, tone, and industry.
 */
function scoreTemplate(template, presentationState) {
  const { selectedRole, tone, title = '', requirements = '', industry: stateIndustry = '' } = presentationState;
  let score = 0;

  // 1. Target Audience Role match
  if (selectedRole === 'student') {
    if (template.category === 'Education') score += 5;
    if (template.tags.some(tag => ['academic', 'research'].includes(tag.toLowerCase()))) score += 3;
    if (template.users.toLowerCase().includes('student')) score += 3;
  } else if (selectedRole === 'professor') {
    if (template.category === 'Education') score += 5;
    if (template.tags.some(tag => ['academic', 'research'].includes(tag.toLowerCase()))) score += 3;
    if (template.users.toLowerCase().includes('professor') || template.users.toLowerCase().includes('researcher')) score += 3;
  } else if (selectedRole === 'business') {
    if (['Business', 'Pitch', 'Marketing', 'Healthcare'].includes(template.category)) score += 4;
    const bizTags = ['business', 'executive', 'startup', 'investor', 'campaign', 'finance', 'banking', 'medical', 'healthcare'];
    if (template.tags.some(tag => bizTags.includes(tag.toLowerCase()))) score += 2;
    const bizUsers = ['executive', 'consultant', 'analyst', 'founder', 'vc', 'manager', 'cfo', 'accountant', 'doctor'];
    if (bizUsers.some(user => template.users.toLowerCase().includes(user))) score += 2;
  }

  // 2. Delivery Tone match
  if (tone) {
    const toneLower = tone.toLowerCase();
    if (toneLower === 'academic') {
      if (template.category === 'Education') score += 4;
      if (template.tags.some(tag => tag.toLowerCase() === 'academic')) score += 3;
      if (template.font.toLowerCase().includes('serif') || template.font === 'Merriweather') score += 2;
    } else if (toneLower === 'professional') {
      if (['Business', 'General'].includes(template.category)) score += 3;
      if (template.tags.some(tag => ['executive', 'clean', 'finance'].includes(tag.toLowerCase()))) score += 2;
    } else if (toneLower === 'confident') {
      if (['Pitch', 'Tech', 'Creative'].includes(template.category)) score += 3;
      if (template.tags.some(tag => ['startup', 'investor', 'design'].includes(tag.toLowerCase()))) score += 2;
    } else if (toneLower === 'persuasive') {
      if (['Pitch', 'Marketing'].includes(template.category)) score += 4;
      if (template.tags.some(tag => ['campaign', 'investor', 'startup'].includes(tag.toLowerCase()))) score += 2;
    } else if (toneLower === 'friendly') {
      if (['Creative', 'General'].includes(template.category)) score += 3;
      if (template.tags.some(tag => ['clean', 'portfolio'].includes(tag.toLowerCase()))) score += 2;
    }
  }

  // 3. Industry match & keyword extraction
  const templateIndustry = (template.industry || '').toLowerCase();
  const stateIndLower = (stateIndustry || '').toLowerCase();
  if (stateIndLower && templateIndustry === stateIndLower) {
    score += 5;
  }

  const textToScan = `${title} ${requirements}`.toLowerCase();
  
  // Detect industry keywords in topic/requirements
  const industryKeywords = {
    tech: ['tech', 'technology', 'software', 'app', 'developer', 'engineering', 'programming', 'code', 'ai', 'cyber', 'saas', 'data', 'cloud'],
    finance: ['finance', 'bank', 'banking', 'money', 'investment', 'funding', 'revenue', 'vc', 'pitch', 'cfo', 'quarterly', 'report', 'stock'],
    education: ['education', 'academic', 'research', 'thesis', 'student', 'professor', 'school', 'university', 'learning', 'class', 'course'],
    marketing: ['marketing', 'campaign', 'brand', 'social', 'media', 'viral', 'engagement', 'conversion', 'ad', 'growth', 'seo'],
    healthcare: ['healthcare', 'medical', 'clinical', 'doctor', 'hospital', 'spa', 'wellness', 'biological', 'science', 'health'],
    creative: ['creative', 'design', 'portfolio', 'art', 'artist', 'agency', 'illustration', 'memphis', 'vintage', 'concept']
  };

  Object.entries(industryKeywords).forEach(([ind, keywords]) => {
    if (keywords.some(word => textToScan.includes(word))) {
      if (templateIndustry === ind) {
        score += 4;
      }
    }
  });

  // 4. Keyword match from title and requirements
  if (textToScan.trim()) {
    // Check if name is in text
    if (textToScan.includes(template.name.toLowerCase())) score += 3;
    // Check if category is in text
    if (textToScan.includes(template.category.toLowerCase())) score += 2;
    // Check if any tag is in text
    template.tags.forEach(tag => {
      if (textToScan.includes(tag.toLowerCase())) score += 1.5;
    });
    // Check users
    const userWords = template.users.toLowerCase().split(/[\s,]+/);
    userWords.forEach(word => {
      if (word.length > 3 && textToScan.includes(word)) {
        score += 0.5;
      }
    });
  }

  return score;
}

/**
 * Shared compatibility score calculator.
 * Computes a percentage (70-99%) based on template details and user selections.
 */
export function getCompatibilityScore(template, presentationState) {
  const score = scoreTemplate(template, presentationState);
  return Math.min(99, Math.max(70, 70 + Math.round(score * 2.5)));
}

/**
 * Custom hook for filtering and sorting templates based on category, search query, and AI recommendation logic.
 */
export function useTemplateFilters(templates, activeCategory, searchQuery, presentationState, activeCollection = null, advancedFilters = {}) {
  // Score all templates based on user config
  const scoredTemplates = useMemo(() => {
    return templates.map(t => ({
      template: t,
      score: scoreTemplate(t, presentationState)
    }));
  }, [templates, presentationState]);

  // Identify the top 3 templates that match best (score > 0)
  const recommendedIds = useMemo(() => {
    const sorted = [...scoredTemplates]
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score);
    return new Set(sorted.slice(0, 3).map(x => x.template.id));
  }, [scoredTemplates]);

  // Perform filtering using activeCategory, searchQuery, activeCollection, and advancedFilters
  const filtered = useMemo(() => {
    return templates.filter(t => {
      // 1. Category check
      if (activeCategory !== 'All') {
        const catLower = activeCategory.toLowerCase();
        const matchesCategory = t.category.toLowerCase() === catLower ||
          t.tags.some(tag => tag.toLowerCase() === catLower);
        if (!matchesCategory) return false;
      }

      // 2. Search query check (tokenized match)
      if (searchQuery.trim()) {
        const queryTokens = searchQuery.toLowerCase().trim().split(/\s+/);
        const matchesSearch = queryTokens.every(token => 
          t.name.toLowerCase().includes(token) ||
          t.category.toLowerCase().includes(token) ||
          (t.industry || '').toLowerCase().includes(token) ||
          (t.style || '').toLowerCase().includes(token) ||
          t.desc.toLowerCase().includes(token) ||
          t.tags.some(tag => tag.toLowerCase().includes(token))
        );
        if (!matchesSearch) return false;
      }

      // 3. Collection filter
      if (activeCollection) {
        const col = activeCollection;
        if (col === '🔥 Trending') {
          if (!t.badges?.includes('🔥 Trending')) return false;
        } else if (col === '🤖 AI Collection') {
          if (!t.badges?.includes('🤖 AI Generated') && !t.tags.includes('AI') && t.id !== 'technology' && t.id !== 'cyberpunk') return false;
        } else if (col === '🚀 Startup Collection') {
          if (t.category !== 'Pitch' && !t.tags.some(x => x.toLowerCase().includes('startup'))) return false;
        } else if (col === '💼 Corporate Collection') {
          if (t.category !== 'Business' && t.industry !== 'Corporate' && !t.tags.some(x => x.toLowerCase().includes('corporate'))) return false;
        } else if (col === '📚 Academic Collection') {
          if (t.category !== 'Education' && t.industry !== 'Education' && !t.tags.some(x => x.toLowerCase().includes('academic'))) return false;
        } else if (col === '🏥 Healthcare Collection') {
          if (t.category !== 'Healthcare' && t.industry !== 'Healthcare') return false;
        } else if (col === '🎨 Creative Collection') {
          if (t.category !== 'Creative' && t.style !== 'Creative' && !t.tags.some(x => x.toLowerCase().includes('creative'))) return false;
        } else if (col === '💰 Finance Collection') {
          if (t.industry !== 'Finance' && !t.tags.some(x => x.toLowerCase().includes('finance'))) return false;
        } else if (col === '✨ Minimal Collection') {
          if (t.style !== 'Minimal' && !t.tags.some(x => x.toLowerCase().includes('minimal'))) return false;
        } else if (col === '🔮 Glass Collection') {
          if (t.style !== 'Glassmorphism') return false;
        } else if (col === '🌙 Dark Collection') {
          if (t.style !== 'Dark' && !t.tags.some(x => x.toLowerCase().includes('dark'))) return false;
        }
      }

      // 4. Advanced filters check
      if (advancedFilters) {
        const { industry, style, color, themeMode, animated, minimal, glassmorphism, premium, aiGenerated } = advancedFilters;
        
        if (industry && industry !== 'All') {
          if ((t.industry || '').toLowerCase() !== industry.toLowerCase()) return false;
        }
        if (style && style !== 'All') {
          if ((t.style || '').toLowerCase() !== style.toLowerCase()) return false;
        }
        if (color && color !== 'All') {
          const c = color.toLowerCase();
          const matchColor = (
            (c === 'blue' && (t.accent.toLowerCase().includes('blue') || t.accent.toLowerCase().includes('sky') || t.accent === '#3b82f6' || t.accent === '#06b6d4' || t.accent === '#0284c7' || t.accent === '#38bdf8' || t.accent === '#1e3a8a')) ||
            (c === 'green' && (t.accent.toLowerCase().includes('green') || t.accent === '#10b981' || t.accent === '#16a34a')) ||
            (c === 'yellow' && (t.accent.toLowerCase().includes('yellow') || t.accent === '#ca8a04' || t.accent === '#d97706' || t.accent === '#facc15')) ||
            (c === 'pink' && (t.accent.toLowerCase().includes('pink') || t.accent.toLowerCase().includes('magenta') || t.accent.toLowerCase().includes('coral') || t.accent === '#e11d74' || t.accent === '#ec4899' || t.accent === '#d946ef')) ||
            (c === 'dark' && (t.bg === '#0f0f1a' || t.bg === '#0a0f1e' || t.bg === '#0d2818' || t.bg === '#0f0f14' || t.bg === '#050505' || t.bg === '#0d0d0d' || t.bg === '#111827' || t.bg === '#0f172a')) ||
            (c === 'light' && (t.bg === '#ffffff' || t.bg === '#f5f0e8' || t.bg === '#fff0f5' || t.bg === '#f0f9ff' || t.bg === '#fef3c7' || t.bg === '#fdf4ff' || t.bg === '#f0fdf4' || t.bg === '#fef9c3' || t.bg === '#fff7ed' || t.bg === '#faf7f5' || t.bg === '#fafaf9' || t.bg === '#f8fafc' || t.bg === '#fef2f2' || t.bg === '#faf5ff'))
          );
          if (!matchColor) return false;
        }
        if (themeMode && themeMode !== 'All') {
          const isDarkBg = ['#0f0f1a', '#0a0f1e', '#0d2818', '#0f0f14', '#050505', '#0d0d0d', '#111827', '#0f172a'].includes(t.bg);
          if (themeMode === 'Dark' && !isDarkBg) return false;
          if (themeMode === 'Light' && isDarkBg) return false;
        }
        if (animated && !t.animated) return false;
        if (minimal && t.style !== 'Minimal') return false;
        if (glassmorphism && t.style !== 'Glassmorphism') return false;
        if (premium && !t.badges?.some(b => b.toLowerCase().includes('premium'))) return false;
        if (aiGenerated && !t.badges?.some(b => b.toLowerCase().includes('ai generated'))) return false;
      }

      return true;
    });
  }, [templates, activeCategory, searchQuery, activeCollection, advancedFilters]);

  // If no filters are active, sort recommended templates to the front
  const finalTemplates = useMemo(() => {
    const isFilterOrSearchActive = activeCategory !== 'All' || searchQuery.trim() !== '' || activeCollection !== null || Object.values(advancedFilters).some(v => v && v !== 'All');
    if (isFilterOrSearchActive) {
      return filtered;
    } else {
      const recommended = [];
      const others = [];
      filtered.forEach(t => {
        if (recommendedIds.has(t.id)) {
          recommended.push(t);
        } else {
          others.push(t);
        }
      });
      return [...recommended, ...others];
    }
  }, [filtered, activeCategory, searchQuery, recommendedIds, activeCollection, advancedFilters]);

  // Memoized compatibility scores map
  const compatibilityScores = useMemo(() => {
    const map = {};
    templates.forEach(t => {
      map[t.id] = getCompatibilityScore(t, presentationState);
    });
    return map;
  }, [templates, presentationState]);

  return {
    filteredTemplates: finalTemplates,
    recommendedIds,
    compatibilityScores
  };
}
