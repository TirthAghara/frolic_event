const express = require('express');
const Group = require('../models/Group');
const Event = require('../models/Event');
const { verifyToken } = require('../auth');

const router = express.Router();

/**
 * Create a new group
 * POST /api/groups
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    const { groupName, eventId } = req.body;

    if (!groupName || !eventId) {
      return res.status(400).json({ message: 'Group name and Event ID are required' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if max groups reached
    const currentGroupsCount = await Group.countDocuments({ eventId });
    if (currentGroupsCount >= event.maxGroups) {
      return res.status(400).json({ message: 'Maximum group limit reached for this event' });
    }

    const group = new Group({
      groupName,
      eventId,
      userId: req.userId,
    });

    await group.save();

    res.status(201).json({
      message: 'Group created successfully',
      data: group,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * Get all groups for an event
 * GET /api/groups/event/:eventId
 */
router.get('/event/:eventId', verifyToken, async (req, res) => {
  try {
    const groups = await Group.find({ eventId: req.params.eventId }).populate('userId', 'name email').sort({ createdAt: -1 });

    res.json({
      data: groups,
      total: groups.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

/**
 * Update Group Attendance / Payment
 * PUT /api/groups/:id
 */
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (req.body.isPresent !== undefined) group.isPresent = req.body.isPresent;
    if (req.body.isPaymentDone !== undefined) group.isPaymentDone = req.body.isPaymentDone;

    group.updatedAt = new Date();
    await group.save();

    res.json({
      message: 'Group updated successfully',
      data: group,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
