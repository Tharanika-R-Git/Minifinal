// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { body, param, validationResult } from 'express-validator';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dashboard-builder';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Dashboard Schema
const dashboardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  layout: {
    type: Array,
    default: []
  },
  widgets: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: new Map()
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: String,
    default: 'default-user'
  }
});

// Update timestamp on save
dashboardSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Dashboard = mongoose.model('Dashboard', dashboardSchema);

// Error handling middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Get all dashboards
app.get('/api/dashboards', async (req, res) => {
  try {
    const { userId = 'default-user', limit = 50, offset = 0 } = req.query;
    
    const dashboards = await Dashboard.find({ userId })
      .sort({ updatedAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .select('-widgets'); // Exclude widgets for list view
    
    const total = await Dashboard.countDocuments({ userId });
    
    res.json({
      success: true,
      data: dashboards,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Error fetching dashboards:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch dashboards',
      message: error.message 
    });
  }
});

// Get single dashboard by ID
app.get('/api/dashboards/:id', 
  param('id').isMongoId().withMessage('Invalid dashboard ID'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const dashboard = await Dashboard.findById(req.params.id);
      
      if (!dashboard) {
        return res.status(404).json({ 
          success: false, 
          error: 'Dashboard not found' 
        });
      }
      
      // Convert widgets Map to Object for JSON serialization
      const dashboardData = dashboard.toObject();
      dashboardData.widgets = Object.fromEntries(dashboard.widgets);
      
      res.json({
        success: true,
        data: dashboardData
      });
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to fetch dashboard',
        message: error.message 
      });
    }
  }
);

// Create new dashboard
app.post('/api/dashboards',
  body('name').trim().notEmpty().withMessage('Dashboard name is required'),
  body('layout').optional().isArray().withMessage('Layout must be an array'),
  body('widgets').optional().isObject().withMessage('Widgets must be an object'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { name, description, layout, widgets, userId = 'default-user' } = req.body;
      
      const dashboard = new Dashboard({
        name,
        description,
        layout: layout || [],
        widgets: widgets || {},
        userId
      });
      
      await dashboard.save();
      
      const dashboardData = dashboard.toObject();
      dashboardData.widgets = Object.fromEntries(dashboard.widgets);
      
      res.status(201).json({
        success: true,
        data: dashboardData,
        message: 'Dashboard created successfully'
      });
    } catch (error) {
      console.error('Error creating dashboard:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to create dashboard',
        message: error.message 
      });
    }
  }
);

// Update dashboard
app.put('/api/dashboards/:id',
  param('id').isMongoId().withMessage('Invalid dashboard ID'),
  body('name').optional().trim().notEmpty().withMessage('Dashboard name cannot be empty'),
  body('layout').optional().isArray().withMessage('Layout must be an array'),
  body('widgets').optional().isObject().withMessage('Widgets must be an object'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { name, description, layout, widgets } = req.body;
      
      const dashboard = await Dashboard.findById(req.params.id);
      
      if (!dashboard) {
        return res.status(404).json({ 
          success: false, 
          error: 'Dashboard not found' 
        });
      }
      
      // Update fields if provided
      if (name !== undefined) dashboard.name = name;
      if (description !== undefined) dashboard.description = description;
      if (layout !== undefined) dashboard.layout = layout;
      if (widgets !== undefined) dashboard.widgets = widgets;
      
      await dashboard.save();
      
      const dashboardData = dashboard.toObject();
      dashboardData.widgets = Object.fromEntries(dashboard.widgets);
      
      res.json({
        success: true,
        data: dashboardData,
        message: 'Dashboard updated successfully'
      });
    } catch (error) {
      console.error('Error updating dashboard:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to update dashboard',
        message: error.message 
      });
    }
  }
);

// Delete dashboard
app.delete('/api/dashboards/:id',
  param('id').isMongoId().withMessage('Invalid dashboard ID'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const dashboard = await Dashboard.findByIdAndDelete(req.params.id);
      
      if (!dashboard) {
        return res.status(404).json({ 
          success: false, 
          error: 'Dashboard not found' 
        });
      }
      
      res.json({
        success: true,
        message: 'Dashboard deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting dashboard:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to delete dashboard',
        message: error.message 
      });
    }
  }
);

// Duplicate dashboard
app.post('/api/dashboards/:id/duplicate',
  param('id').isMongoId().withMessage('Invalid dashboard ID'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const original = await Dashboard.findById(req.params.id);
      
      if (!original) {
        return res.status(404).json({ 
          success: false, 
          error: 'Dashboard not found' 
        });
      }
      
      const duplicate = new Dashboard({
        name: `${original.name} (Copy)`,
        description: original.description,
        layout: original.layout,
        widgets: original.widgets,
        userId: original.userId
      });
      
      await duplicate.save();
      
      const dashboardData = duplicate.toObject();
      dashboardData.widgets = Object.fromEntries(duplicate.widgets);
      
      res.status(201).json({
        success: true,
        data: dashboardData,
        message: 'Dashboard duplicated successfully'
      });
    } catch (error) {
      console.error('Error duplicating dashboard:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to duplicate dashboard',
        message: error.message 
      });
    }
  }
);

// Export dashboard
app.get('/api/dashboards/:id/export',
  param('id').isMongoId().withMessage('Invalid dashboard ID'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const dashboard = await Dashboard.findById(req.params.id);
      
      if (!dashboard) {
        return res.status(404).json({ 
          success: false, 
          error: 'Dashboard not found' 
        });
      }
      
      const exportData = {
        name: dashboard.name,
        description: dashboard.description,
        layout: dashboard.layout,
        widgets: Object.fromEntries(dashboard.widgets),
        exportedAt: new Date().toISOString()
      };
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${dashboard.name.replace(/[^a-z0-9]/gi, '_')}.json"`);
      res.json(exportData);
    } catch (error) {
      console.error('Error exporting dashboard:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to export dashboard',
        message: error.message 
      });
    }
  }
);

// Import dashboard
app.post('/api/dashboards/import',
  body('data').isObject().withMessage('Import data must be an object'),
  body('data.name').notEmpty().withMessage('Dashboard name is required'),
  body('data.layout').isArray().withMessage('Layout must be an array'),
  body('data.widgets').isObject().withMessage('Widgets must be an object'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { data, userId = 'default-user' } = req.body;
      
      const dashboard = new Dashboard({
        name: data.name,
        description: data.description || '',
        layout: data.layout,
        widgets: data.widgets,
        userId
      });
      
      await dashboard.save();
      
      const dashboardData = dashboard.toObject();
      dashboardData.widgets = Object.fromEntries(dashboard.widgets);
      
      res.status(201).json({
        success: true,
        data: dashboardData,
        message: 'Dashboard imported successfully'
      });
    } catch (error) {
      console.error('Error importing dashboard:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to import dashboard',
        message: error.message 
      });
    }
  }
);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Route not found' 
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Dashboard API available at http://localhost:${PORT}/api`);
});