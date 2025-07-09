import mongoose from 'mongoose';

const certificationSchema = new mongoose.Schema({
  name: String,
  fileUrl: String,
});

const additionalDocumentSchema = new mongoose.Schema({
  name: String,
  fileUrl: String,
});

const trainerSchema = new mongoose.Schema({
  basicInfo: {
    firstName: String,
    lastName: String,
    emailAddress: String,
    phoneNumber: String,
    gender: String,
    pincode: String,
    country: String,
    state: String,
    district: String,
    city: String,
    languagesSpoken: [String],
  },
  professionalDetails: {
    designation: String,
    skills: [String],
    experience: String,
    previousCompany: String,
    degree: String,
    educationalCourse: String,
    certifications: [certificationSchema],
  },
  workTeachingExperience: {
    experienceLevel: String,
    coursesTaught: [String],
    teachingMode: String,
    expectedSalary: String,
  },
  additionalInfo: {
    bio: String,
    status: String,
  },
  documents: {
    aadhaarNumber: String,
    panNumber: String,
    aadhaarCardUrl: String,
    panCardUrl: String,
    resumeUrl: String,
    tenthCertificateUrl: String,
    additionalDocuments: [additionalDocumentSchema],
  },
}, { timestamps: true });

export default mongoose.models.Trainer || mongoose.model('Trainer', trainerSchema);
