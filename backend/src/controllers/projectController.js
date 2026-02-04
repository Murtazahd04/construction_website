const db = require("../config/db");

exports.testDBConnection = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 + 1 AS result");

    res.json({
      success: true,
      message: "MySQL connected successfully 🐬",
      result: rows[0].result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "MySQL connection failed ❌",
    });
  }
};
