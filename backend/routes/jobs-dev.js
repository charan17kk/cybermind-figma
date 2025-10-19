const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const router = express.Router();

// In-memory storage for development (when MongoDB is not available)
let inMemoryJobs = [
  {
    _id: '1',
    title: 'Senior Full Stack Developer',
    company: 'Amazon',
    location: 'Seattle, WA',
    type: 'full-time',
    experience: 'senior',
    salary: {
      min: 1800000,
      max: 2200000,
      currency: 'INR'
    },
    description: 'Join our e-commerce platform team to build scalable web applications using React, Node.js, and AWS services. Work on high-traffic systems serving millions of users worldwide.',
    requirements: ['React', 'Node.js', 'AWS', '5+ years experience'],
    benefits: ['Health insurance', 'Stock options', 'Flexible hours'],
    remote: false,
    featured: true,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '2',
    title: 'React Frontend Developer',
    company: 'Google',
    location: 'San Francisco, CA',
    type: 'full-time',
    experience: 'mid',
    salary: {
      min: 1600000,
      max: 2000000,
      currency: 'INR'
    },
    description: 'Build modern web applications using React, TypeScript, and Material Design. Work on Google Workspace products used by billions of users globally.',
    requirements: ['React', 'TypeScript', 'Material Design', '3+ years experience'],
    benefits: ['Health insurance', 'Free meals', 'Career growth'],
    remote: false,
    featured: false,
    status: 'active',
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    updatedAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    _id: '3',
    title: 'Node.js Backend Developer',
    company: 'Tesla',
    location: 'Remote',
    type: 'full-time',
    experience: 'mid',
    salary: {
      min: 1400000,
      max: 1800000,
      currency: 'INR'
    },
    description: 'Develop and maintain backend services for Tesla\'s vehicle software systems. Work with microservices, APIs, and real-time data processing using Node.js and MongoDB.',
    requirements: ['Node.js', 'MongoDB', 'Microservices', '2+ years experience'],
    benefits: ['Health insurance', 'Stock options', 'Remote work'],
    remote: true,
    featured: false,
    status: 'active',
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    updatedAt: new Date(Date.now() - 7200000).toISOString()
  }
];

let nextId = 4;

// Helper function to get jobs from MongoDB or in-memory storage
const getJobsData = async (req) => {
  const isMongoConnected = req.app.locals.isMongoConnected();
  
  if (isMongoConnected) {
    // Use MongoDB
    const Job = require('../models/Job');
    return Job.find({ status: 'active' }).sort({ createdAt: -1 });
  } else {
    // Use in-memory storage
    return inMemoryJobs.filter(job => job.status === 'active');
  }
};

// Helper function to create job in MongoDB or in-memory storage
const createJobData = async (req, jobData) => {
  const isMongoConnected = req.app.locals.isMongoConnected();
  
  if (isMongoConnected) {
    // Use MongoDB
    const Job = require('../models/Job');
    const job = new Job(jobData);
    return await job.save();
  } else {
    // Use in-memory storage
    const newJob = {
      _id: String(nextId++),
      ...jobData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    inMemoryJobs.unshift(newJob);
    return newJob;
  }
};

// @route   GET /api/jobs
// @desc    Get all jobs with filtering and pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      type,
      experience,
      location,
      remote,
      minSalary,
      maxSalary
    } = req.query;

    let jobs = await getJobsData(req);

    // Apply filters
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      jobs = jobs.filter(job => 
        searchRegex.test(job.title) || 
        searchRegex.test(job.company) || 
        searchRegex.test(job.description)
      );
    }

    if (type) {
      jobs = jobs.filter(job => job.type === type);
    }

    if (experience) {
      jobs = jobs.filter(job => job.experience === experience);
    }

    if (location) {
      jobs = jobs.filter(job => 
        job.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (remote !== undefined) {
      jobs = jobs.filter(job => job.remote === (remote === 'true'));
    }

    if (minSalary) {
      jobs = jobs.filter(job => job.salary.min >= parseInt(minSalary));
    }

    if (maxSalary) {
      jobs = jobs.filter(job => job.salary.max <= parseInt(maxSalary));
    }

    // Pagination
    const total = jobs.length;
    const pages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const paginatedJobs = jobs.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: {
        jobs: paginatedJobs,
        total,
        page: parseInt(page),
        pages,
        hasNext: endIndex < total,
        hasPrev: startIndex > 0
      }
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message
    });
  }
});

// @route   GET /api/jobs/featured
// @desc    Get featured jobs
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    let jobs = await getJobsData(req);
    const featuredJobs = jobs.filter(job => job.featured);

    res.json({
      success: true,
      data: featuredJobs
    });
  } catch (error) {
    console.error('Error fetching featured jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured jobs',
      error: error.message
    });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get a single job by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let jobs = await getJobsData(req);
    const job = jobs.find(j => j._id === id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching job',
      error: error.message
    });
  }
});

// @route   POST /api/jobs
// @desc    Create a new job (requires authentication)
// @access  Private
router.post('/', [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Job title must be between 5 and 100 characters'),
  body('company')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Company name must be between 2 and 50 characters'),
  body('location')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Location must be between 2 and 100 characters'),
  body('type')
    .isIn(['full-time', 'part-time', 'contract', 'internship'])
    .withMessage('Job type must be one of: full-time, part-time, contract, internship'),
  body('experience')
    .isIn(['entry', 'mid', 'senior', 'lead'])
    .withMessage('Experience level must be one of: entry, mid, senior, lead'),
  body('salary.min')
    .isInt({ min: 0 })
    .withMessage('Minimum salary must be a positive number'),
  body('salary.max')
    .isInt({ min: 0 })
    .withMessage('Maximum salary must be a positive number'),
  body('description')
    .trim()
    .isLength({ min: 50, max: 2000 })
    .withMessage('Job description must be between 50 and 2000 characters')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      title,
      company,
      location,
      type,
      experience,
      salary,
      description,
      requirements = [],
      benefits = [],
      remote = false,
      applicationUrl,
      applicationEmail,
      applicationDeadline,
      featured = false
    } = req.body;

    // Validate salary range
    if (salary.min >= salary.max) {
      return res.status(400).json({
        success: false,
        message: 'Minimum salary must be less than maximum salary'
      });
    }

    const jobData = {
      title,
      company,
      location,
      type,
      experience,
      salary: {
        min: salary.min,
        max: salary.max,
        currency: salary.currency || 'INR'
      },
      description,
      requirements: Array.isArray(requirements) ? requirements : [],
      benefits: Array.isArray(benefits) ? benefits : [],
      remote,
      applicationUrl,
      applicationEmail,
      applicationDeadline,
      featured,
      status: 'active'
    };

    const job = await createJobData(req, jobData);

    res.status(201).json({
      success: true,
      data: job,
      message: 'Job created successfully'
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating job',
      error: error.message
    });
  }
});

module.exports = router;