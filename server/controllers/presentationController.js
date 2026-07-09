const Presentation = require('../models/Presentation');

// @desc    Get all presentations
// @route   GET /api/presentations
// @access  Public (Requires guestSessionId query param if guest, or auth token if user)
exports.getPresentations = async (req, res, next) => {
  try {
    let query = {};

    if (req.user) {
      // Authenticated user: fetch user's saved decks
      query = { userId: req.user._id };
    } else {
      // Guest: fetch decks matching guestSessionId
      const { guestSessionId } = req.query;
      if (!guestSessionId) {
        return res.status(400).json({ success: false, error: 'Please provide a guestSessionId or login' });
      }
      query = { guestSessionId, userId: null };
    }

    const presentations = await Presentation.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: presentations.length, data: presentations });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single presentation
// @route   GET /api/presentations/:id
// @access  Public
exports.getPresentation = async (req, res, next) => {
  try {
    const presentation = await Presentation.findById(req.params.id);

    if (!presentation) {
      return res.status(404).json({ success: false, error: 'Presentation not found' });
    }

    // Security check: ensure user owns this, or it belongs to matching guest session
    if (req.user) {
      if (presentation.userId && presentation.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, error: 'Not authorized to view this presentation' });
      }
    } else {
      const { guestSessionId } = req.query;
      if (presentation.userId !== null || presentation.guestSessionId !== guestSessionId) {
        return res.status(403).json({ success: false, error: 'Not authorized to view this presentation' });
      }
    }

    res.status(200).json({ success: true, data: presentation });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new presentation
// @route   POST /api/presentations
// @access  Public
exports.createPresentation = async (req, res, next) => {
  try {
    const { title, theme, slides, guestSessionId } = req.body;
    let newPresentationData = { title, theme, slides: slides || [] };

    if (req.user) {
      // Auth user
      newPresentationData.userId = req.user._id;
    } else {
      // Guest session limits check (max 3 decks)
      if (!guestSessionId) {
        return res.status(400).json({ success: false, error: 'guestSessionId required for guest creation' });
      }

      const guestDecksCount = await Presentation.countDocuments({
        guestSessionId,
        userId: null
      });

      if (guestDecksCount >= 100) {
        return res.status(403).json({
          success: false,
          error: 'Guest limit reached (Max 100 decks). Please register for unlimited generations.'
        });
      }

      newPresentationData.guestSessionId = guestSessionId;
      // Set TTL expiration date for 24 hours in the future
      newPresentationData.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    }

    const presentation = await Presentation.create(newPresentationData);
    res.status(201).json({ success: true, data: presentation });
  } catch (error) {
    next(error);
  }
};

// @desc    Update presentation
// @route   PUT /api/presentations/:id
// @access  Public
exports.updatePresentation = async (req, res, next) => {
  try {
    let presentation = await Presentation.findById(req.params.id);

    if (!presentation) {
      return res.status(404).json({ success: false, error: 'Presentation not found' });
    }

    // Security validation
    if (req.user) {
      if (presentation.userId && presentation.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, error: 'Not authorized to edit this presentation' });
      }
    } else {
      const { guestSessionId } = req.body;
      if (presentation.userId !== null || presentation.guestSessionId !== guestSessionId) {
        return res.status(403).json({ success: false, error: 'Not authorized to edit this presentation' });
      }
    }

    // Update fields (title, theme, slides)
    presentation = await Presentation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: presentation });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete presentation
// @route   DELETE /api/presentations/:id
// @access  Public
exports.deletePresentation = async (req, res, next) => {
  try {
    const presentation = await Presentation.findById(req.params.id);

    if (!presentation) {
      return res.status(404).json({ success: false, error: 'Presentation not found' });
    }

    // Security validation
    if (req.user) {
      if (presentation.userId && presentation.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, error: 'Not authorized to delete this presentation' });
      }
    } else {
      const { guestSessionId } = req.query;
      if (presentation.userId !== null || presentation.guestSessionId !== guestSessionId) {
        return res.status(403).json({ success: false, error: 'Not authorized to delete this presentation' });
      }
    }

    await presentation.deleteOne();
    res.status(200).json({ success: true, message: 'Presentation deleted successfully' });
  } catch (error) {
    next(error);
  }
};
