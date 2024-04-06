const { write, writeFile } = require("fs");
const date = require("date-and-time");
const now = new Date();
const router = require("express").Router();
const fs = require("fs").promises;
router.get("/get-exam-list", async (req, res) => {
  try {
    const dataVal = await fs.readFile("./examjson/exam.json", "utf-8");
    const data = dataVal ? JSON.parse(dataVal) : [];
    res.send({
      message: "Data send succesfully",
      data: data,
      success: true,
    });
  } catch (error) {
    res.send({
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
          message: "Question send succesfully",
          data: data[i].question,
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
    res.status(409).send({
      message: error.message,
      success: true,
    });
  }
});
router.post("/add-attempt", async (req, res) => {
  try {
    const id = req.query.id;
    const examName = req.query.examName;
    const dataVal = await fs.readFile("./attempt/attempt.json", "utf-8");
    let data = dataVal ? JSON.parse(dataVal) : [];
    let userExists = false;

    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        userExists = true;
        const examList = data[i].examList;
        let examExists = false;

        for (let j = 0; j < examList.length; j++) {
          if (examList[j].examname === examName) {
            examExists = true;
            if (examList[j].attempt < 2) {
              return res.send({
                message: "Limit reached",
                success: false,
              });
              break;
            } else {
              examList[j].attempt = 1;
              break;
            }
          }
        }

        if (!examExists) {
          examList.push({ examname: examName, attempt: 1 });
        }

        break;
      }
    }

    if (!userExists) {
      data.push({ id: id, examList: [{ examname: examName, attempt: 1 }] });
    }

    await fs.writeFile("./attempt/attempt.json", JSON.stringify(data));

    return res.send({
      message: "Exam added for attempt",
      success: true,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});
router.post("/add-result", async (req, res) => {
  try {
    const id = req.query.id;
    const examName = req.query.examname;
    const dataVal = await fs.readFile("./result/result.json", "utf-8");
    const dataValadmin = await fs.readFile(
      "./result/resultadmin.json",
      "utf-8"
    );
    const dataAdmin = dataValadmin ? JSON.parse(dataValadmin) : [];
    dataAdmin.push({
      name: req.body.name,
      examname: examName,
      score: req.body.score,
      data: date.format(now, "YYYY/MM/DD"),
    });
    await fs.writeFile("./result/resultadmin.json", JSON.stringify(dataAdmin));
    const data = dataVal ? JSON.parse(dataVal) : [];
    let found = false;
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        data[i].examlist.push({
          examname: examName,
          score: req.body.score,
          date: date.format(now, "YYYY/MM/DD"),
        });
        found = true;
        break;
      }
    }
    if (!found) {
      data.push({
        id: id,
        examlist: [
          {
            examname: examName,
            score: req.body.score,
            date: new Date().toISOString(),
          },
        ],
      });
    }
    await fs.writeFile("./result/result.json", JSON.stringify(data));
    res.send({
      message: "Result added successfully",
      success: true,
    });
  } catch (error) {
    res.status(409).send({
      message: error.message,
      success: false,
    });
  }
});
router.get("/get-result", async (req, res) => {
  try {
    const id = req.query.id;
    console.log(id);
    const dataVal = await fs.readFile("./result/result.json", "utf-8");
    const data = dataVal ? JSON.parse(dataVal) : [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        res.status(200).send({
          message: "Result fetch succesfully",
          success: true,
          data: data[i].examlist,
        });
        return;
      }
    }
    res.status(409).send({
      message: "Something went wrong",
      success: false,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});
module.exports = router;
