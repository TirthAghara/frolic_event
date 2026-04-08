const express = require('express');
const Institute = require('../models/Institute');
const { verifyToken } = require('../auth');

const router = express.Router();

/**
 * Create a new institute
 * POST /api/institutes
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, description, coordinator } = req.body;

    // Validation
    if (!name || !coordinator) {
      return res.status(400).json({ message: 'Name and coordinator are required' });
    }

    // Create new institute
    const institute = new Institute({
      name,
      description,
      coordinator,
      userId: req.userId,
    });

    await institute.save();

    res.status(201).json({
      message: 'Institute created successfully',
      institute: {
        _id: institute._id,
        name: institute.name,
        description: institute.description,
        coordinator: institute.coordinator,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * Get all institutes
 * GET /api/institutes
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const institutes = await Institute.find({ userId: req.userId }).sort({ createdAt: -1 });

    res.json({
      data: institutes,
      total: institutes.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * Get institute by ID
 * GET /api/institutes/:id
 */
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const institute = await Institute.findById(req.params.id);

    if (!institute) {
      return res.status(404).json({ message: 'Institute not found' });
    }

    if (institute.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json({
      data: institute,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * Update institute by ID
 * PUT /api/institutes/:id
 */
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const institute = await Institute.findById(req.params.id);

    if (!institute) {
      return res.status(404).json({ message: 'Institute not found' });
    }

    if (institute.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Update fields
    if (req.body.name) institute.name = req.body.name;
    if (req.body.description !== undefined) institute.description = req.body.description;
    if (req.body.coordinator) institute.coordinator = req.body.coordinator;


    institute.updatedAt = new Date();
    await institute.save();

    res.json({
      message: 'Institute updated successfully',
      institute,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * Delete institute by ID
 * DELETE /api/institutes/:id
 */
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const institute = await Institute.findById(req.params.id);

    if (!institute) {
      return res.status(404).json({ message: 'Institute not found' });
    }

    if (institute.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Institute.findByIdAndDelete(req.params.id);

    res.json({ message: 'Institute deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
