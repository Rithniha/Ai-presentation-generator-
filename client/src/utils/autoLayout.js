/**
 * Smart Auto Layout Engine
 * Handles bounding box collision detection and reflowing for slide elements.
 */

// Helper to parse pixel strings (e.g. "150px") to numbers
const parsePx = (val) => parseInt(val, 10) || 0;

// Convert an element's style into a numeric bounding box
const getBoundingBox = (el) => {
  const left = parsePx(el.style?.left);
  const top = parsePx(el.style?.top);
  
  let width = parsePx(el.style?.width);
  let height = parsePx(el.style?.height);

  // If in a browser environment, try to measure the actual rendered size (critical for height: auto)
  if (typeof document !== 'undefined') {
    const domEl = document.querySelector(`[data-el-key="${el.id}"]`);
    if (domEl) {
      const rect = domEl.getBoundingClientRect();
      if (!width) width = rect.width;
      if (!height) height = rect.height;
    }
  }

  // Fallback defaults if still no size
  if (!width) width = (el.type === 'text') ? 300 : (el.type === 'table' ? 400 : 360);
  if (!height) height = (el.type === 'text') ? 60 : (el.type === 'table' ? 200 : 220);

  return { left, top, width, height, right: left + width, bottom: top + height, id: el.id };
};

// Check if two bounding boxes intersect (with optional padding)
const checkCollision = (box1, box2, padding = 16) => {
  return !(
    box1.right + padding <= box2.left ||
    box1.left >= box2.right + padding ||
    box1.bottom + padding <= box2.top ||
    box1.top >= box2.bottom + padding
  );
};

/**
 * Finds an available position for a new element that doesn't overlap existing ones.
 * @param {Object} newEl - The element being inserted
 * @param {Array} existingElements - Elements already on the slide
 * @param {Object} canvasBounds - { width, height } of the slide
 * @returns {Object} { left, top }
 */
export const findAvailableSpace = (newEl, existingElements = [], canvasBounds = { width: 800, height: 450 }) => {
  const newBox = getBoundingBox(newEl);
  const padding = 20; // 20px minimum gap

  let currentLeft = 40;
  let currentTop = 40;
  let maxBottomInRow = 0;
  let found = false;

  // Simple scan algorithm: move left-to-right, top-to-bottom
  while (!found && currentTop < canvasBounds.height) {
    newBox.left = currentLeft;
    newBox.right = currentLeft + newBox.width;
    newBox.top = currentTop;
    newBox.bottom = currentTop + newBox.height;

    let collided = false;
    for (const el of existingElements) {
      const existingBox = getBoundingBox(el);
      if (checkCollision(newBox, existingBox, padding)) {
        collided = true;
        // Skip ahead to the right of this element
        currentLeft = existingBox.right + padding;
        maxBottomInRow = Math.max(maxBottomInRow, existingBox.bottom + padding);
        break;
      }
    }

    if (!collided) {
      // Check if it fits horizontally
      if (newBox.right <= canvasBounds.width - 20) {
        found = true;
      } else {
        // Doesn't fit in this row, move to next row
        currentLeft = 40;
        currentTop = maxBottomInRow > currentTop ? maxBottomInRow : currentTop + 40;
      }
    } else {
      // Collided, and we already advanced currentLeft
      if (currentLeft + newBox.width > canvasBounds.width - 20) {
        // Move to next row
        currentLeft = 40;
        currentTop = maxBottomInRow > currentTop ? maxBottomInRow : currentTop + 40;
      }
    }
  }

  // If the canvas is completely full, we fallback to cascading slightly off the center
  if (!found) {
    const offset = (existingElements.length * 20) % 100;
    return { left: 100 + offset + 'px', top: 100 + offset + 'px' };
  }

  return { left: currentLeft + 'px', top: currentTop + 'px' };
};

/**
 * Pushes elements down if they intersect with the source element (triggerElement).
 * Used when an element resizes (e.g. text wrapping) or is dropped.
 * @param {Array} elements - All elements
 * @param {String} triggerElementId - The element that changed size/position
 * @param {Number} padding - Space to maintain between elements
 * @returns {Array} Updated elements array with adjusted positions
 */
export const resolveCollisions = (elements, triggerElementId, padding = 16) => {
  const triggerEl = elements.find(e => e.id === triggerElementId);
  if (!triggerEl) return elements;

  const triggerBox = getBoundingBox(triggerEl);
  let updatedElements = [...elements];
  let changesMade = false;

  // We want to push elements that are *below* the trigger element downwards
  updatedElements = updatedElements.map(el => {
    if (el.id === triggerElementId) return el;
    
    const box = getBoundingBox(el);
    
    // Check if it overlaps
    if (checkCollision(triggerBox, box, padding)) {
      // If the element's center is below the trigger's center, push it down
      const triggerCenterY = triggerBox.top + (triggerBox.height / 2);
      const elCenterY = box.top + (box.height / 2);
      
      if (elCenterY >= triggerCenterY) {
        const newTop = triggerBox.bottom + padding;
        changesMade = true;
        return {
          ...el,
          style: {
            ...el.style,
            top: `${newTop}px`
          }
        };
      }
    }
    return el;
  });

  return updatedElements;
};

/**
 * Resolves all overlaps in a layout (e.g. when importing/redesigning slide).
 */
export const reflowEntireSlide = (elements, canvasBounds = { width: 800, height: 450 }) => {
  // Sort elements top-to-bottom so we flow downwards
  let sorted = [...elements].sort((a, b) => getBoundingBox(a).top - getBoundingBox(b).top);
  
  for (let i = 0; i < sorted.length; i++) {
    const triggerId = sorted[i].id;
    // Pushes lower elements down
    sorted = resolveCollisions(sorted, triggerId, 20); 
  }
  return sorted;
};

/**
 * Strict layer management
 */
export const getZIndexForType = (type) => {
  switch (type) {
    case 'background': return 1;
    case 'image': return 2;
    case 'shape': return 3;
    case 'chart': return 3;
    case 'table': return 4;
    case 'mindmap': return 4;
    case 'body': return 5;
    case 'text': return 6; // Default text
    case 'heading': return 7;
    case 'title': return 8;
    default: return 5;
  }
};
