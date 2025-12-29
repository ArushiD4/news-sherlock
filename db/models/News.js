// db/models/News.js
const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  // The full text of the article pasted by the user
  articleText: { 
    type: String, 
    required: true 
  },
  
  // The final decision: Fake, Real, or Unverified
  verdict: { 
    type: String, 
    enum: ['Fake', 'Real', 'Misleading', 'Unverified'], 
    default: 'Unverified' 
  },
  
  // How sure the AI is (0 to 100)
  confidence: { 
    type: Number, 
    default: 0 
  },
  
  // Explanation bullet points
  reasons: [{ 
    type: String 
  }], 
  
  // Which tool gave the final answer?
  apiUsed: { 
    type: String, 
    enum: ['Google', 'OpenAI', 'None'], 
    default: 'None' 
  },
  
  // Timestamp for sorting history
  submittedAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('ScannedNews', NewsSchema);