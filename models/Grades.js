import mongoose from "mongoose";


const scoreSchema = new mongoose.Schema({
    type: {
      type: String,
      enum: ['exam', 'quiz', 'homework'], // Valid types
      required: true
    },
    score: {
      type: Number,
      required: true
    }
  });

 // Define the main schema for the document
const gradeSchema= new mongoose.Schema({
    scores: [scoreSchema], // Array of scores, using the defined scoreSchema
    class_id: {
      type: Number,
      required: true
    },
    learner_id: {
      type: Number,
      required: true
    }

}); 
 

  // Create the model for the schema
  export default new mongoose.model('Grade', gradeSchema);

  /////////////////////////another solution //////////////////////////////////////
//   import mongoose from "mongoose";

// const gradeSchema = new mongoose.Schema({
//   class_id: {
//     type: Number,
//     required: true,
//   },
//   learner_id: { type: Number, required: true },
//   scores: [{ score_type: String, score: Number }],
// });

// export default mongoose.model("Grade", gradeSchema);