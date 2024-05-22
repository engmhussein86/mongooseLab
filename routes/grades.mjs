import express from "express";
import { ObjectId } from "mongodb";
import Grade from '../models/Grades.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    console.log('grades');
   const grades = await Grade.find();
   res.send(grades);
  } catch (error) {
   console.log(error);
  }
});

// Create a single grade entry
router.post("/", async (req, res) => {
try{
  let newDocument = req.body;

  // rename fields for backwards compatibility
  if (newDocument.student_id) {
    newDocument.learner_id = newDocument.student_id;
    delete newDocument.student_id;
  }

  let grade = await Grade.create(newDocument);
  res.send(grade).status(204);
} catch (error) {
  console.log(error);
}
});

// Get a single grade entry
router.get("/:id", async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);
    
    if (!grade) {
        return res.send('grade not found');
    }

    res.send(grade);
} catch (error) {
    console.log(error);
    res.send({error: 'Error, invalid data'});
}
});

// Add a score to a grade entry
router.patch("/:id/add", async (req, res) => {
try{
const grade = await Grade.findById(req.params.id);
if (!grade) {
  return res.send('grade not found');
}

  const updatedGrade = await Grade.updateOne({_id:new ObjectId(req.params.id)}, { $push: { scores:req.body } });
        res.send(updatedGrade);
}
catch (error) {
  console.log(error);
  res.send({error: 'Error, invalid data'});
}
});

// Remove a score from a grade entry
router.patch("/:id/remove", async (req, res) => {
  try{
    const grade = await Grade.findById(req.params.id);
    if (!grade) {
      return res.send('grade not found');
    }
    
      const updatedGrade = await Grade.updateOne({_id:new ObjectId(req.params.id)}, { $pull: { scores:req.body } });
            res.send(updatedGrade);
    }
    catch (error) {
      console.log(error);
      res.send({error: 'Error, invalid data'});
    }
    });


// Delete a single grade entry
router.delete("/:id", async (req, res) => {
  try {
    const deletedGrade = await Grade.findByIdAndDelete(req.params.id);

    res.send({
        deletedGrade: deletedGrade,
        message: 'grade deleted!'
    });
} catch (error) {
    console.log(error);
    res.send({error: 'Error, invalid data'});
}
});

// Get route for backwards compatibility
router.get("/student/:id", async (req, res) => {
  res.redirect(`learner/${req.params.id}`);
});

// Get a learner's grade data
router.get("/learner/:id", async (req, res) => {
   let query = { learner_id: Number(req.params.id) };
   try {   
   const grades = await Grade.find(query);
   res.send(grades);
  } catch (error) {
   console.log(error);
  }
});

// Delete a learner's grade data
router.delete("/learner/:id", async (req, res) => {
  let query = { learner_id: Number(req.params.id) };

  try {
    const deletedGrade = await Grade.findOneAndDelete(query);

    res.send({
        deletedGrade: deletedGrade,
        message: 'grade deleted!'
    });
} catch (error) {
    console.log(error);
    res.send({error: 'Error, invalid data'});
}
});

// Get a class's grade data
router.get("/class/:id", async (req, res) => {
   let query = { class_id: Number(req.params.id) };

  // Check for learner_id parameter
  if (req.query.learner) query.learner_id = Number(req.query.learner);

  try {   
    const grades = await Grade.find(query);
    console.log(grades.length);
    res.send(grades);
   } catch (error) {
    console.log(error);
   }
});

// Update a class id
router.patch("/class/:id", async (req, res) => {

  try{
    let query = { class_id: Number(req.params.id) };

    let result = await Grade.updateMany(query, {
      $set: { class_id: req.body.class_id },
    });
  
    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
    }
    catch (error) {
      console.log(error);
      res.send({error: 'Error, invalid data'});
    }
  

});

// Delete a class
router.delete("/class/:id", async (req, res) => {
  try{
  let query = { class_id: Number(req.params.id) };

  let result = await Grade.deleteMany(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
}
catch (error) {
  console.log(error);
  res.send({error: 'Error, invalid data'});
}
});

export default router;
///////////////////////////////////////// another solution ///////////////////////////////
// import express from "express";
// import { ObjectId } from "mongodb";
// import db from "../db/conn.js";
// import Grade from '../models/grades.js';

// const router = express.Router();

// /**
//  * GET /
//  */
// router.get('/', async (req, res) => {
//     // const collection = await db.collection("grades");
//     // const result = await collection.find().toArray();
//     const result = await Grade.find({});
//     res.send(result);

// });


// /**
//  * GET /:id
//  */
// router.get("/:id", async (req, res) => {
// //   const collection = await db.collection("grades");
// //   const query = { _id: new ObjectId(req.params.id) };
// //   const result = await collection.findOne(query);

//     const result = await Grade.findById(req.params.id);
//   if (!result) res.send("Not found").status(404);
//   else res.send(result).status(200);
// });

// /**
//  * POST /
//  * Test with postman using:
//  * {
//     "class_id": 107,
//     "learner_id": 1 
//     }
//  */
// router.post('/', async(req, res) => {
//     // const collection = await db.collection('grades');
//     const newDocument = req.body;
//     console.log(newDocument);

//     if (newDocument.student_id) {
//         newDocument.learner_id = newDocument.student_id;
//         delete newDocument.student_id;
//     }

//     // const result = await collection.insertOne(newDocument);
//     const result = await Grade.create(newDocument);
//     res.send(result).status(204);
// });

// /**
//  * GET /student/:id
//  * NO need to touch this!
//  */
// router.get('/student/:id', async (req, res) => {
//    res.redirect(`/grades/learner/${req.params.id}`);
// });

// /**
//  * GET /learner/:id
//  */
// router.get('/learner/:id', async (req, res) => {
//     // const collection = await db.collection("grades");
//     // const query = {learner_id: Number(req.params.id)};
//     // const result = await collection.find(query).toArray();
//     const result = await Grade.find({learner_id: req.params.id});

//     if (!result) res.send("Not found").status(404);
//     else res.send(result).status(200);
// });


// /**
//  * GET /class/:id
//  */
// router.get('/class/:id', async (req, res) => {
//     // const collection = await db.collection('grades');
//     // const query = {class_id: Number(req.params.id)};
//     // const result = await collection.find(query).toArray();
//     const result = await Grade.find({class_id: req.params.id})

//     if (result.length < 1) res.status(404).send("Not Found");
//     else res.send(result).status(200);
// });

// /**
//  * PATCH /:id
//  */
// router.patch('/class/:id', async (req, res) => {
//     const updatedGrade = await Grade.findByIdAndUpdate(req.params.id, req.body, {new:true});
//     res.json(updatedGrade);
// });


// /**
//  * PUT /:id
//  */
// router.put('/class/:id', async (req, res) => {
//     const updatedGrade = await Grade.findByIdAndUpdate(req.params.id, req.body, {new:true});
//     res.json(updatedGrade);
// });

// /**
//  * PATCH /:id/scores/add
//  */
// router.patch('/:id/scores/add', async (req, res) => {
//     // find the grade to update
//     const grade = await Grade.findOne({_id: req.params.id});
   
//     if (!grade) return res.send('Grade not found!')
//     // add the new score (req.body) to the scores array
//     grade.scores.push(req.body);
//     // save doc
//     await grade.save();
//     res.send(grade);

// });

// /**
//  * DELETE /:id/scores/remove
//  */


// export default router;