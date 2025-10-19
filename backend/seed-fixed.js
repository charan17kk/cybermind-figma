const mongoose = require('mongoose');
const Job = require('./models/Job');
require('dotenv').config();

const seedJobsFixed = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB for seeding');

    // Clear existing jobs
    await Job.deleteMany({});
    console.log('🗑️ Cleared existing jobs');

    // Sample jobs data matching the schema
    const sampleJobs = [
      {
        title: 'Senior Full Stack Developer',
        company: 'Amazon',
        location: 'Remote',
        city: 'Seattle',
        type: 'Full-time',
        experience: 'Senior',
        salary: '$160,000 - $220,000',
        monthlySalary: '$13,000 - $18,000',
        description: 'Join our e-commerce platform team to build scalable web applications using React, Node.js, and AWS services. Work on high-traffic systems serving millions of users worldwide.',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      },
      {
        title: 'React Frontend Developer',
        company: 'Google',
        location: 'Hybrid',
        city: 'San Francisco',
        type: 'Full-time',
        experience: 'Mid-level',
        salary: '$140,000 - $200,000',
        monthlySalary: '$11,500 - $16,500',
        description: 'Build modern web applications using React, TypeScript, and Material Design. Work on Google Workspace products used by billions of users globally.',
        deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Node.js Backend Developer',
        company: 'Microsoft',
        location: 'Onsite',
        city: 'Redmond',
        type: 'Full-time',
        experience: 'Mid-level',
        salary: '$130,000 - $180,000',
        monthlySalary: '$10,800 - $15,000',
        description: 'Develop scalable backend services using Node.js, Express, and Azure cloud services. Work on Microsoft Teams and Office 365 integrations.',
        deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'DevOps Engineer',
        company: 'Netflix',
        location: 'Remote',
        city: 'Los Angeles',
        type: 'Full-time',
        experience: 'Senior',
        salary: '$150,000 - $210,000',
        monthlySalary: '$12,500 - $17,500',
        description: 'Manage cloud infrastructure, CI/CD pipelines, and monitoring systems. Work with Docker, Kubernetes, and AWS to ensure 99.9% uptime.',
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'UI/UX Designer',
        company: 'Spotify',
        location: 'Hybrid',
        city: 'New York',
        type: 'Full-time',
        experience: 'Mid-level',
        salary: '$110,000 - $160,000',
        monthlySalary: '$9,000 - $13,500',
        description: 'Design intuitive user interfaces for mobile and web applications. Work with Figma, Adobe Creative Suite, and collaborate with engineering teams.',
        deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Data Scientist',
        company: 'Tesla',
        location: 'Onsite',
        city: 'Palo Alto',
        type: 'Full-time',
        experience: 'Senior',
        salary: '$170,000 - $240,000',
        monthlySalary: '$14,000 - $20,000',
        description: 'Analyze large datasets to improve autonomous driving algorithms. Work with Python, TensorFlow, and advanced machine learning techniques.',
        deadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Mobile App Developer',
        company: 'Uber',
        location: 'Remote',
        city: 'San Francisco',
        type: 'Contract',
        experience: 'Mid-level',
        salary: '$120,000 - $170,000',
        monthlySalary: '$10,000 - $14,000',
        description: 'Develop and maintain iOS and Android applications using React Native. Work on ride-sharing and food delivery features.',
        deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Product Manager',
        company: 'Airbnb',
        location: 'Hybrid',
        city: 'San Francisco',
        type: 'Full-time',
        experience: 'Senior',
        salary: '$160,000 - $220,000',
        monthlySalary: '$13,500 - $18,500',
        description: 'Lead product strategy and roadmap for host and guest experiences. Work cross-functionally with engineering, design, and marketing teams.',
        deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Software Engineer Intern',
        company: 'Meta',
        location: 'Onsite',
        city: 'Menlo Park',
        type: 'Internship',
        experience: 'Entry level',
        salary: '$80,000 - $100,000',
        monthlySalary: '$6,500 - $8,500',
        description: 'Summer internship program working on social media platform features. Learn from senior engineers and contribute to real-world projects.',
        deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000)
      },
      {
        title: 'Freelance Web Developer',
        company: 'Various Clients',
        location: 'Remote',
        city: 'Remote',
        type: 'Freelance',
        experience: 'Mid-level',
        salary: '$75 - $150/hour',
        monthlySalary: '$8,000 - $20,000',
        description: 'Work on various web development projects using modern frameworks. Build websites, web applications, and e-commerce solutions.',
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
      }
    ];

    // Insert sample jobs
    await Job.insertMany(sampleJobs);
    
    console.log(`✅ Successfully seeded ${sampleJobs.length} sample jobs`);
    console.log('🎉 Database seeding completed!');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📊 Database connection closed');
  }
};

seedJobsFixed();