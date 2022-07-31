const userModel = require("../models/userModel");
const aws = require("../awsConfigs/aws");
const { isValid, isEmptyBody, isValidEmail, isValidPhone, isValidPassword } = require("../validator/validation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const createUserRegistration = async function (req, res) {
    try {
        let data = req.body;
        let files = req.files;

        let { name, email, password, phone } = data;


        if (isEmptyBody(data)) {
            return res.status(400).send({ status: false, msg: "invalid data " })
        }

        if (!isValid(name)) {
            return res.status(400).send({ status: false, msg: "Name is required" })
        }

        if (!isValid(email)) {
            return res.status(400).send({ status: false, msg: "email is required" })
        }

        const isEmailInUse = await userModel.findOne({ email: email })
        if (isEmailInUse) {
            return res.status(400).send({ status: false, message: "email already registered, enter different email" })
        }

        if (!isValidEmail(email)) {
            return res.status(400).send({ status: false, msg: "please enter valid Email" })
        }

        if (!isValid(password)) {
            return res.status(400).send({ status: false, msg: 'password is required' })

        }

        if (!isValidPassword(password)) {
            return res.status(400).send({ status: false, msg: "invalid Password" })
        }



        if (!isValid(phone)) {
            return res.status(400).send({ status: false, msg: "phone is required" })
        }

        if (!isValidPhone(phone)) {
            return res.status(400).send({ status: false, msg: "please enter valid phone" })
        }
        const encryptedPassword = await bcrypt.hash(data.password, 10)

        let profilePic = await aws.uploadFile(files[0])
        if (!profilePic) {
            return res.status(400).send({ status: false, msg: "upload error" })
        }

        const newData = {
            name: name,
            email: email,
            password: encryptedPassword,
            phone: phone,
            profilePic: profilePic
        }
        let userRegistration = await userModel.create(newData);
        return res.status(201).send({ status: true, msg: "userCreated Succesfully", data: userRegistration })
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }

}


const login = async function (req, res) {
    try {
        let data = req.body
        let email = data.email;
        let password = data.password;
        if (!email || !password) {
            return res.status(400).send({ status: false, msg: "email &password mandatory" })
        }
        let check = await userModel.findOne({ email: email })
        if (!check) {
            return res.status(404).send({ status: false, msg: "invalid email & password" })
        }
        const decryptPassword = await bcrypt.compare(password, check.password);
        if (!decryptPassword) {
            return res.status(400).send({ status: false, message: "Incorrect Password" });
        }
        else {
            let payload = { userId: check._id }
            let token = jwt.sign(payload, "Envigo")
            if (token) {
                res.setHeader("x-auth-token", token)
            }

            res.status(201).send({ status: true, msg: "token created succesfully", data: token })
        }
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }

}

const updateUser = async function (req, res) {
    try {
        if (req.userId != req.params.userId) {
            return res.status(400).send({ status: false, msg: "Not Authorize" })
        }
        let userId = req.params.userId;
        let files = req.files;
        let userData = await userModel.findById(userId)
       
        if (!userData) {
            return res.status(404).send({ status: false, msg: "userId is invalid" })
        }
        let updateData = req.body;
        if (updateData) {
            userData.name = updateData.name
            userData.email = updateData.email
            userData.phone = updateData.phone
            userData.profilePic = await aws.uploadFile(files[0])
        }
        userData.save()
        return res.status(200).send({ status: true, msg: "userData updated succesfully", data: userData })
    }
    catch (err) {
        return res.status(500).send({ statuts: false, msg: err.message })
    }
}


const getDetailsById = async function (req, res) {
    try {
        if (req.userId != req.params.userId) {
            return res.status(400).send({ status: false, msg: "Not Authorize" })
        }
        let userId = req.params.userId;
        if (!userId) {
            return res.status(400).send({ status: false, msg: "please fill user Id " })
        }
        let userDetails = await userModel.findById(userId)
        if (!userDetails) {
            return res.status(404).send({ status: false, msg: "no details found" })
        } else {
            return res.status(200).send({ status: true, msg: "user Details found ", data: userDetails })
        }
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports.createUserRegistration = createUserRegistration
module.exports.login = login
module.exports.updateUser = updateUser
module.exports.getDetailsById = getDetailsById


