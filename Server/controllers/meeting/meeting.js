const MeetingHistory = require("../../model/schema/meeting");
const mongoose = require("mongoose");

const add = async (req, res) => {
  try {
    const {
      agenda,
      attendes,
      attendesLead,
      location,
      related,
      dateTime,
      notes,
    } = req.body;

    // Validate required fields
    if (!agenda) {
      return res.status(400).json({ message: "Agenda is required" });
    }

    // Create new meeting
    const meeting = new MeetingHistory({
      agenda,
      attendes: attendes || [],
      attendesLead: attendesLead || [],
      location,
      related,
      dateTime,
      notes,
      createBy: req.user.userId, // From auth middleware
      timestamp: new Date(),
    });

    await meeting.save();

    // Populate the created meeting before sending response
    const populatedMeeting = await MeetingHistory.findById(meeting._id)
      .populate("createBy", "firstName lastName username")
      .populate("attendes", "firstName lastName email")
      .populate("attendesLead", "firstName lastName email");

    res.status(201).json({
      message: "Meeting created successfully",
      meeting: populatedMeeting,
    });
  } catch (error) {
    console.error("Failed to create meeting:", error);
    res.status(500).json({ error: "Failed to create meeting" });
  }
};

const index = async (req, res) => {
  try {
    const query = { ...req.query, deleted: false };

    let meetings = await MeetingHistory.find(query)
      .populate("createBy", "firstName lastName username")
      .populate("attendes", "firstName lastName email")
      .populate("attendesLead", "firstName lastName email")
      .sort({ timestamp: -1 })
      .exec();

    res.status(200).json({ meetings });
  } catch (error) {
    console.error("Failed to fetch meetings:", error);
    res.status(500).json({ error: "Failed to fetch meetings" });
  }
};

const view = async (req, res) => {
  try {
    let meeting = await MeetingHistory.findOne({
      _id: req.params.id,
      deleted: false,
    })
      .populate("createBy", "firstName lastName username")
      .populate("attendes", "firstName lastName email")
      .populate("attendesLead", "firstName lastName email");

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found." });
    }

    res.status(200).json(meeting);
  } catch (error) {
    console.error("Failed to fetch meeting:", error);
    res.status(500).json({ error: "Failed to fetch meeting" });
  }
};

const deleteData = async (req, res) => {
  try {
    const meetingId = req.params.id;

    const meeting = await MeetingHistory.findOne({
      _id: meetingId,
      deleted: false,
    });
    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    // Soft delete
    await MeetingHistory.updateOne(
      { _id: meetingId },
      { $set: { deleted: true } }
    );

    res.status(200).json({
      message: "Meeting deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete meeting:", error);
    res.status(500).json({ error: "Failed to delete meeting" });
  }
};

const deleteMany = async (req, res) => {
  try {
    const meetingIds = req.body; // Array of meeting IDs

    if (!Array.isArray(meetingIds) || meetingIds.length === 0) {
      return res.status(400).json({ message: "Invalid meeting IDs provided" });
    }

    // Check if meetings exist
    const meetings = await MeetingHistory.find({
      _id: { $in: meetingIds },
      deleted: false,
    });

    if (meetings.length === 0) {
      return res.status(404).json({ message: "No meetings found to delete" });
    }

    // Soft delete multiple meetings
    const result = await MeetingHistory.updateMany(
      { _id: { $in: meetingIds } },
      { $set: { deleted: true } }
    );

    res.status(200).json({
      message: `${result.modifiedCount} meetings deleted successfully`,
      deletedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Failed to delete meetings:", error);
    res.status(500).json({ error: "Failed to delete meetings" });
  }
};

const edit = async (req, res) => {
  try {
    const {
      agenda,
      attendes,
      attendesLead,
      location,
      related,
      dateTime,
      notes,
    } = req.body;

    // Check if meeting exists
    const existingMeeting = await MeetingHistory.findOne({
      _id: req.params.id,
      deleted: false,
    });
    if (!existingMeeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    // Update meeting
    const result = await MeetingHistory.updateOne(
      { _id: req.params.id },
      {
        $set: {
          agenda,
          attendes: attendes || [],
          attendesLead: attendesLead || [],
          location,
          related,
          dateTime,
          notes,
          updatedAt: new Date(),
        },
      }
    );

    // Get updated meeting
    const updatedMeeting = await MeetingHistory.findById(req.params.id)
      .populate("createBy", "firstName lastName username")
      .populate("attendes", "firstName lastName email")
      .populate("attendesLead", "firstName lastName email");

    res.status(200).json({
      message: "Meeting updated successfully",
      meeting: updatedMeeting,
    });
  } catch (error) {
    console.error("Failed to update meeting:", error);
    res.status(500).json({ error: "Failed to update meeting" });
  }
};

module.exports = { add, index, view, deleteData, deleteMany, edit };
