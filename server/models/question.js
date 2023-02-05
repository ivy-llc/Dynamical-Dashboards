const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  content: String, 
  author_id: String,
  answer: String,
  image: String
});

// compile model from schema
module.exports = mongoose.model("question", QuestionSchema);