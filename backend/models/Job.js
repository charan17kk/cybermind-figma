const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [100, 'Job title cannot exceed 100 characters']
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [50, 'Company name cannot exceed 50 characters']
  },
  location: {
    type: String,
    required: [true, 'Job location is required'],
    enum: ['Onsite', 'Remote', 'Hybrid'],
    default: 'Onsite'
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
    maxlength: [50, 'City name cannot exceed 50 characters']
  },
  type: {
    type: String,
    required: [true, 'Job type is required'],
    enum: ['Internship','Full Time', 'Partime', 'Contract'],
    default: 'Full-time'
  },
  experience: {
    type: String,
    required: [true, 'Experience level is required'],
    trim: true,
    maxlength: [20, 'Experience cannot exceed 20 characters']
  },
  salary: {
    type: String,
    required: [true, 'Salary is required'],
    trim: true,
    maxlength: [20, 'Salary cannot exceed 20 characters']
  },
  monthlySalary: {
    type: String,
    required: [true, 'Monthly salary is required'],
    trim: true,
    maxlength: [20, 'Monthly salary cannot exceed 20 characters']
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  deadline: {
    type: Date,
    validate: {
      validator: function(value) {
        if (!value) return true; // Optional field
        return value >= new Date();
      },
      message: 'Application deadline must be in the future'
    }
  },
  postedDate: {
    type: String,
    default: function() {
      const now = new Date();
      const minutes = Math.floor((Date.now() - now.setHours(0, 0, 0, 0)) / (1000 * 60));
      
      if (minutes < 60) {
        return `${minutes}m Ago`;
      } else if (minutes < 1440) {
        return `${Math.floor(minutes / 60)}h Ago`;
      } else {
        return `${Math.floor(minutes / 1440)}d Ago`;
      }
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // For future features
  applicants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better search performance
jobSchema.index({ title: 'text', company: 'text', description: 'text' });
jobSchema.index({ location: 1, type: 1 });
jobSchema.index({ createdAt: -1 });
jobSchema.index({ deadline: 1 });

// Virtual for checking if job is expired
jobSchema.virtual('isExpired').get(function() {
  if (!this.deadline) return false;
  return new Date() > this.deadline;
});

// Pre-save middleware to update postedDate
jobSchema.pre('save', function(next) {
  if (this.isNew) {
    this.postedDate = 'Just posted';
  }
  next();
});

// Static method to clean expired jobs
jobSchema.statics.cleanExpiredJobs = async function() {
  const now = new Date();
  const result = await this.deleteMany({
    deadline: { $lt: now },
    isActive: true
  });
  console.log(`🧹 Cleaned ${result.deletedCount} expired jobs`);
  return result;
};

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
