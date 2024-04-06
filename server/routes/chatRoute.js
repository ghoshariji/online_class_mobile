const chatModel = require("../model/chatModel");
const router = require("express").Router();
const fs = require("fs").promises;

router.post("/save-chat-user", async (req, res) => {
  try {
    const id = req.body.id;
    const dataVal = await fs.readFile("./message/mesg.json", "utf-8");
    const data = dataVal ? JSON.parse(dataVal) : [];
    let foundIndex = false;
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        data[i].chat.push({ mesguser: req.body.mesg });
        await fs.writeFile("./message/mesg.json", JSON.stringify(data));
        foundIndex = true;
        res.status(200).send({
          message: "Message sent",
          success: true,
        });
        return;
      }
    }
    if (!foundIndex) {
      data.push({
        id: id,
        name: req.body.name,
        chat: [{ mesguser: req.body.mesg }],
      });
      await fs.writeFile("./message/mesg.json", JSON.stringify(data));
      return res.status(200).send({
        message: "message sent succesfully from new user",
        success: true,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
      error: "Internal server error",
    });
  }
});
router.post("/save-chat-admin", async (req, res) => {
  try {
    const userid = req.body.id;
    const dataVal = await fs.readFile("./message/mesg.json", "utf-8");
    const data = dataVal ? JSON.parse(dataVal) : [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === userid) {
        data[i].chat.push({ adminmesg: req.body.message });
      }
    }
    await fs.writeFile("./message/mesg.json", JSON.stringify(data));
    return res.status(200).send({
      message: "Data sent successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error saving chat:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
router.get("/get-chat-admin", async (req, res) => {
  try {
    const dataVal = await fs.readFile("./message/mesg.json", "utf-8");
    const data = dataVal ? JSON.parse(dataVal) : [];
    return res.status(200).send({
      message: "Message fetch succesfully",
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Error fetching chat:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
router.get("/get-chat-id-admin", async (req, res) => {
  try {
    const id = req.query.id;
    const dataVal = await fs.readFile("./message/mesg.json", "utf-8");
    const data = dataVal ? JSON.parse(dataVal) : [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        const finalData = data[i].chat;
        return res.status(200).send({
          message: "Data send succesfully",
          success: true,
          data: finalData,
        });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
router.get("/get-chat-user", async (req, res) => {
  try {
    const id = req.query.id;
    const dataVal = await fs.readFile("./message/mesg.json", "utf-8");
    const data = dataVal ? JSON.parse(dataVal) : [];
    let found = false;
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        found = true;
        const mesgData = data[i].chat;
        res.status(200).send({
          message: "Data send succesfully",
          success: true,
          data: mesgData,
        });
        break;
      }
    }
    if (!found) {
      return res.status(401).send({
        message: "No chat found",
        success: falses,
      });
    }
  } catch (error) {
    console.error("Error fetching chat:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

module.exports = router;
