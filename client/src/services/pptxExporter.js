import pptxgen from 'pptxgenjs';
import { TEMPLATES } from '../data/templates';

const getCleanHex = (colorStr) => {
  if (!colorStr) return '000000';
  // Strip `#` and transparent alpha suffixes if they exist
  let clean = colorStr.replace('#', '').trim();
  if (clean.length > 6) {
    clean = clean.substring(0, 6);
  }
  return clean;
};

/**
 * Exports slide deck array to PPTX file format
 */
export const exportToPptx = (presentation) => {
  const { title, theme = 'classic', slides = [] } = presentation;
  
  // Resolve theme from templates list
  const activeTemplate = TEMPLATES.find(t => t.id === theme) || TEMPLATES.find(t => t.id === 'classic') || TEMPLATES[0];

  const colors = {
    background: getCleanHex(activeTemplate.bg),
    cardBg: getCleanHex(activeTemplate.card || activeTemplate.secondary),
    text: getCleanHex(activeTemplate.text),
    primary: getCleanHex(activeTemplate.accent),
    accent: getCleanHex(activeTemplate.accent)
  };

  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  pptx.title = title;

  slides.forEach((slideData, index) => {
    const slide = pptx.addSlide();
    
    // 1. Set background color matching selected theme
    slide.background = { fill: colors.background };

    const { title: slideTitle, content = [], layout = 'bullets' } = slideData;

    // Header (skip for pure title slide layouts)
    if (layout !== 'title') {
      slide.addText(slideTitle || `Slide ${index + 1}`, {
        x: 0.8,
        y: 0.6,
        w: 11.5,
        h: 0.8,
        fontSize: 32,
        bold: true,
        color: colors.text,
        fontFace: 'Outfit'
      });
    }

    // 2. Render Slide contents based on layout type
    if (layout === 'title') {
      // Centered Hero title slide
      slide.addText(slideTitle || title, {
        x: 1.0,
        y: 2.2,
        w: 11.3,
        h: 1.5,
        fontSize: 48,
        bold: true,
        color: colors.primary,
        fontFace: 'Outfit',
        align: 'center'
      });

      slide.addText(content[0] || 'AI Generated Deck', {
        x: 1.0,
        y: 3.8,
        w: 11.3,
        h: 1.0,
        fontSize: 20,
        color: colors.text,
        fontFace: 'Inter',
        align: 'center'
      });
    } 
    
    else if (layout === 'stats') {
      const statVal = content[0] || '100';
      const label = content[1] || 'Stat Label Description';
      const sublabel = content[2] || '';

      // Check if it's a serialized chart slide
      if (statVal.startsWith('CHART:')) {
        const chartType = statVal.split(':')[1] || 'bar';
        const chartTitle = label || 'Metrics';
        const rawData = sublabel || '';

        const parsed = rawData.split(',').map(item => {
          const [lbl, val] = item.split(':');
          return {
            name: lbl?.trim() || 'Label',
            value: parseFloat(val?.trim()) || 0
          };
        }).filter(d => !isNaN(d.value));

        if (parsed.length > 0) {
          const chartData = [
            {
              name: chartTitle,
              labels: parsed.map(d => d.name),
              values: parsed.map(d => d.value)
            }
          ];

          let pptxChartType = pptx.charts.BAR;
          if (chartType === 'line') pptxChartType = pptx.charts.LINE;
          if (chartType === 'area') pptxChartType = pptx.charts.AREA;

          slide.addChart(pptxChartType, chartData, {
            x: 1.0,
            y: 1.8,
            w: 11.3,
            h: 4.5,
            showTitle: true,
            title: chartTitle,
            titleColor: colors.primary,
            titleFontSize: 22,
            valGridLine: { stroke: 'e2e8f0', strokeWidth: 0.5 }
          });
        }
      } else {
        // Giant Stat number
        slide.addText(statVal, {
          x: 0.8,
          y: 2.0,
          w: 5.5,
          h: 2.5,
          fontSize: 90,
          bold: true,
          color: colors.accent,
          fontFace: 'Outfit',
          align: 'center'
        });

        // Label and descriptions
        slide.addText(label, {
          x: 6.5,
          y: 2.5,
          w: 6.0,
          h: 0.8,
          fontSize: 24,
          bold: true,
          color: colors.text,
          fontFace: 'Outfit'
        });

        if (sublabel) {
          slide.addText(sublabel, {
            x: 6.5,
            y: 3.3,
            w: 6.0,
            h: 1.2,
            fontSize: 16,
            color: colors.text,
            fontFace: 'Inter'
          });
        }
      }
    } 
    
    else if (layout === 'columns') {
      // 3 Column Grid Cards
      const cols = content.slice(0, 3);
      const colWidth = 3.6;
      const gap = 0.4;
      const startX = 0.8;

      cols.forEach((colText, colIdx) => {
        const xPos = startX + colIdx * (colWidth + gap);

        // Draw card background rect
        slide.addShape(pptx.shapes.ROUNDED_RECTANGLE, {
          x: xPos,
          y: 1.8,
          w: colWidth,
          h: 4.2,
          fill: colors.cardBg,
          line: { color: colors.primary, width: 1 }
        });

        // Add index badge
        slide.addText(`0${colIdx + 1}`, {
          x: xPos + 0.3,
          y: 2.1,
          w: 1.0,
          h: 0.4,
          fontSize: 20,
          bold: true,
          color: colors.accent,
          fontFace: 'Outfit'
        });

        // Add text content
        slide.addText(colText, {
          x: xPos + 0.3,
          y: 2.7,
          w: colWidth - 0.6,
          h: 3.0,
          fontSize: 15,
          color: colors.text,
          fontFace: 'Inter',
          valign: 'top'
        });
      });
    } 
    
    else if (layout === 'timeline') {
      // Horizontal Timeline Layout
      const milestones = content.slice(0, 3);
      const startX = 1.0;
      const totalWidth = 11.3;
      const stepWidth = totalWidth / 3;

      // Draw timeline horizontal rule line
      slide.addShape(pptx.shapes.RECTANGLE, {
        x: startX + 0.5,
        y: 2.8,
        w: totalWidth - 1.0,
        h: 0.05,
        fill: colors.primary
      });

      milestones.forEach((milestoneText, stepIdx) => {
        const xPos = startX + stepIdx * stepWidth;

        // Draw timeline node circle dot
        slide.addShape(pptx.shapes.OVAL, {
          x: xPos + stepWidth / 2 - 0.15,
          y: 2.65,
          w: 0.3,
          h: 0.3,
          fill: colors.accent
        });

        // Milestone card text below line
        slide.addText(milestoneText, {
          x: xPos + 0.2,
          y: 3.2,
          w: stepWidth - 0.4,
          h: 2.2,
          fontSize: 14,
          color: colors.text,
          fontFace: 'Inter',
          align: 'center',
          valign: 'top'
        });
      });
    } 
    
    else {
      // Standard Bullets layout
      const listData = content.map(bullet => ({
        text: bullet,
        options: { bullet: true, color: colors.text, fontSize: 18, fontFace: 'Inter' }
      }));

      slide.addText(listData, {
        x: 0.8,
        y: 1.8,
        w: 11.5,
        h: 4.2,
        valign: 'top',
        lineSpacing: 28
      });
    }
  });

  // Save the PPTX document
  const fileName = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_deck.pptx`;
  pptx.writeFile({ fileName });
};
