import Event from "../models/Event.js";

export const getHeatmap = async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL query parameter is required",
      });
    }

    const clicks = await Event.find({ url, type: "click" }).select(
      "x y timestamp -_id",
    );

    res.status(200).json({ success: true, data: clicks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
