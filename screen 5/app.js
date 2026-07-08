// Outline Editor Application Logic

// All 20 Selectable Layout Templates
const layoutsData = [
  { id: "lay-1", title: "Title Slide", category: "basic", icon: "📄", bestFor: "First slide", desc: "Title, subtitle, and author with graphic background." },
  { id: "lay-2", title: "Title + Content", category: "basic", icon: "📄", bestFor: "Introductions & definition bullets", desc: "Title at the top, standard bullet list below." },
  { id: "lay-3", title: "Two-Column Layout", category: "basic", icon: "📄", bestFor: "Explaining dual concepts", desc: "Left side text, right side image, graphic or callout." },
  { id: "lay-4", title: "Comparison Layout", category: "basic", icon: "⚖️", bestFor: "Pros vs. Cons, Before vs. After", desc: "Side-by-side columns matching key values." },
  { id: "lay-5", title: "Thank You Slide", category: "basic", icon: "🙏", bestFor: "Concluding presentation", desc: "Thank you message, social icons, and contact QR code." },
  
  { id: "lay-6", title: "Image Focus", category: "image", icon: "🖼️", bestFor: "Visual product showcasing", desc: "Full-bleed background image with minimalist overlay." },
  { id: "lay-7", title: "Gallery Layout", category: "image", icon: "🖼️", bestFor: "Portfolios & event photos", desc: "Grid-arranged collection of image blocks with titles." },
  { id: "lay-8", title: "Team Layout", category: "image", icon: "👥", bestFor: "Introducing members", desc: "Team member photos, titles, roles, and profiles." },
  
  { id: "lay-9", title: "Statistics Layout", category: "data", icon: "📊", bestFor: "Key reports & metrics", desc: "Oversized numerical readouts and analytics indicators." },
  { id: "lay-10", title: "Chart Layout", category: "data", icon: "📈", bestFor: "Numeric trends visualization", desc: "Customizable visual graph components (bar, pie, line)." },
  { id: "lay-11", title: "Table Layout", category: "data", icon: "▤", bestFor: "Highly structured parameters", desc: "Data grid showing cross-referencing information lists." },
  
  { id: "lay-12", title: "Timeline Layout", category: "business", icon: "⏳", bestFor: "Chronological roadmaps", desc: "Horizontal sequence nodes displaying step dates." },
  { id: "lay-13", title: "Process Flow", category: "business", icon: "🔄", bestFor: "Workflows & procedures", desc: "Directional layout mapping inputs and outputs." },
  { id: "lay-14", title: "Diagram Layout", category: "business", icon: "🔀", bestFor: "Architectures & mindmaps", desc: "Flowcharts and relationship graphs linking entities." },
  { id: "lay-15", title: "SWOT Layout", category: "business", icon: "⚔️", bestFor: "Strategic planning reviews", desc: "4-quadrant layout separating internal/external traits." },
  
  { id: "lay-16", title: "Grid Layout", category: "startup", icon: "🚀", bestFor: "Highlighting features", desc: "2x2 cards with title icons and description lists." },
  { id: "lay-17", title: "Icon Cards", category: "startup", icon: "💡", bestFor: "Benefit summaries", desc: "List cards displaying key indicators with vector icons." },
  { id: "lay-18", title: "FAQ Layout", category: "startup", icon: "❓", bestFor: "Support, training, FAQs", desc: "Split panel showing questions alongside expanding answers." },
  { id: "lay-19", title: "Quote Layout", category: "startup", icon: "💬", bestFor: "Inspirational slides", desc: "Large stylized quote block with author highlight." },
  { id: "lay-20", title: "Custom AI Layout", category: "all", icon: "🤖", bestFor: "AI Recommended auto choice", desc: "Analyzes contents dynamically and updates layout templates." }
];

