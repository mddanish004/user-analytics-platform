import Event from "../models/Event.js";

export const createEvent = async (req, res) => {
  try {
    const { session_id, type, url, timestamp, x, y, viewport } = req.body;

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
      viewport,
    });

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalClicks = await Event.countDocuments({ type: "click" });
    const totalPageViews = await Event.countDocuments({ type: "page_view" });
    const sessions = await Event.distinct("session_id");

    res.json({
      success: true,
      data: {
        totalSessions: sessions.length,
        totalEvents,
        totalClicks,
        totalPageViews,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getUrls = async (req, res) => {
  try {
    const urls = await Event.distinct("url");
    res.json({ success: true, data: urls });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
