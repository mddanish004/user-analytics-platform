import Event from "../models/Event.js";

export const getSessions = async (req, res) => {
  try {
    const sessions = await Event.aggregate([
      {
        $group: {
          _id: "$session_id",
          eventCount: { $sum: 1 },
          lastActivity: { $max: "$timestamp" },
        },
      },
      {
        $project: {
          _id: 0,
          session_id: "$_id",
          eventCount: 1,
          lastActivity: 1,
        },
      },
      { $sort: { lastActivity: -1 } },
    ]);

    res.status(200).json({ success: true, data: sessions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getSessionById = async (req, res) => {
  try {
    const { id } = req.params;

    const events = await Event.find({ session_id: id }).sort({ timestamp: 1 });

    res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
