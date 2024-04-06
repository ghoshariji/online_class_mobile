const router = require("express").Router();
const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const courseModel = require("../model/courseModel")
const middlewrare = require("../middleware/authMiddleware")
router.post("/signup", async (req, res) => {
  try {
    console.log(req.body)
    const userExist = await userModel.findOne({ email: req.body.email });
    if (userExist) {
    return res.status(409).send({
        message: "User already exist",
        success: false,
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hassPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hassPassword;
    // creating a new user model
    const newuser = new userModel(req.body);
    await newuser.save();
   return res.status(200).send({
      message: "Singup suucesfully",
      success: true,
    });
  } catch (error) {
  return  res.status(500).send({
      message: error.message,
      success: false,
    });
  }
});
router.post("/login", async (req, res) => {
try {
  console.log(req.body)
  const useExist = await userModel.findOne({email:req.body.email});
  if(!useExist)
  {
    return res.status(500).send({
      message:"User don't exist",
      success:false
    })
  }
  const validPassword = await bcrypt.compare(req.body.password,
    useExist.password)
    if(!validPassword)
    {
      return res.status(500).send({
        message:"Password dont't match",
        success:false
      })
    }
    const token = jwt.sign({userId:useExist._id},process.env.SECRET_KEY,{
      expiresIn:"1d"
    })
    return res.status(200).send({
      message:"User login succesfully",
      success:true,
      data:useExist,
      id:useExist.id,
      isAdmin:useExist.isAdmin,
      name:useExist.name,
      token:token
    })
} catch (error) {
  return res.status(500).send({
    message:error.message,
    success:false
  })
}
});
router.get("/get-course",async(req,res)=>{
  try {
    const course = await courseModel.find({})
    return res.status(200).send({
      message:"Course send succesfully",
      success:true,
      data:course
    })
  } catch (error) {
    return res.status(500).send({
      message:error.message,
      success:false
    })
  }
})
router.post("/get-user-info",middlewrare,async(req,res)=>{
  try {
    const user = await userModel.findById(req.body.userId)
    return res.status(200).send({
      message:"Data send succesfully",
      success:true,
      data:user,
      id:user._id,
      name:user.name
    })
  } catch (error) {
    return res.status(401).send({
      message:error.message,
      success:false
    })
  }
 
})
router.get("/get-course-details",async(req,res)=>{
  try {
    const courseName = req.query.name
    console.log(courseName);
    const course = await courseModel.findOne({name:courseName})
    return res.status(200).send({
      message:"Details fetch succesffuly",
      success:true,
      data:course
    })
  } catch (error) {
    return res.status(500).send({
      message:error.message,
      success:false
    })
  }
})
module.exports = router;
