const router = require("express").Router();
const fs = require("fs").promises;
const userModel = require("../model/userModel");
const courseModel = require("../model/courseModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const multer = require("multer");
const pdfModel = require("../model/pdfModel");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
router.post("/add-exam", async (req, res) => {
  try {
    const dataVal = await fs.readFile("./examjson/exam.json", "utf-8");
    const data = dataVal ? JSON.parse(dataVal) : [];
    data.push(req.body);
    await fs.writeFile("./examjson/exam.json", JSON.stringify(data));
    return res.status(200).send({
      message: "Exam added",
      success: true,
    });
  } catch (error) {
    res.status(409).send({
      message: error.message,
      success: false,
    });
  }
});
router.get("/get-exam-list", async (req, res) => {
  try {
    const dataVal = await fs.readFile("./examjson/exam.json", "utf-8");
    const data = dataVal ? JSON.parse(dataVal) : [];
    res.status(200).send({
      message: "Exam fetch successfully",
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(409).send({
      message: error.message,
      success: false,
    });
  }
});
router.post("/add-ques", async (req, res) => {
  try {
    const examname = req.query.exmname;
    const dataVal = await fs.readFile("./examjson/exam.json", "utf-8");
    const data = dataVal ? JSON.parse(dataVal) : [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].examname === examname) {
        data[i].question.push(req.body);
        await fs.writeFile("./examjson/exam.json", JSON.stringify(data));
        res.status(200).send({
          message: "Question added",
          success: true,
        });
        return;
      }
    }
    res.status(409).send({
      message: "Not found",
      success: false,
    });
  } catch (error) {
    res.status(200).send({
      message: error.message,
      success: false,
    });
  }
});
router.get("/get-result", async (req, res) => {
  try {
    const dataVal = await fs.readFile("./result/resultadmin.json", "utf-8");
    const data = dataVal ? JSON.parse(dataVal) : [];
    return res.send({
      message: "Data send succesfully",
      success: false,
      data: data,
    });
  } catch (error) {
    res.status(409).send({
      message: error.message,
      success: false,
    });
  }
});
router.delete("/delete-exam", async (req, res) => {
  try {
    const exam = req.query.examname;
    const dataVal = await fs.readFile("./examjson/exam.json", "utf-8");
    const data = dataVal ? JSON.parse(dataVal) : [];
    let found = false;
    for (let i = 0; i < data.length; i++) {
      if (data[i].exam === exam) {
        data.splice(i, 1);
        found = true;
        break;
      }
    }
    if (!found) {
      return res.send({
        message: "Not found",
        success: false,
      });
    }
    await fs.writeFile("./examjson/exam.json", JSON.stringify(data));
    res.status(200).send({
      message: "Deleted succesfully",
      success: false,
    });
  } catch (error) {
    res.status(409).send({
      message: error.message,
      success: false,
    });
  }
});
router.get("/get-ques-list", async (req, res) => {
  try {
    const examname = req.query.examname;
    const dataVal = await fs.readFile("./examjson/exam.json", "utf-8");
    const data = dataVal ? JSON.parse(dataVal) : [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].exam === examname) {
        res.status(200).send({
          message: "Question fetch successfully",
          success: true,
          data: data[i].question,
        });
        return;
      }
    }
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});
router.delete("/delete-result", async (req, res) => {
  try {
    const dataVal = await fs.readFile("./result/resultadmin.json", "utf-8");
    let data = dataVal ? JSON.parse(dataVal) : [];
    data = [];
    await fs.writeFile("./result/resultadmin.json", JSON.stringify(data));
    res.status(200).send({
      message: "Deleted succfully",
      success: true,
    });
  } catch (error) {
    res.status(409).send({
      message: error.message,
      success: false,
    });
  }
});
router.get("/get-student-list", async (req, res) => {
  try {
    const user = await userModel.find({});
    const data = user.filter((val) => val.isAdmin === false);
    res.status(200).send({
      message: "Data fetch successfully",
      success: true,
      data: data,
    });
  } catch (error) {
    res.status(409).send({
      message: error.message,
      success: false,
    });
  }
});
router.put("/make-admin", async (req, res) => {
  try {
    const email = req.query.email;
    await userModel.findOneAndUpdate({ email: email }, { isAdmin: true });
    res.status(200).send({
      message: "Updated succesfully",
      success: true,
    });
  } catch (error) {
    res.status(409).send({
      message: error.message,
      success: false,
    });
  }
});
router.post("/add-course", async (req, res) => {
  try {
    const course = await courseModel.findOne({ name: req.body.name });
    if (course) {
      return res.status(409).send({
        message: "course already Exist",
        success: false,
      });
    }
    const newCourse = new courseModel(req.body);
    await newCourse.save();
    return res.status(200).send({
      message: "Course added",
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});
router.get("/generate-otp", async (req, res) => {
  try {
    const email = req.query.email;
    console.log(email);
    const isExist = await userModel.findOne({ email: email });
    if (!isExist) {
      return res.status(409).send({
        message: "User don't exist",
        success: false,
      });
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    const transport = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });
    const main = async () => {
      const info = transport.sendMail({
        from: {
          name: "developer_arijit",
          address: process.env.USER,
        },
        to: email,
        subject: "Password change OTP",
        text: `your OTP is ${otp}`,
        html: `<b>your OTP is ${otp}</b>`,
      });
    };
    main().then(() => {
      res.status(200).send({
        message: "OTP send succesfully",
        success: true,
        otp: otp,
      });
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});
router.post("/change-password", async (req, res) => {
  try {
    const email = req.query.email;
    console.log(email);
    console.log(req.body.password);
    const isExist = await userModel.findOne({ email: email });
    if (!isExist) {
      return res.status(409).send({
        message: "User don't exist",
        success: false,
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hassPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hassPassword;
    await userModel.findOneAndUpdate(
      { email: email },
      { password: req.body.password }
    );
    return res.status(200).send({
      message: "Password Changed succesfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});
router.post("/upload-notice", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(409).send({
        message: "No file present for upload",
        success: false,
      });
    }
    const pdf = new pdfModel({
      uri: req.file.uri,
      name: req.file.originalname,
      data: req.file.buffer,
    });
    await pdf.save();
    console.log("PDF uploaded:", pdf.name);
    return res.status(200).send({
      message: "Uploaded succesfully",
      success: true,
    });
  } catch (error) {
    console.error("Error uploading PDF:", error.message);
    return res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});
router.get("/get-notice", async (req, res) => {
  try {
    const pdf = await pdfModel.find({});
    return res.status(200).send({
      message: "Data fetch succesfully",
      success: true,
      data: pdf,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});
router.delete("/delete-course", async (req, res) => {
  try {
    const id = req.query.id;
    const course = await courseModel.findByIdAndDelete(id);
    const courseAll = await courseModel.find({});
    return res.status(200).send({
      message: "Delete successfully",
      success: true,
      dataVal:course,
      data: courseAll,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});
module.exports = router;
