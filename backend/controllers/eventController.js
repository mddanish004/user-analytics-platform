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

export const getSessions = async (req, res) => {
  try {
    const sessions = await Event.aggregate([
      {
        $group: {
          _id: "$session_id",
          eventCount: {
            $sum: 1,
          },
          lastActivity: {
            $max: "$timestamp",
          },
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
      {
        $sort: {
          lastActivity: -1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getSessionById = async (req, res) => {
  try {
    const { id } = req.params;

    const events = await Event.find({
      session_id: id,
    }).sort({
      timestamp: 1,
    });

    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getHeatmap = async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL query parameter is required",
      });
    }

    const clicks = await Event.find({
      url,
      type: "click",
    }).select("x y timestamp -_id");

    res.status(200).json({
      success: true,
      data: clicks,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
