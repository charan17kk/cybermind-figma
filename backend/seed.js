const mongoose = require('mongoose');
const Job = require('./models/Job');
require('dotenv').config();

const seedJobs = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // Clear existing jobs
    await Job.deleteMany({});
    console.log('🗑️ Cleared existing jobs');

    // Sample jobs data
    const sampleJobs = [
      {
        title: 'Senior Full Stack Developer',
        company: 'Amazon',
        location: 'Seattle, WA',
        type: 'full-time',
        experience: 'senior',
        salary: {
          min: 1600000,
          max: 2200000,
          currency: 'INR'
        },
        description: 'Join our e-commerce platform team to build scalable web applications using React, Node.js, and AWS services. Work on high-traffic systems serving millions of users worldwide.',
        requirements: ['React', 'Node.js', 'AWS', '5+ years experience', 'TypeScript'],
        benefits: ['Health insurance', 'Stock options', 'Flexible hours', 'Remote work'],
        remote: false,
        featured: true,
        status: 'active'
      },
      {
        title: 'React Frontend Developer',
        company: 'Google',
        location: 'San Francisco, CA',
        type: 'full-time',
        experience: 'mid',
        salary: {
          min: 1400000,
          max: 2000000,
          currency: 'INR'
        },
        description: 'Build modern web applications using React, TypeScript, and Material Design. Work on Google Workspace products used by billions of users globally.',
        requirements: ['React', 'TypeScript', 'Material Design', '3+ years experience'],
        benefits: ['Health insurance', 'Free meals', 'Career growth', 'Learning budget'],
        remote: false,
        featured: false,
        status: 'active'
      },
      {
        title: 'Node.js Backend Developer',
        company: 'Tesla',
        location: 'Remote',
        type: 'full-time',
        experience: 'mid',
        salary: {
          min: 1200000,
          max: 1800000,
          currency: 'INR'
        },
        description: 'Develop and maintain backend services for Tesla\'s vehicle software systems. Work with microservices, APIs, and real-time data processing using Node.js and MongoDB.',
        requirements: ['Node.js', 'MongoDB', 'Microservices', '2+ years experience', 'REST APIs'],
        benefits: ['Health insurance', 'Stock options', 'Remote work', 'Innovation culture'],
        remote: true,
        featured: false,
        status: 'active'
      },
      {
        title: 'UX/UI Designer',
        company: 'Spotify',
        location: 'Remote',
        type: 'full-time',
        experience: 'senior',
        salary: {
          min: 1100000,
          max: 1600000,
          currency: 'INR'
        },
        description: 'Design intuitive user experiences for our music streaming platform. Collaborate with product teams to create engaging interfaces that delight millions of users.',
        requirements: ['Figma', 'Adobe Creative Suite', 'User Research', '4+ years experience', 'Design Systems'],
        benefits: ['Health insurance', 'Spotify Premium', 'Creative freedom', 'Flexible hours'],
        remote: true,
        featured: true,
        status: 'active'
      },
      {
        title: 'DevOps Engineer',
        company: 'Microsoft',
        location: 'Austin, TX',
        type: 'full-time',
        experience: 'senior',
        salary: {
          min: 1500000,
          max: 2100000,
          currency: 'INR'
        },
        description: 'Build and maintain cloud infrastructure for Azure services. Work with containerization, CI/CD pipelines, and monitoring systems at enterprise scale.',
        requirements: ['Docker', 'Kubernetes', 'Azure', 'CI/CD', '4+ years experience'],
        benefits: ['Health insurance', 'Stock options', 'Professional development', 'Hybrid work'],
        remote: false,
        featured: false,
        status: 'active'
      },
      {
        title: 'Data Scientist',
        company: 'Apple',
        location: 'Cupertino, CA',
        type: 'full-time',
        experience: 'mid',
        salary: {
          min: 1800000,
          max: 2400000,
          currency: 'INR'
        },
        description: 'Develop machine learning models for Siri and other AI-powered Apple services. Work with neural networks, natural language processing, and computer vision technologies.',
        requirements: ['Python', 'Machine Learning', 'TensorFlow', 'Data Analysis', '3+ years experience'],
        benefits: ['Health insurance', 'Stock options', 'Apple products discount', 'Innovation labs'],
        remote: false,
        featured: true,
        status: 'active'
      },
      {
        title: 'Junior Web Developer',
        company: 'Netflix',
        location: 'Los Angeles, CA',
        type: 'full-time',
        experience: 'entry',
        salary: {
          min: 800000,
          max: 1200000,
          currency: 'INR'
        },
        description: 'Learn and contribute to web development projects for our streaming platform. Great opportunity for recent graduates to work on systems used by millions of viewers worldwide.',
        requirements: ['HTML', 'CSS', 'JavaScript', 'React basics', '0-2 years experience'],
        benefits: ['Health insurance', 'Netflix subscription', 'Mentorship program', 'Career growth'],
        remote: false,
        featured: false,
        status: 'active'
      },
      {
        title: 'Product Manager',
        company: 'Meta',
        location: 'Menlo Park, CA',
        type: 'full-time',
        experience: 'senior',
        salary: {
          min: 2000000,
          max: 2800000,
          currency: 'INR'
        },
        description: 'Lead product strategy for social media features. Collaborate with engineering, design, and data teams to enhance user engagement across Facebook and Instagram platforms.',
        requirements: ['Product Strategy', 'Analytics', 'User Research', '5+ years experience', 'Leadership'],
        benefits: ['Health insurance', 'Stock options', 'Flexible PTO', 'World-class team'],
        remote: false,
        featured: true,
        status: 'active'
      }
    ];

    // Insert sample jobs
    const insertedJobs = await Job.insertMany(sampleJobs);
    console.log(`✅ Successfully seeded ${insertedJobs.length} jobs`);

    // Close connection
    await mongoose.connection.close();
    console.log('🔚 Database connection closed');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedJobs();