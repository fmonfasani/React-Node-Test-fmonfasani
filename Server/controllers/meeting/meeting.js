const MeetingHistory = require("../../model/schema/meeting");
const mongoose = require("mongoose");

const index = async (req, res) => {
  try {
    console.log("Getting meetings...");
    const meetings = await MeetingHistory.find({ deleted: false }).sort({
      timestamp: -1,
    });
    console.log("Found meetings:", meetings.length);
    res.status(200).json({ meetings });
  } catch (error) {
    console.error("Meeting index error:", error);
    res.status(500).json({ error: error.message });
  }
};

const add = async (req, res) => {
  try {
    console.log("Creating meeting with data:", req.body);
    console.log("User from token:", req.user);

    const meeting = new MeetingHistory({
      agenda: req.body.agenda,
      location: req.body.location,
      dateTime: req.body.dateTime,
      notes: req.body.notes,
      related: req.body.related,
      attendes: req.body.attendes || [],
      attendesLead: req.body.attendesLead || [],
      createBy: req.user.userId,
      timestamp: new Date(),
    });

    const savedMeeting = await meeting.save();
    console.log("Meeting created:", savedMeeting._id);

    res.status(201).json({
      message: "Meeting created successfully",
      meeting: savedMeeting,
    });
  } catch (error) {
    console.error("Meeting add error:", error);
    res.status(500).json({ error: error.message });
  }
};

const view = async (req, res) => {
  try {
    console.log("Getting meeting by ID:", req.params.id);
    const meeting = await MeetingHistory.findOne({
      _id: req.params.id,
      deleted: false,
    });

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    res.status(200).json(meeting);
  } catch (error) {
    console.error("Meeting view error:", error);
    res.status(500).json({ error: error.message });
  }
};

const edit = async (req, res) => {
  try {
    console.log("Updating meeting:", req.params.id);

    const result = await MeetingHistory.updateOne(
      { _id: req.params.id, deleted: false },
      { $set: req.body }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    res.status(200).json({ message: "Meeting updated successfully" });
  } catch (error) {
    console.error("Meeting edit error:", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteData = async (req, res) => {
  try {
    console.log("Deleting meeting:", req.params.id);

    const result = await MeetingHistory.updateOne(
      { _id: req.params.id, deleted: false },
      { $set: { deleted: true } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    res.status(200).json({ message: "Meeting deleted successfully" });
  } catch (error) {
    console.error("Meeting delete error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { add, index, view, deleteData, edit };
