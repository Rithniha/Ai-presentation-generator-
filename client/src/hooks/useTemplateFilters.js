import { useMemo } from 'react';

/**
 * Scores a template based on the presentation requirements, target audience, and tone.
 */
function scoreTemplate(template, presentationState) {
  const { selectedRole, tone, title = '', requirements = '' } = presentationState;
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

  // 3. Keyword match from title and requirements
  const textToScan = `${title} ${requirements}`.toLowerCase();
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
export function useTemplateFilters(templates, activeCategory, searchQuery, presentationState) {
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

  // Perform filtering using activeCategory and searchQuery (AND logic)
  const filtered = useMemo(() => {
    return templates.filter(t => {
      // 1. Category check
      if (activeCategory !== 'All') {
        const catLower = activeCategory.toLowerCase();
        const matchesCategory = t.category.toLowerCase() === catLower ||
          t.tags.some(tag => tag.toLowerCase() === catLower);
        if (!matchesCategory) return false;
      }

      // 2. Search query check
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch = t.name.toLowerCase().includes(query) ||
          t.category.toLowerCase().includes(query) ||
          t.tags.some(tag => tag.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [templates, activeCategory, searchQuery]);

  // If no filters are active, sort recommended templates to the front
  const finalTemplates = useMemo(() => {
    const isFilterOrSearchActive = activeCategory !== 'All' || searchQuery.trim() !== '';
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
  }, [filtered, activeCategory, searchQuery, recommendedIds]);

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
