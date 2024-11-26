import Enroll from "../models/enroll.js";
import PracticalModel from "../models/practical.js";

export const EnrollPractical = async (req, res) => {
  try {
    const { Practical, student } = req.body;

    // Validate input data
    if (!Practical || !student) {
      return res.status(400).json({ error: "Practical and student are required." });
    }

    // Check if Practical exists in the database
    const practicalExists = await PracticalModel.findById(Practical);
    if (!practicalExists) {
      return res.status(404).json({ error: "Practical not found" });
    }

    // Create and save the enrollment
    const enroll = new Enroll({
      Practical, // This references the Practical object (ID)
      student,   // The student associated with this enrollment
    });

    const savedEnroll = await enroll.save();
    console.log("Enrollment saved:", savedEnroll);

    // Update the Practical document to include the new enrollment
    const updatedPractical = await PracticalModel.findByIdAndUpdate(
      Practical,
      { $push: { Enroll: savedEnroll._id } }, // Update the "Enroll" field with the new enrollment
      { new: true }
    )
      .populate("Enroll")  // Populate the enrollments from the "Enroll" field
      .exec();

    // Return the updated Practical with populated enrollments
    if (!updatedPractical) {
      return res.status(500).json({ error: "Failed to update Practical with enrollment" });
    }

    res.json({
      success: true,
      message: "Enrollment added successfully",
      Practical: updatedPractical,
    });

  } catch (error) {
    console.error("Error occurred during enrollment:", error);
    res.status(500).json({
      success: false,
      error: "Error while enrolling practical",
      details: error.message,
    });
  }
};
