import PracticalModel from '../models/practical.js';
import SubjectModel from '../models/subject.js';

export const createPractical = async (req, res) => {
  try {
    const { Subject: subjectName, email, Practical } = req.body;

    // Find subject by name
    const Subjectinfo = await SubjectModel.findOne({ name: subjectName });

    if (!Subjectinfo) {
      return res.status(404).json({ message: "Subject not found" });
    }

   
    const PracticalObj = new PracticalModel({
      Subject: Subjectinfo._id, 
      email,
      Practical,
    });

    const savedPractical = await PracticalObj.save();

   
    const updatedSubject = await SubjectModel.findByIdAndUpdate(
      Subjectinfo._id,
      { $push: { practicals: savedPractical._id } }, 
      { new: true }
    )
      .populate("practicals") 
      .exec();

    res.json({ Subject: updatedSubject });
  } catch (error) {
    console.error(error);
    
    
  }
};

export const getAllPractical = async (req, res) => {
  try {
    const practicals = await PracticalModel.find();
    res.json({ practicals });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error while fetching practicals" });
  }
};