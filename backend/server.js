import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, param, validationResult } from 'express-validator';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const { Pool } = pg;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// PostgreSQL Connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'dashboard_builder',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// Initialize database tables
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS dashboards (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT DEFAULT '',
        layout JSONB DEFAULT '[]',
        widgets JSONB DEFAULT '{}',
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Database tables initialized');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
};

// initDB(); // Commented for demo mode

// Error handling middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// JWT middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      database: 'disconnected',
      error: error.message 
    });
  }
});

// Auth Routes - Demo Mode
app.post('/api/auth/register',
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { email, password, name } = req.body;
      
      // Demo mode - always succeed
      const user = { id: 1, email, name };
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '24h' }
      );

      res.status(201).json({
        success: true,
        token,
        user
      });
    } catch (error) {
      res.status(500).json({ error: 'Registration failed', message: error.message });
    }
  }
);

app.post('/api/auth/login',
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { email, password } = req.body;
      
      // Demo mode - always succeed with any credentials
      const user = { id: 1, email, name: 'Demo User' };
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        token,
        user
      });
    } catch (error) {
      res.status(500).json({ error: 'Login failed', message: error.message });
    }
  }
);

// Dashboard Routes
app.get('/api/dashboards', authenticateToken, async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;
    
    const result = await pool.query(
      'SELECT id, name, description, created_at, updated_at FROM dashboards WHERE user_id = $1 ORDER BY updated_at DESC LIMIT $2 OFFSET $3',
      [req.user.userId, parseInt(limit), parseInt(offset)]
    );
    
    const countResult = await pool.query('SELECT COUNT(*) FROM dashboards WHERE user_id = $1', [req.user.userId]);
    
    res.json({
      success: true,
      data: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboards', message: error.message });
  }
});

app.get('/api/dashboards/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM dashboards WHERE id = $1 AND user_id = $2',
      [req.params.id, req.user.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Dashboard not found' });
    }
    
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard', message: error.message });
  }
});

app.post('/api/dashboards', authenticateToken,
  body('name').trim().notEmpty().withMessage('Dashboard name is required'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { name, description, layout, widgets } = req.body;
      
      const result = await pool.query(
        'INSERT INTO dashboards (name, description, layout, widgets, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, description || '', JSON.stringify(layout || []), JSON.stringify(widgets || {}), req.user.userId]
      );
      
      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create dashboard', message: error.message });
    }
  }
);

app.put('/api/dashboards/:id', authenticateToken,
  body('name').optional().trim().notEmpty().withMessage('Dashboard name cannot be empty'),
  handleValidationErrors,
  async (req, res) => {
    try {
      const { name, description, layout, widgets } = req.body;
      
      const result = await pool.query(
        'UPDATE dashboards SET name = COALESCE($1, name), description = COALESCE($2, description), layout = COALESCE($3, layout), widgets = COALESCE($4, widgets), updated_at = CURRENT_TIMESTAMP WHERE id = $5 AND user_id = $6 RETURNING *',
        [name, description, layout ? JSON.stringify(layout) : null, widgets ? JSON.stringify(widgets) : null, req.params.id, req.user.userId]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Dashboard not found' });
      }
      
      res.json({ success: true, data: result.rows[0] });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update dashboard', message: error.message });
    }
  }
);

app.delete('/api/dashboards/:id', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM dashboards WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Dashboard not found' });
    }
    
    res.json({ success: true, message: 'Dashboard deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete dashboard', message: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Dashboard API available at http://localhost:${PORT}/api`);
});