// Initial State representing the presentation outline structure
let outlineState = [
  {
    id: "slide-1",
    title: "Introduction to AI Design Engines",
    layoutId: "lay-1",
    bullets: [
      { id: "b1", text: "How layout predictions accelerate UI prototyping", indent: 0 },
      { id: "b2", text: "Comparing manual composition vs semantic structuring", indent: 1 },
      { id: "b3", text: "Why semantic structure must precede visual styling", indent: 2 },
      { id: "b4", text: "Overview of the outline representation schema", indent: 0 }
    ]
  },
  {
    id: "slide-2",
    title: "Semantic Analysis and Intent Extraction",
    layoutId: "lay-20", // Custom AI Layout
    bullets: [
      { id: "b5", text: "Leveraging large language models for component mapping", indent: 0 },
      { id: "b6", text: "Detecting contrast requirements, emphasis areas, and visual weights", indent: 1 },
      { id: "b7", text: "Translating list items into grid elements or timeline nodes", indent: 1 }
    ]
  },
  {
    id: "slide-3",
    title: "The Layout Selection Engine",
    layoutId: "lay-12",
    bullets: [
      { id: "b8", text: "Match slide text properties with suitable template patterns", indent: 0 },
      { id: "b9", text: "Computing layout scores and ranking alternative card structures", indent: 1 },
      { id: "b10", text: "Final layout synthesis: styling nodes with responsive CSS", indent: 2 }
    ]
  }
];

// Active Slide State
let activeSlideId = "slide-1";
let selectedCategory = "all";

// Helper to generate unique IDs
function generateId(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

// Global Drag & Drop State
let draggedBulletId = null;
let draggedSlideId = null;
let currentDropTarget = null;
let terminalDebounceTimer = null;

// Initial render
document.addEventListener("DOMContentLoaded", () => {
  renderTree();
  renderLayoutLibrary();
  initTerminal();
  setupEventListeners();
});

// Setup Page level click actions
function setupEventListeners() {
  document.getElementById("btn-add-slide").addEventListener("click", addSlide);
  document.getElementById("btn-generate-layouts").addEventListener("click", triggerLayoutGeneration);
  document.getElementById("btn-loading-done").addEventListener("click", closeLayoutOverlay);
  
  // Category tabs filtering
  const tabs = document.querySelectorAll(".lib-tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", (e) => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      selectedCategory = tab.dataset.category;
      renderLayoutLibrary();
    });
  });
}

