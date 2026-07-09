/**
 * imageSearch.js  — AI-powered image retrieval service
 *
 * Sources used (zero API-key required):
 *   • Unsplash Source  — https://source.unsplash.com/featured/{w}x{h}/?{query}
 *   • Picsum Photos    — https://picsum.photos/seed/{seed}/{w}/{h}
 *
 * With free API keys (optional, better results):
 *   • Unsplash API     — https://api.unsplash.com/
 *   • Pexels API       — https://api.pexels.com/
 *
 * Set env vars in client/.env:
 *   VITE_UNSPLASH_ACCESS_KEY=your_key
 *   VITE_PEXELS_API_KEY=your_key
 */

// ── Optional API keys from .env ──
const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || null;
const PEXELS_KEY   = import.meta.env.VITE_PEXELS_API_KEY   || null;

// ── In-memory cache: query → array of image objects ──
const imageCache = new Map();

// ── Track all image IDs used in current session to prevent duplicates ──
const globalUsedImageIds = new Set();

/* ══════════════════════════════════════════════
   KEYWORD EXTRACTION
══════════════════════════════════════════════ */

/**
 * Stop-words to strip before building keyword queries.
 */
const STOP_WORDS = new Set([
  'a','an','the','and','or','but','in','on','at','to','for','of','with','by',
  'from','up','about','into','through','during','before','after','is','was',
  'are','were','be','been','being','have','has','had','do','does','did','will',
  'would','could','should','may','might','shall','can','this','that','these',
  'those','it','its','we','they','our','their','he','she','his','her','them',
  'there','here','where','when','which','who','how','why','what','all','each',
  'both','few','more','most','other','some','such','than','too','very','just',
  'because','so','if','as','not','also','use','used','using','key','main',
  'slide','slides','overview','introduction','conclusion','summary','page'
]);

/**
 * Extract the most meaningful keywords from a slide's content,
 * enriched with the presentation title/topic for better relevance.
 *
 * @param {object} slide              — { title, content[], layout }
 * @param {object} presentationMeta  — { title, topic, audience, tone }
 * @param {number} [count=5]         — number of keyword phrases to return
 * @returns {string[]}
 */
