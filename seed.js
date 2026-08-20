/*
 * Creates the single admin account and a few sample notices.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
const Notice = require('./models/Notice');

const sampleNotices = [
  {
    title: 'Winter term course registration opens Monday',
    category: 'Academic',
    urgency: 'High',
    authorDepartment: 'Office of the Registrar',
    content:
      'Registration for Winter 2027 opens Monday at 9:00 AM through MyHumber. Your registration window depends on the number of credits you have completed, so check your assigned time before logging in. Clear any outstanding account holds first, as a hold will block registration entirely.'
  },
  {
    title: 'Scheduled network maintenance this weekend',
    category: 'IT & Systems',
    urgency: 'Medium',
    authorDepartment: 'IT Services',
    content:
      'Campus Wi-Fi and the student portal will be unavailable Saturday from 11:00 PM to 4:00 AM Sunday while we upgrade network hardware. Download anything you need before Saturday evening. Email and Blackboard will stay online during the window.'
  },
  {
    title: 'Final exam timetable now published',
    category: 'Exam Schedule',
    urgency: 'High',
    authorDepartment: 'Office of the Registrar',
    content:
      'The final exam timetable is posted on MyHumber under Student Records. Check your room assignment carefully, since several exams have moved to the North Campus gymnasium this term. Report any exam conflicts to the Registrar within five business days.'
  },
  {
    title: 'Free breakfast at the Student Centre all week',
    category: 'Campus Life',
    urgency: 'Low',
    authorDepartment: 'Humber Students Federation',
    content:
      'The Student Centre is serving free breakfast every weekday from 8:00 AM to 10:30 AM this week. Bring your student card. Vegetarian and halal options are available at the far counter.'
  },
  {
    title: 'Drop in resume reviews every Wednesday',
    category: 'Student Services',
    urgency: 'Low',
    authorDepartment: 'Advising & Career Services',
    content:
      'Career advisors are available for fifteen minute drop in resume reviews every Wednesday from 1:00 PM to 4:00 PM in room LRC 226. No appointment is needed. Bring a printed copy of your resume and the job posting you are targeting.'
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Start from a clean slate so the script can be re-run safely
  await Admin.deleteMany({});
  await Notice.deleteMany({});

  await Admin.create({
    username: 'admin',
    password: 'humber123',
    displayName: 'Dipak Debnath'
  });
  console.log('Admin created. Username: admin, password: humber123');

  await Notice.insertMany(sampleNotices);
  console.log(`${sampleNotices.length} sample notices inserted`);

  await mongoose.disconnect();
  console.log('Done');
}

seed().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
