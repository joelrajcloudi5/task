// app/api/create-trainer/route.js
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';
import TrainerModel from '@/app/models/trainerProfile';
import connectDB from '@/app/utils/db';
import { v4 as uuidv4 } from 'uuid';
import formidable from 'formidable';

// Disable default body parsing
export const config = {
  api: {
    bodyParser: false,
  },
};

const saveFile = async (file, folder) => {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder);
  await mkdir(uploadDir, { recursive: true });
  const filename = `${uuidv4()}_${file.originalFilename}`;
  const filepath = path.join(uploadDir, filename);
  await writeFile(filepath, await file.toBuffer());
  return `/uploads/${folder}/${filename}`;
};

export async function POST(req) {
  await connectDB();

  const form = formidable({ multiples: true, keepExtensions: true });

  const [fields, files] = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve([fields, files]);
    });
  });

  // Parse stringified JSON fields
  const basicInfo = JSON.parse(fields.basicInfo);
  const professionalDetails = JSON.parse(fields.professionalDetails);
  const workTeachingExperience = JSON.parse(fields.workTeachingExperience);
  const additionalInfo = JSON.parse(fields.additionalInfo);

  const documents = {
    aadhaarNumber: fields.aadhaarNumber,
    panNumber: fields.panNumber,
    aadhaarCardUrl: await saveFile(files.aadhaarCard[0], 'documents'),
    panCardUrl: await saveFile(files.panCard[0], 'documents'),
    resumeUrl: await saveFile(files.resume[0], 'documents'),
    tenthCertificateUrl: await saveFile(files.tenthCert[0], 'documents'),
    additionalDocuments: JSON.parse(fields.additionalDocuments || '[]').map((doc, i) => ({
      name: doc.name,
      fileUrl: files[`additionalDoc_${i}`]
        ? saveFile(files[`additionalDoc_${i}`][0], 'documents')
        : '',
    })),
  };

  professionalDetails.certifications = JSON.parse(fields.certifications || '[]').map((cert, i) => ({
    name: cert.name,
    fileUrl: files[`certFile_${i}`]
      ? saveFile(files[`certFile_${i}`][0], 'certifications')
      : '',
  }));

  const trainer = new TrainerModel({
    basicInfo,
    professionalDetails,
    workTeachingExperience,
    additionalInfo,
    documents,
  });

  await trainer.save();

  return NextResponse.json({ success: true, message: 'Trainer created' });
}