export function extractKeywords(slide, presentationMeta = {}, count = 5) {
  const { title: presTitle = '', topic = '', audience = '', tone = '' } = presentationMeta;
  const slideTitle   = slide.title || '';
  const slideContent = (slide.content || []).join(' ');

  // Weight: slide title × 3, presentation title × 2, bullets × 1
  const rawText = [
    slideTitle, slideTitle, slideTitle,
    presTitle, presTitle,
    topic,
    slideContent
  ].join(' ').toLowerCase();

  // Tokenise and filter
  const tokens = rawText
    .replace(/[^a-z0-9\s'-]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2 && !STOP_WORDS.has(t));

  // Frequency map
  const freq = {};
  tokens.forEach(t => { freq[t] = (freq[t] || 0) + 1; });

  // Sort by frequency, take top candidates
  const topWords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .map(([w]) => w)
    .slice(0, 12);

  // Build keyword queries: single words + pairs
  const queries = [];
  topWords.slice(0, count).forEach(w => queries.push(w));

  // Add a combined phrase for better context
  if (topWords.length >= 2) {
    queries.unshift(`${topWords[0]} ${topWords[1]}`);
  }

  // Inject domain-specific boosts
  const domainBoosts = detectDomainBoosts(presTitle, topic, slideTitle);
  domainBoosts.forEach(b => queries.unshift(b));

  // Deduplicate and return
  return [...new Set(queries)].slice(0, count);
}

/**
 * Detects presentation domain and injects curated high-relevance queries.
 * E.g. "space exploration" → ["NASA", "rocket launch", "ISS"]
 */
function detectDomainBoosts(presTitle, topic, slideTitle) {
  const combined = `${presTitle} ${topic} ${slideTitle}`.toLowerCase();
  const boosts = [];

  const domainMap = [
    { keys: ['space','nasa','rocket','astronaut','cosmos','galaxy','mars','moon','orbit'],
      vals: ['NASA rocket launch','space exploration','astronaut','ISS space station'] },
    { keys: ['climate','environment','green','eco','sustainable','carbon','nature'],
      vals: ['nature landscape','renewable energy','environmental sustainability','green earth'] },
    { keys: ['ai','artificial intelligence','machine learning','neural','deep learning','robot'],
      vals: ['artificial intelligence','neural network visualization','machine learning','technology future'] },
    { keys: ['health','medical','medicine','hospital','doctor','patient','healthcare'],
      vals: ['medical technology','healthcare professional','hospital modern','health wellness'] },
    { keys: ['finance','financial','investment','stock','market','economy','banking'],
      vals: ['financial technology','investment growth','stock market','business finance'] },
    { keys: ['education','school','learning','student','university','college','teacher'],
      vals: ['education learning','students university','classroom modern','academic research'] },
    { keys: ['startup','entrepreneur','innovation','business','company','corporate'],
      vals: ['business team','startup office','entrepreneur innovation','corporate meeting'] },
    { keys: ['technology','software','code','developer','programming','digital','cyber'],
      vals: ['software development','coding technology','digital innovation','tech workspace'] },
    { keys: ['food','restaurant','cuisine','chef','cooking','nutrition','diet'],
      vals: ['gourmet food','restaurant cuisine','chef cooking','healthy nutrition'] },
    { keys: ['travel','tourism','adventure','destination','culture','world','global'],
      vals: ['travel landscape','adventure destination','cultural tourism','world landmarks'] },
    { keys: ['sport','fitness','athlete','training','exercise','game','competition'],
      vals: ['athlete training','sports performance','fitness workout','competition arena'] },
    { keys: ['architecture','design','building','urban','city','infrastructure'],
      vals: ['modern architecture','city skyline','urban design','building interior'] },
  ];

  for (const { keys, vals } of domainMap) {
    if (keys.some(k => combined.includes(k))) {
      boosts.push(...vals.slice(0, 2));
      break;
    }
  }

  return boosts;
}

/* ══════════════════════════════════════════════
   IMAGE FETCHING — UNSPLASH API (best quality)
══════════════════════════════════════════════ */

async function fetchUnsplashAPI(query, count = 5) {
  if (!UNSPLASH_KEY) return [];
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape&content_filter=high`;
  try {
    const res = await fetch(url, { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map(p => ({
      id: `unsplash-${p.id}`,
      src: p.urls.regular,
      srcFull: p.urls.full,
      srcThumb: p.urls.small,
      alt: p.alt_description || p.description || query,
      author: p.user?.name || 'Unsplash',
      authorUrl: p.user?.links?.html || 'https://unsplash.com',
      source: 'Unsplash',
      width: p.width,
      height: p.height,
      color: p.color,
    }));
  } catch { return []; }
}

/* ══════════════════════════════════════════════
   IMAGE FETCHING — PEXELS API
══════════════════════════════════════════════ */

async function fetchPexelsAPI(query, count = 5) {
  if (!PEXELS_KEY) return [];
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`;
  try {
    const res = await fetch(url, { headers: { Authorization: PEXELS_KEY } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.photos || []).map(p => ({
      id: `pexels-${p.id}`,
      src: p.src.large,
      srcFull: p.src.original,
      srcThumb: p.src.medium,
      alt: p.alt || query,
      author: p.photographer,
      authorUrl: p.photographer_url,
      source: 'Pexels',
      width: p.width,
      height: p.height,
      color: null,
    }));
  } catch { return []; }
}

/* ══════════════════════════════════════════════
   IMAGE FETCHING — UNSPLASH SOURCE (no key)
   Uses redirect URL to get a landscape image
══════════════════════════════════════════════ */

function buildUnsplashSourceImages(query, seed, count = 5) {
  const results = [];
  // Use different orientations / sizes for variety
  const sizes = ['1280x720', '1200x675', '1366x768', '1024x576', '960x540'];
  const topics = [query, `${query} professional`, `${query} modern`, `${query} concept`, `${query} abstract`];
  for (let i = 0; i < count; i++) {
    const sz = sizes[i % sizes.length];
    const q  = encodeURIComponent(topics[i % topics.length]);
    // Unique seed per variation prevents exact duplicates
    const uniqueSeed = `${seed}-v${i}`;
    results.push({
      id: `unsplash-src-${uniqueSeed}`,
      src: `https://source.unsplash.com/featured/${sz}/?${q}&sig=${Date.now() + i}`,
      srcFull: `https://source.unsplash.com/${sz}/?${q}&sig=${Date.now() + i}`,
      srcThumb: `https://source.unsplash.com/400x225/?${q}&sig=${Date.now() + i}`,
      alt: query,
      author: 'Unsplash',
      authorUrl: 'https://unsplash.com',
      source: 'Unsplash',
      width: parseInt(sz.split('x')[0]),
      height: parseInt(sz.split('x')[1]),
      color: null,
    });
  }
  return results;
}

/* ══════════════════════════════════════════════
   MAIN PUBLIC API
══════════════════════════════════════════════ */

/**
 * Search for images matching the given keyword query.
 * Tries Unsplash API → Pexels API → Unsplash Source URLs.
 *
 * @param {string}   query         — search query
 * @param {object}   [options]
 * @param {number}   [options.count=5]          — images to return
 * @param {Set}      [options.excludeIds]        — IDs to skip (dedup)
 * @param {boolean}  [options.forceRefresh=false]
 * @returns {Promise<ImageResult[]>}
 */
export async function searchImages(query, options = {}) {
  const { count = 5, excludeIds = new Set(), forceRefresh = false } = options;
  const cacheKey = `${query}::${count}`;

  if (!forceRefresh && imageCache.has(cacheKey)) {
    const cached = imageCache.get(cacheKey);
    return cached.filter(img => !excludeIds.has(img.id));
  }

  // Try real APIs first
  let results = [];
  if (UNSPLASH_KEY) {
    results = await fetchUnsplashAPI(query, count + 2);
  }
  if (results.length < count && PEXELS_KEY) {
    const pexels = await fetchPexelsAPI(query, count + 2);
    results = [...results, ...pexels].slice(0, count + 2);
  }

  // Fall back to Unsplash Source URLs (always works, no key)
  if (results.length === 0) {
    results = buildUnsplashSourceImages(query, query.replace(/\s+/g, '-'), count + 2);
  }

  imageCache.set(cacheKey, results);
  return results.filter(img => !excludeIds.has(img.id)).slice(0, count);
}

/**
 * Fetch images for every slide in a presentation simultaneously.
 * Returns a map: slideIndex → { primary: ImageResult, alternatives: ImageResult[] }
 *
 * @param {object[]} slides
 * @param {object}   presentationMeta
 * @param {number}   [imagesPerSlide=5]
 * @returns {Promise<Map<number, SlideImages>>}
 */
export async function fetchAllSlideImages(slides, presentationMeta, imagesPerSlide = 5) {
  const usedIds = new Set(globalUsedImageIds);
  const resultMap = new Map();

  // Build per-slide queries (run in parallel for speed)
  const tasks = slides.map(async (slide, idx) => {
    const keywords  = extractKeywords(slide, presentationMeta, 5);
    const primary   = keywords[0] || presentationMeta.title || 'presentation';
    const secondary = keywords[1] || keywords[0] || 'background';

    // Fetch primary query + one alternate query to maximise diversity
    const [primaryImgs, secondaryImgs] = await Promise.all([
      searchImages(primary,   { count: Math.ceil(imagesPerSlide / 2) + 1, excludeIds: usedIds }),
      searchImages(secondary, { count: Math.floor(imagesPerSlide / 2) + 1, excludeIds: usedIds }),
    ]);

    // Merge, deduplicate, exclude globally-used IDs
    const merged = [];
    [...primaryImgs, ...secondaryImgs].forEach(img => {
      if (!usedIds.has(img.id) && !merged.find(m => m.id === img.id)) {
        merged.push(img);
      }
    });

    const selected = merged.slice(0, imagesPerSlide);
    const [main, ...alts] = selected;

    if (main) {
      usedIds.add(main.id);
      globalUsedImageIds.add(main.id);
    }

    resultMap.set(idx, {
      slideIdx: idx,
      keywords,
      primary: main || null,
      alternatives: alts || [],
      query: primary,
    });
  });

  await Promise.all(tasks);
  return resultMap;
}

/**
 * Fetch images for a single slide. Excludes already-used IDs.
 */
export async function fetchSlideImages(slide, presentationMeta, usedIds = new Set(), count = 5) {
  const keywords = extractKeywords(slide, presentationMeta, 4);
  const query    = keywords[0] || presentationMeta.title || 'presentation';

  const imgs = await searchImages(query, { count: count + 2, excludeIds: usedIds });
  const [primary, ...alternatives] = imgs.slice(0, count);
  return { keywords, query, primary: primary || null, alternatives };
}

/** Mark an image ID as globally used so other slides won't reuse it. */
export function markImageUsed(imageId) {
  globalUsedImageIds.add(imageId);
}

/** Clear the session-level used-image tracking (e.g. on presentation reload). */
export function clearUsedImages() {
  globalUsedImageIds.clear();
}

/** Flush the response cache (e.g. for refresh). */
export function clearImageCache() {
  imageCache.clear();
}
