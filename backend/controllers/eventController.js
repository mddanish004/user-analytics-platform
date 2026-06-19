import Event from "../models/Event.js";

export const createEvent = async (req, res) => {
  try {
    const { session_id, type, url, timestamp, x, y } = req.body;

    if (!session_id || !type || !url || !timestamp) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const event = await Event.create({
      session_id,
      type,
      url,
      timestamp,
      x,
      y,
    });

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
