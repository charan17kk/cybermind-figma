const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['job-seeker', 'employer', 'admin'],
    default: 'job-seeker'
  },
  profile: {
    avatar: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    skills: [{
      type: String,
      trim: true
    }],
    experience: {
      type: String,
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    resume: {
      type: String // URL to resume file
    },
    portfolio: {
      type: String // URL to portfolio
    },
    linkedin: {
      type: String // LinkedIn profile URL
    },
    github: {
      type: String // GitHub profile URL
    }
  },
  // For employers
  company: {
    name: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    },
    size: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '500+']
    },
    industry: {
      type: String,
      trim: true
    }
  },
  // Job applications (for job seekers)
  applications: [{
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'interview', 'accepted', 'rejected'],
      default: 'pending'
    },
    coverLetter: {
      type: String,
      maxlength: [1000, 'Cover letter cannot exceed 1000 characters']
    }
  }],
  // Jobs posted (for employers)
  postedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better performance (email already has unique index)
userSchema.index({ role: 1 });
userSchema.index({ 'profile.skills': 1 });

// Virtual for user's full profile
userSchema.virtual('profileComplete').get(function() {
  if (this.role === 'job-seeker') {
    return !!(this.profile.bio && this.profile.skills.length > 0 && this.profile.experience);
  } else if (this.role === 'employer') {
    return !!(this.company.name && this.company.industry);
  }
  return true;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to update last login
userSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save({ validateBeforeSave: false });
};

// Static method to find by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
