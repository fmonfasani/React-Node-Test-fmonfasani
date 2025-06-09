const express = require("express");
const meeting = require("./meeting");
const auth = require("../../middelwares/auth");
const router = express.Router();

router.get("/", auth, meeting.index);
router.post("/", auth, meeting.add);
router.get("/view/:id", auth, meeting.view);
router.put("/edit/:id", auth, meeting.edit);
router.delete("/delete/:id", auth, meeting.deleteData);

module.exports = router;
