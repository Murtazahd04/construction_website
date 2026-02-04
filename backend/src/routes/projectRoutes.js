const express = require("express");
const router = express.Router();
const {testDBConnection,} = require("../controllers/projectController");

router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend connected successfully 🚀",
  });
});


// API: /api/projects/db-test
router.get("/db-test", testDBConnection);
module.exports = router;
