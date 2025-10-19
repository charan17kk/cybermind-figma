const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Job = require('../models/Job');
const auth = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const validateJob = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Job title is required')
    .isLength({ max: 100 })
    .withMessage('Job title cannot exceed 100 characters'),
  body('company')
    .trim()
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ max: 50 })
    .withMessage('Company name cannot exceed 50 characters'),
  body('location')
    .isIn(['Onsite', 'Remote', 'Hybrid'])
    .withMessage('Location must be Onsite, Remote, or Hybrid'),
  body('city')
    .trim()
    .notEmpty()
    .withMessage('City is required')
    .isLength({ max: 50 })
    .withMessage('City name cannot exceed 50 characters'),
  body('type')
    .isIn(['Full-time', 'Part-time', 'Contract', 'Internship'])
    .withMessage('Invalid job type'),
  body('experience')
    .trim()
    .notEmpty()
    .withMessage('Experience level is required')
    .isLength({ max: 20 })
    .withMessage('Experience cannot exceed 20 characters'),
  body('salary')
    .trim()
    .notEmpty()
    .withMessage('Salary is required')
    .isLength({ max: 20 })
    .withMessage('Salary cannot exceed 20 characters'),
  body('monthlySalary')
    .trim()
    .notEmpty()
    .withMessage('Monthly salary is required')
    .isLength({ max: 20 })
    .withMessage('Monthly salary cannot exceed 20 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Job description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('deadline')
    .optional()
    .isISO8601()
    .withMessage('Invalid deadline date format')
    .custom(value => {
      if (value && new Date(value) <= new Date()) {
        throw new Error('Application deadline must be in the future');
      }
      return true;
    })
];

// @route   GET /api/jobs
// @desc    Get all jobs with filtering and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('location').optional().isIn(['Onsite', 'Remote', 'Hybrid']).withMessage('Invalid location filter'),
  query('type').optional().isIn(['Full-time', 'Part-time', 'Contract', 'Internship']).withMessage('Invalid job type filter'),
  query('minSalary').optional().isNumeric().withMessage('Min salary must be a number'),
  query('maxSalary').optional().isNumeric().withMessage('Max salary must be a number'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      page = 1,
      // Increase default limit so clients that don't pass a `limit` see more jobs
      limit = 100,
      search,
      location,
      city,
      type,
      minSalary,
      maxSalary,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (location) filter.location = location;
    if (city) filter.city = { $regex: city, $options: 'i' };
    if (type) filter.type = type;

    // Salary filtering (assuming salary is stored as "18LPA" format)
    if (minSalary || maxSalary) {
      // This is a simplified version - you might want to improve salary parsing
      if (minSalary) filter.salary = { $regex: `^[${minSalary}-9]`, $options: 'i' };
    }

    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const jobs = await Job.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await Job.countDocuments(filter);

    // Clean expired jobs (run in background)
    Job.cleanExpiredJobs().catch(err => console.error('Error cleaning expired jobs:', err));

    res.json({
      success: true,
      data: jobs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalJobs: total,
        hasNext: skip + parseInt(limit) < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching jobs',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/jobs/:id
// @desc    Get single job by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job || !job.isActive) {
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
    console.error('Get job error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid job ID' 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching job',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/jobs
// @desc    Create a new job
// @access  Private (requires authentication)
router.post('/', auth, validateJob, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const jobData = {
      ...req.body,
      createdBy: req.user.id
    };

    const job = new Job(jobData);
    await job.save();

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: job
    });
  } catch (error) {
    console.error('Create job error:', error);
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({ 
        success: false,
        message: 'Validation error',
        errors 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Server error while creating job',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/jobs/:id
// @desc    Update a job
// @access  Private (job creator only)
router.put('/:id', auth, validateJob, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }

    // Check if user is the job creator
    if (job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this job' 
      });
    }

    // Update job fields
    Object.keys(req.body).forEach(key => {
      job[key] = req.body[key];
    });

    await job.save();

    res.json({
      success: true,
      message: 'Job updated successfully',
      data: job
    });
  } catch (error) {
    console.error('Update job error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid job ID' 
      });
    }
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({ 
        success: false,
        message: 'Validation error',
        errors 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating job',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   DELETE /api/jobs/:id
// @desc    Delete a job (soft delete)
// @access  Private (job creator only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: 'Job not found' 
      });
    }

    // Check if user is the job creator
    if (job.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this job' 
      });
    }

    // Soft delete by setting isActive to false
    job.isActive = false;
    await job.save();

    res.json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Delete job error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid job ID' 
      });
    }
    res.status(500).json({ 
      success: false, 
      message: 'Server error while deleting job',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/jobs/cleanup
// @desc    Clean expired jobs (admin only - will add auth later)
// @access  Private
router.post('/cleanup', async (req, res) => {
  try {
    const result = await Job.cleanExpiredJobs();
    
    res.json({
      success: true,
      message: `Cleaned ${result.deletedCount} expired jobs`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Cleanup jobs error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while cleaning expired jobs',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
