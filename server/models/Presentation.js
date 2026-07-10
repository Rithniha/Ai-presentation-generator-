const mongoose = require('mongoose');

const SlideSchema = new mongoose.Schema({
  title: {
    type: String,
    default: ''
  },
  content: {
    type: [String],
    default: []
  },
  layout: {
    type: String,
    enum: ['title', 'bullets', 'columns', 'stats', 'timeline'],
    default: 'bullets'
  },
  icon: {
    type: String,
    default: 'Presentation'
  },
  note: {
    type: String,
    default: ''
  }
});

const PresentationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  guestSessionId: {
    type: String,
    default: null
  },
  title: {
    type: String,
    required: [true, 'Please add a presentation title']
  },
  theme: {
    type: String,
    default: 'classic'
  },
  slides: [SlideSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: null
  }
});

// Create TTL index on expiresAt (documents are deleted when the current time is past expiresAt)
// MongoDB ignores documents where expiresAt is null or absent.
PresentationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Presentation', PresentationSchema);
