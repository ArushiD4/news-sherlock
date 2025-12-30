const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  articleText: { type: String, required: true },
  verdict: { type: String, default: 'Unverified' },
  confidence: { type: Number, default: 0 },
  reasons: [{ type: String }],
  
  // ✅ ADDED 'KeywordAnalysis' to the allowed list below
  apiUsed: { 
    type: String, 
    enum: ['Google', 'OpenAI', 'KeywordAnalysis', 'None'], 
    default: 'None' 
  },
  
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ScannedNews', NewsSchema);