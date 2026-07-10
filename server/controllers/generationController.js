const { generateOutline, rewriteNodeText } = require('../services/ai.service');

// @desc    Generate presentation outline/deck array from prompt
// @route   POST /api/generation/outline
// @access  Public
exports.generatePresentationOutline = async (req, res, next) => {
  try {
    const { prompt, slideCount } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Please provide a topic prompt' });
    }

    const count = parseInt(slideCount) || 5;
    if (count < 1 || count > 15) {
      return res.status(400).json({ success: false, error: 'Slide count must be between 1 and 15' });
    }

    const outline = await generateOutline(prompt, count);
    res.status(200).json({ success: true, data: outline });
  } catch (error) {
    next(error);
  }
};

// @desc    Rewrite slide text node inline using AI
// @route   POST /api/generation/rewrite
// @access  Public
exports.rewriteSlideNode = async (req, res, next) => {
  try {
    const { text, command } = req.body;

    if (!text || !command) {
      return res.status(400).json({ success: false, error: 'Please provide text and a rewrite command directive' });
    }

    const rewrittenText = await rewriteNodeText(text, command);
    res.status(200).json({ success: true, data: rewrittenText });
  } catch (error) {
    next(error);
  }
};
