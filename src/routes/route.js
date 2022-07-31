const express = require("express");
const router = express.Router();
const userController=require("../controllers/userController");
const Middleware=require("../middleware/auth")

router.post("/userRegister",userController.createUserRegistration);
router.post("/userLogin",userController.login);
router.put("/update/:userId",Middleware.authorize,userController.updateUser);
router.get("/getUserDetails/:userId",Middleware.authorize,userController.getDetailsById);
module.exports =router;