// --- RENDER TREE ---
function renderTree() {
  const treeContainer = document.getElementById("outline-tree");
  treeContainer.innerHTML = "";

  outlineState.forEach((slide, slideIndex) => {
    const slideCard = document.createElement("div");
    slideCard.className = `slide-card ${slide.id === activeSlideId ? 'active' : ''}`;
    slideCard.dataset.slideId = slide.id;
    slideCard.setAttribute("draggable", "true");

    // Click to activate slide (only if not clicking inputs/buttons)
    slideCard.addEventListener("click", (e) => {
      if (e.target.closest(".bullet-node") || e.target.closest("button") || e.target.closest("input")) {
        return;
      }
      activeSlideId = slide.id;
      
      // Update active state in outline DOM
      document.querySelectorAll(".slide-card").forEach(card => card.classList.remove("active"));
      slideCard.classList.add("active");
      
      renderLayoutLibrary(); // Refresh library active highlighting
      writeTerminalInfo(`[SYSTEM] Switched edit view to Slide ${slideIndex + 1}`);
    });

    // Slide reordering (drag slide card)
    slideCard.addEventListener("dragstart", (e) => {
      if (e.target.closest(".bullet-node") || e.target.closest(".btn-add-bullet") || e.target.closest("input")) {
        e.preventDefault();
        return;
      }
      e.dataTransfer.setData("text/plain", `slide:${slide.id}`);
      slideCard.classList.add("dragging");
    });
    slideCard.addEventListener("dragend", () => {
      slideCard.classList.remove("dragging");
      removeDropIndicator();
    });

    // Slide Header
    const slideHeader = document.createElement("div");
    slideHeader.className = "slide-header";

    // Slide Drag Handle
    const dragHandle = document.createElement("div");
    dragHandle.className = "drag-handle";
    dragHandle.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="9" cy="5" r="1"></circle>
        <circle cx="9" cy="12" r="1"></circle>
        <circle cx="9" cy="19" r="1"></circle>
        <circle cx="15" cy="5" r="1"></circle>
        <circle cx="15" cy="12" r="1"></circle>
        <circle cx="15" cy="19" r="1"></circle>
      </svg>
    `;

    // Slide Badge Number
    const slideNumber = document.createElement("div");
    slideNumber.className = "slide-number";
    slideNumber.textContent = `SLIDE ${slideIndex + 1}`;

    // Slide layout badge indicator
    const layoutBadge = document.createElement("span");
    layoutBadge.className = "slide-layout-badge";
    const slideLayout = layoutsData.find(l => l.id === slide.layoutId);
    layoutBadge.textContent = slideLayout ? `${slideLayout.icon} ${slideLayout.title}` : "🤖 AI Auto";
    layoutBadge.addEventListener("click", () => {
      activeSlideId = slide.id;
      renderTree();
      renderLayoutLibrary();
    });

    // Title Input
    const titleInput = document.createElement("input");
    titleInput.className = "slide-title-input";
    titleInput.type = "text";
    titleInput.value = slide.title;
    titleInput.placeholder = "Enter slide title...";
    titleInput.addEventListener("input", (e) => {
      slide.title = e.target.value;
      triggerTerminalAI(slide.id);
    });

    // Delete Slide Button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-delete";
    deleteBtn.title = "Delete Slide";
    deleteBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>
    `;
    deleteBtn.addEventListener("click", () => deleteSlide(slide.id));

    slideHeader.appendChild(dragHandle);
    slideHeader.appendChild(slideNumber);
    slideHeader.appendChild(layoutBadge);
    slideHeader.appendChild(titleInput);
    slideHeader.appendChild(deleteBtn);
    slideCard.appendChild(slideHeader);

    // Bullets List Container
    const bulletsList = document.createElement("div");
    bulletsList.className = "bullets-list";
    bulletsList.dataset.slideId = slide.id;

    // Bullet Nodes
    slide.bullets.forEach((bullet) => {
      const bulletNode = document.createElement("div");
      bulletNode.className = `bullet-node bullet-indent-${bullet.indent}`;
      bulletNode.dataset.bulletId = bullet.id;
      bulletNode.dataset.slideId = slide.id;
      bulletNode.setAttribute("draggable", "true");

      // Bullet Drag Events
      bulletNode.addEventListener("dragstart", (e) => {
        e.stopPropagation();
        draggedBulletId = bullet.id;
        draggedSlideId = slide.id;
        bulletNode.classList.add("dragging");
        e.dataTransfer.setData("text/plain", `bullet:${bullet.id}`);
        e.dataTransfer.effectAllowed = "move";
      });

      bulletNode.addEventListener("dragend", (e) => {
        e.stopPropagation();
        bulletNode.classList.remove("dragging");
        handleBulletDropEnd();
      });

      // Drag Handle
      const bulletDragHandle = document.createElement("div");
      bulletDragHandle.className = "drag-handle";
      bulletDragHandle.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="9" cy="9" r="1"></circle>
          <circle cx="9" cy="15" r="1"></circle>
          <circle cx="9" cy="3" r="1"></circle>
          <circle cx="15" cy="9" r="1"></circle>
          <circle cx="15" cy="15" r="1"></circle>
          <circle cx="15" cy="3" r="1"></circle>
        </svg>
      `;

      const bulletDot = document.createElement("div");
      bulletDot.className = "bullet-dot";

      // Bullet Text Input
      const bulletInput = document.createElement("input");
      bulletInput.className = "bullet-input";
      bulletInput.type = "text";
      bulletInput.value = bullet.text;
      bulletInput.placeholder = "Enter bullet description...";
      bulletInput.addEventListener("input", (e) => {
        bullet.text = e.target.value;
        triggerTerminalAI(slide.id);
      });

      // Bullet action tools (Indent adjust, delete)
      const bulletActions = document.createElement("div");
      bulletActions.className = "bullet-actions";

      // Outdent (Decrease margin)
      const outdentBtn = document.createElement("button");
      outdentBtn.className = "btn-indent-adjust";
      outdentBtn.title = "Outdent (Shift Left)";
      outdentBtn.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="11 17 6 12 11 7"></polyline>
          <polyline points="18 17 13 12 18 7"></polyline>
        </svg>
      `;
      outdentBtn.disabled = bullet.indent === 0;
      outdentBtn.addEventListener("click", () => {
        if (bullet.indent > 0) {
          bullet.indent--;
          renderTree();
          triggerTerminalAI(slide.id);
        }
      });

      // Indent (Increase margin)
      const indentBtn = document.createElement("button");
      indentBtn.className = "btn-indent-adjust";
      indentBtn.title = "Indent (Shift Right)";
      indentBtn.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="13 17 18 12 13 7"></polyline>
          <polyline points="6 17 11 12 6 7"></polyline>
        </svg>
      `;
      indentBtn.disabled = bullet.indent === 2;
      indentBtn.addEventListener("click", () => {
        if (bullet.indent < 2) {
          bullet.indent++;
          renderTree();
          triggerTerminalAI(slide.id);
        }
      });

      // Delete bullet
      const deleteBulletBtn = document.createElement("button");
      deleteBulletBtn.className = "btn-delete";
      deleteBulletBtn.title = "Delete Bullet";
      deleteBulletBtn.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      `;
      deleteBulletBtn.addEventListener("click", () => deleteBullet(slide.id, bullet.id));

      bulletActions.appendChild(outdentBtn);
      bulletActions.appendChild(indentBtn);
      bulletActions.appendChild(deleteBulletBtn);

      bulletNode.appendChild(bulletDragHandle);
      bulletNode.appendChild(bulletDot);
      bulletNode.appendChild(bulletInput);
      bulletNode.appendChild(bulletActions);
      bulletsList.appendChild(bulletNode);
    });

    // Add Bullet Action Row
    const addBulletRow = document.createElement("div");
    addBulletRow.className = "add-bullet-row";
    const addBulletBtn = document.createElement("button");
    addBulletBtn.className = "btn-add-bullet";
    addBulletBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
      Add Bullet Point
    `;
    addBulletBtn.addEventListener("click", () => addBullet(slide.id));
    addBulletRow.appendChild(addBulletBtn);

    bulletsList.appendChild(addBulletRow);
    slideCard.appendChild(bulletsList);
    treeContainer.appendChild(slideCard);

    // Setup Drag Over behavior for positioning bullet inserts
    slideCard.addEventListener("dragover", (e) => {
      e.preventDefault();
      handleDragOver(e, slideCard, slide.id);
    });
  });
}

// --- RENDER LAYOUT LIBRARY ---
function renderLayoutLibrary() {
  const gridContainer = document.getElementById("library-grid");
  gridContainer.innerHTML = "";

  const activeSlide = outlineState.find(s => s.id === activeSlideId);
  const currentLayoutId = activeSlide ? activeSlide.layoutId : "";

  layoutsData.forEach(layout => {
    // Filter by selected category tab (Except the special "Custom AI Layout" which shows everywhere)
    if (selectedCategory !== "all" && layout.category !== selectedCategory && layout.id !== "lay-20") {
      return;
    }

    const card = document.createElement("div");
    card.className = `layout-card ${layout.id === currentLayoutId ? 'active' : ''}`;
    
    card.innerHTML = `
      <div class="layout-card-header">
        <div class="layout-card-title">
          <span>${layout.icon}</span>
          <span>${layout.title}</span>
        </div>
      </div>
      <div class="layout-card-desc">${layout.desc}</div>
      <div class="layout-card-footer">
        <span class="layout-card-badge">${layout.category.toUpperCase()}</span>
        <span class="layout-card-bestfor">For: ${layout.bestFor}</span>
      </div>
    `;

    card.addEventListener("click", () => {
      if (activeSlide) {
        activeSlide.layoutId = layout.id;
        
        // Re-render components to synchronize changes
        renderTree();
        renderLayoutLibrary();
        
        // Log manual override in terminal
        const slideIndex = outlineState.findIndex(s => s.id === activeSlideId) + 1;
        writeTerminalWarn(`[USER-OVERRIDE] Manually selected layout "${layout.title}" for Slide ${slideIndex}.`);
        
        // If Custom AI is selected, run predictions immediately
        if (layout.id === "lay-20") {
          runAIPredictionCycle(activeSlideId);
        }
      }
    });

    gridContainer.appendChild(card);
  });
}

// --- STATE MANAGEMENT ACTIONS ---

function addSlide() {
  const newSlide = {
    id: generateId("slide"),
    title: "",
    layoutId: "lay-20", // Default to AI recommended
    bullets: [
      { id: generateId("bullet"), text: "", indent: 0 }
    ]
  };
  outlineState.push(newSlide);
  activeSlideId = newSlide.id;
  renderTree();
  renderLayoutLibrary();
  
  // Focus new slide title
  setTimeout(() => {
    const inputs = document.querySelectorAll(".slide-title-input");
    if (inputs.length > 0) {
      inputs[inputs.length - 1].focus();
    }
  }, 50);

  writeTerminalInfo(`[SYSTEM] Added new slide: ${newSlide.id.toUpperCase()}`);
}

function deleteSlide(slideId) {
  const index = outlineState.findIndex(s => s.id === slideId);
  outlineState = outlineState.filter(s => s.id !== slideId);
  
  // Set new active slide if deleted slide was active
  if (activeSlideId === slideId && outlineState.length > 0) {
    activeSlideId = outlineState[Math.max(0, index - 1)].id;
  }
  
  renderTree();
  renderLayoutLibrary();
  writeTerminalWarn(`[SYSTEM] Deleted slide: ${slideId.toUpperCase()}`);
}

function addBullet(slideId) {
  const slide = outlineState.find(s => s.id === slideId);
  if (slide) {
    const newBullet = {
      id: generateId("bullet"),
      text: "",
      indent: 0
    };
    slide.bullets.push(newBullet);
    renderTree();

    // Focus the new bullet input
    setTimeout(() => {
      const slideElem = document.querySelector(`[data-slide-id="${slideId}"]`);
      if (slideElem) {
        const bulletInputs = slideElem.querySelectorAll(".bullet-input");
        if (bulletInputs.length > 0) {
          bulletInputs[bulletInputs.length - 1].focus();
        }
      }
    }, 50);

    writeTerminalInfo(`[AI-INFO] Added bullet node to Slide ${slideId.replace("slide-", "")}`);
    
    // Automatically recalculate layout if slide is set to Custom AI
    if (slide.layoutId === "lay-20") {
      triggerTerminalAI(slideId);
    }
  }
}

function deleteBullet(slideId, bulletId) {
  const slide = outlineState.find(s => s.id === slideId);
  if (slide) {
    slide.bullets = slide.bullets.filter(b => b.id !== bulletId);
    renderTree();
    writeTerminalWarn(`[AI-WARN] Removed bullet node from Slide ${slideId.replace("slide-", "")}`);
    
    // Automatically recalculate layout if slide is set to Custom AI
    if (slide.layoutId === "lay-20") {
      triggerTerminalAI(slideId);
    }
  }
}

// --- TREE DRAG & DROP LOGIC ---

function handleDragOver(e, slideCard, slideId) {
  const isDraggingSlide = document.querySelector(".slide-card.dragging");
  
  if (isDraggingSlide) {
    const outlineTree = document.getElementById("outline-tree");
    const afterElement = getDragAfterElement(outlineTree, e.clientY, ".slide-card:not(.dragging)");
    const draggingSlide = document.querySelector(".slide-card.dragging");
    
    if (afterElement == null) {
      outlineTree.appendChild(draggingSlide);
      currentDropTarget = { type: "slide-end", slideId: slideId };
    } else {
      outlineTree.insertBefore(draggingSlide, afterElement);
      const targetId = afterElement.dataset.slideId;
      currentDropTarget = { type: "slide-before", slideId: slideId, targetId: targetId };
    }
    return;
  }

  if (draggedBulletId) {
    const bulletsList = slideCard.querySelector(".bullets-list");
    const hoveredBullet = e.target.closest(".bullet-node:not(.dragging)");
    
    const listRect = bulletsList.getBoundingClientRect();
    const relativeX = e.clientX - listRect.left;
    const calculatedIndent = Math.min(2, Math.max(0, Math.floor(relativeX / 24)));

    let dropIndicator = document.getElementById("drop-indicator");
    if (!dropIndicator) {
      dropIndicator = document.createElement("div");
      dropIndicator.id = "drop-indicator";
      dropIndicator.className = "drop-indicator";
    }

    dropIndicator.style.marginLeft = `${calculatedIndent * 24}px`;

    if (hoveredBullet) {
      const bulletRect = hoveredBullet.getBoundingClientRect();
      const relativeY = e.clientY - bulletRect.top;

      if (relativeY < bulletRect.height / 2) {
        bulletsList.insertBefore(dropIndicator, hoveredBullet);
        currentDropTarget = {
          type: "bullet",
          slideId: slideId,
          targetBulletId: hoveredBullet.dataset.bulletId,
          position: "before",
          indent: calculatedIndent
        };
      } else {
        bulletsList.insertBefore(dropIndicator, hoveredBullet.nextSibling);
        currentDropTarget = {
          type: "bullet",
          slideId: slideId,
          targetBulletId: hoveredBullet.dataset.bulletId,
          position: "after",
          indent: calculatedIndent
        };
      }
    } else {
      const addBulletRow = bulletsList.querySelector(".add-bullet-row");
      bulletsList.insertBefore(dropIndicator, addBulletRow);
      currentDropTarget = {
        type: "bullet-end",
        slideId: slideId,
        indent: calculatedIndent
      };
    }
  }
}

// Snapping bullet node drop handler
function handleBulletDropEnd() {
  removeDropIndicator();

  if (currentDropTarget && draggedBulletId) {
    let draggedBullet = null;
    let originalSlide = null;

    outlineState.forEach(slide => {
      const idx = slide.bullets.findIndex(b => b.id === draggedBulletId);
      if (idx !== -1) {
        draggedBullet = slide.bullets[idx];
        originalSlide = slide;
        slide.bullets.splice(idx, 1);
      }
    });

    if (draggedBullet) {
      draggedBullet.indent = currentDropTarget.indent;
      const targetSlide = outlineState.find(s => s.id === currentDropTarget.slideId);
      
      if (targetSlide) {
        if (currentDropTarget.type === "bullet") {
          const insertIdx = targetSlide.bullets.findIndex(b => b.id === currentDropTarget.targetBulletId);
          if (insertIdx !== -1) {
            const finalIdx = currentDropTarget.position === "before" ? insertIdx : insertIdx + 1;
            targetSlide.bullets.splice(finalIdx, 0, draggedBullet);
          } else {
            targetSlide.bullets.push(draggedBullet);
          }
        } else {
          targetSlide.bullets.push(draggedBullet);
        }
        
        writeTerminalSuccess(`[AI-LAYOUT] Moved & snapped bullet node. New Indent: Level ${draggedBullet.indent}`);
        
        // Recalculate layout if slide uses Custom AI
        if (targetSlide.layoutId === "lay-20") {
          runAIPredictionCycle(targetSlide.id);
        }
      }
    }
  }

  const isDraggingSlide = document.querySelector(".slide-card.dragging");
  if (currentDropTarget && currentDropTarget.type && currentDropTarget.type.startsWith("slide")) {
    const draggingSlideId = document.querySelector(".slide-card.dragging")?.dataset.slideId;
    if (draggingSlideId) {
      const draggedSlideIdx = outlineState.findIndex(s => s.id === draggingSlideId);
      const draggedSlideObj = outlineState[draggedSlideIdx];
      outlineState.splice(draggedSlideIdx, 1);

      if (currentDropTarget.type === "slide-before") {
        const targetIdx = outlineState.findIndex(s => s.id === currentDropTarget.targetId);
        outlineState.splice(targetIdx, 0, draggedSlideObj);
      } else {
        outlineState.push(draggedSlideObj);
      }
      writeTerminalInfo(`[SYSTEM] Slide cards reordered successfully.`);
    }
  }

  draggedBulletId = null;
  draggedSlideId = null;
  currentDropTarget = null;
  renderTree();
  renderLayoutLibrary();
}

function removeDropIndicator() {
  const indicator = document.getElementById("drop-indicator");
  if (indicator) {
    indicator.remove();
  }
}

function getDragAfterElement(container, y, selector) {
  const draggableElements = [...container.querySelectorAll(selector)];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// --- LIVE AI TERMINAL SIMULATION ---

function initTerminal() {
  const terminal = document.getElementById("terminal-body");
  terminal.innerHTML = "";
  
  writeTerminalInfo("[SYSTEM] Booting AI Design Co-Pilot terminal...", 0);
  writeTerminalInfo("[SYSTEM] Loading semantic graph database...", 150);
  writeTerminalInfo("[SYSTEM] Fetching design tokens schema...", 300);
  writeTerminalSuccess("[SUCCESS] Connected to Layout Synthesis Model v3.5-Flash.", 450);
  writeTerminalInfo("[SYSTEM] Ready. Structure inputs are now being parsed.", 600);
}

function triggerTerminalAI(slideId) {
  clearTimeout(terminalDebounceTimer);
  terminalDebounceTimer = setTimeout(() => {
    runAIPredictionCycle(slideId);
  }, 800);
}

function runAIPredictionCycle(slideId) {
  const slide = outlineState.find(s => s.id === slideId);
  if (!slide) return;
  
  const slideIndex = outlineState.findIndex(s => s.id === slideId) + 1;
  const textKeywords = slide.title.split(" ").filter(w => w.length > 3).map(w => w.toUpperCase());
  const bulletCount = slide.bullets.length;

  writeTerminalInfo(`\n[AI-ANALYZER] Input delta detected in Slide ${slideIndex}. Parsing schema...`);
  
  // Custom AI content analysis (maps layout based on actual outline elements)
  let predictedLayout = "Title + Content";
  let matchedId = "lay-2";
  let explanation = "Bullet list layout matched.";
  let designConfidence = 75;

  // Analysis rules
  if (bulletCount === 0) {
    predictedLayout = "Title Slide";
    matchedId = "lay-1";
    explanation = "Single title node. Selected cover layout.";
    designConfidence = 95;
  } else if (bulletCount === 1) {
    predictedLayout = "Two-Column Layout";
    matchedId = "lay-3";
    explanation = "Compact content weight. Mapped side-by-side display.";
    designConfidence = 88;
  } else {
    // Check for specific content characteristics
    const hasNesting = slide.bullets.some(b => b.indent > 0);
    const textCombined = (slide.title + " " + slide.bullets.map(b => b.text).join(" ")).toLowerCase();
    
    if (textCombined.includes("vs") || textCombined.includes("versus") || textCombined.includes("pro") || textCombined.includes("con")) {
      predictedLayout = "Comparison Layout";
      matchedId = "lay-4";
      explanation = "Contrast terminology detected. Mapped side-by-side compare columns.";
      designConfidence = 92;
    } else if (textCombined.includes("step") || textCombined.includes("phase") || textCombined.includes("flow") || textCombined.includes("workflow")) {
      predictedLayout = "Process Flow";
      matchedId = "lay-13";
      explanation = "Sequence indicator terms detected. Selected arrow flow schema.";
      designConfidence = 89;
    } else if (textCombined.includes("date") || textCombined.includes("year") || textCombined.includes("milestone") || textCombined.includes("timeline") || textCombined.includes("history")) {
      predictedLayout = "Timeline Layout";
      matchedId = "lay-12";
      explanation = "Chronology keywords detected. Formed linear horizontal timeline.";
      designConfidence = 91;
    } else if (textCombined.includes("strengths") || textCombined.includes("swot") || textCombined.includes("weaknesses")) {
      predictedLayout = "SWOT Layout";
      matchedId = "lay-15";
      explanation = "Strategic grid terms matched. Loaded SWOT 4-quadrant layout.";
      designConfidence = 96;
    } else if (textCombined.includes("member") || textCombined.includes("team") || textCombined.includes("founder") || textCombined.includes("staff")) {
      predictedLayout = "Team Layout";
      matchedId = "lay-8";
      explanation = "People descriptors mapped. Rendered profile card directory.";
      designConfidence = 90;
    } else if (hasNesting) {
      predictedLayout = "Grid Layout";
      matchedId = "lay-16";
      explanation = "Hierarchical outline detected. Groups into 2x2 grids.";
      designConfidence = 84;
    }
  }

  // If the slide is set to "Custom AI Layout" (AI Recommended), auto-apply the recommendation!
  if (slide.layoutId === "lay-20" || !layoutsData.some(l => l.id === slide.layoutId)) {
    // Trigger visual notification of auto application
    setTimeout(() => {
      writeTerminalSuccess(`[AI-RECOMMENDED] Automatically applied "${predictedLayout}" to Slide ${slideIndex} (Reason: ${explanation})`);
      // Update badge in outline tree and layout selector highlighting
      const badge = document.querySelector(`[data-slide-id="${slideId}"] .slide-layout-badge`);
      if (badge) {
        badge.textContent = `🤖 ${predictedLayout}`;
      }
      renderLayoutLibrary();
    }, 400);
  }

  setTimeout(() => {
    writeTerminalInfo(`[AI-SEMANTICS] Core Topic Tags: [${textKeywords.slice(0, 3).join(", ") || "GENERAL"}]`);
  }, 150);

  setTimeout(() => {
    writeTerminalPredict(`[AI-PREDICTOR] Compiling layout matching weights...`);
    writeTerminalPredict(` - ${predictedLayout}: ${designConfidence}% (Rank 1 Match)`);
    writeTerminalPredict(` - Linear Slide Carousel: 68% (Fallback Match)`);
  }, 350);

  setTimeout(() => {
    writeTerminalSuccess(`[AI-INTELLIGENCE] Slide ${slideIndex} balance optimal. Grid distribution updated.`);
  }, 550);
}

function writeTerminalInfo(text, delay = 0) {
  addTerminalLine("info", text, delay);
}

function writeTerminalPredict(text, delay = 0) {
  addTerminalLine("predict", text, delay);
}

function writeTerminalSuccess(text, delay = 0) {
  addTerminalLine("success", text, delay);
}

function writeTerminalWarn(text, delay = 0) {
  addTerminalLine("warn", text, delay);
}

function addTerminalLine(type, text, delay) {
  const termBody = document.getElementById("terminal-body");
  
  const writeFunc = () => {
    const line = document.createElement("div");
    line.className = "term-line";
    
    const tag = document.createElement("span");
    tag.className = `term-tag ${type}`;
    
    const match = text.match(/^(\[[A-Z0-9-_\s]+\])(.*)/);
    if (match) {
      tag.textContent = match[1] + " ";
      line.appendChild(tag);
      line.appendChild(document.createTextNode(match[2]));
    } else {
      line.textContent = text;
    }
    
    const existingCursor = termBody.querySelector(".term-cursor");
    if (existingCursor) existingCursor.remove();
    
    termBody.appendChild(line);
    
    const cursor = document.createElement("span");
    cursor.className = "term-cursor";
    termBody.appendChild(cursor);
    
    termBody.scrollTop = termBody.scrollHeight;
  };

  if (delay > 0) {
    setTimeout(writeFunc, delay);
  } else {
    writeFunc();
  }
}

// --- TRANSITIONS & LAYOUT ENGINE LOADING OVERLAY ---

function triggerLayoutGeneration() {
  const overlay = document.getElementById("loading-overlay");
  const percentEl = document.getElementById("loading-percent");
  const previewGrid = document.getElementById("layout-preview-grid");
  const doneBtn = document.getElementById("btn-loading-done");
  
  percentEl.textContent = "0%";
  previewGrid.classList.remove("visible");
  doneBtn.style.display = "none";
  
  const stepElements = document.querySelectorAll(".loading-step");
  stepElements.forEach(step => {
    step.className = "loading-step";
    step.querySelector(".loading-step-icon").textContent = "○";
  });
  
  overlay.classList.add("visible");
  
  let currentPercent = 0;
  
  const progressInterval = setInterval(() => {
    currentPercent += Math.floor(Math.random() * 4) + 1;
    if (currentPercent > 100) currentPercent = 100;
    
    percentEl.textContent = `${currentPercent}%`;
    
    const stepRange = [20, 40, 60, 80, 100];
    
    stepRange.forEach((limit, idx) => {
      const stepNode = document.getElementById(`step-${idx}`);
      const iconNode = stepNode.querySelector(".loading-step-icon");
      
      if (currentPercent >= limit) {
        stepNode.className = "loading-step completed";
        iconNode.textContent = "✓";
      } else if (currentPercent >= (idx === 0 ? 0 : stepRange[idx - 1])) {
        stepNode.className = "loading-step active";
        iconNode.textContent = "▶";
      }
    });

    if (currentPercent === 100) {
      clearInterval(progressInterval);
      
      setTimeout(() => {
        previewGrid.classList.add("visible");
        doneBtn.style.display = "block";
      }, 500);
    }
  }, 100);
}

function closeLayoutOverlay() {
  const overlay = document.getElementById("loading-overlay");
  overlay.classList.remove("visible");
  writeTerminalSuccess("\n[SYSTEM] Redirected to design preview view. Layout generation completed successfully.");
}
