const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  articleText: { type: String, required: true },
  verdict: { type: String, default: 'Unverified' },
  confidence: { type: Number, default: 0 },
  reasons: [{ type: String }],
  recommendation: { type: String },
  apiUsed: { 
    type: String, 
    default: 'MultiFactorEngine (ISOT-Trained)' 
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: false 
  },
  
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ScannedNews', NewsSchema);