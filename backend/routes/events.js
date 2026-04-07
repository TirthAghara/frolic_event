const express = require('express');
const Event = require('../models/Event');
const { verifyToken } = require('../auth');

const router = express.Router();

/**
 * Create a new event
 * POST /api/events
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, description, date, department, coordinator, maxGroups, minParticipants, maxParticipants } = req.body;

    // Validation
    if (!name || !date || !department || !coordinator || !maxGroups || !minParticipants || !maxParticipants) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    // Create new event
    const event = new Event({
      name,
      description,
      date: new Date(date),
      department,
      coordinator,
      maxGroups: Number(maxGroups),
      minParticipants: Number(minParticipants),
      maxParticipants: Number(maxParticipants),
      userId: req.userId,
    });

    await event.save();

    res.status(201).json({
      message: 'Event created successfully',
      event: {
        _id: event._id,
        name: event.name,
        date: event.date,
        department: event.department,
        status: event.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * Get all events
 * GET /api/events
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const events = await Event.find({ userId: req.userId }).sort({ createdAt: -1 });

    res.json({
      data: events,
      total: events.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * Get event by ID
 * GET /api/events/:id
 */
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json({
      data: event,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * Update event by ID
 * PUT /api/events/:id
 */
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Update fields
    if (req.body.name) event.name = req.body.name;
    if (req.body.description !== undefined) event.description = req.body.description;
    if (req.body.date) event.date = new Date(req.body.date);
    if (req.body.department) event.department = req.body.department;
    if (req.body.coordinator) event.coordinator = req.body.coordinator;
    if (req.body.maxGroups) event.maxGroups = Number(req.body.maxGroups);
    if (req.body.minParticipants) event.minParticipants = Number(req.body.minParticipants);
    if (req.body.maxParticipants) event.maxParticipants = Number(req.body.maxParticipants);
    if (req.body.status) event.status = req.body.status;

    event.updatedAt = new Date();
    await event.save();

    res.json({
      message: 'Event updated successfully',
      event,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * Delete event by ID
 * DELETE /api/events/:id
 */
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
