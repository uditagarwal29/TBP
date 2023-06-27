const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//REGISTER
router.post("/register", async (req, res) => {
    const newUser = new User({
        // username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(), // Security -> encrypts password by hashing
    });

    try {
        //save is a promise which is a async fx, it takes some milliseconds to adding, deleteing etc documents form mongoDB
        //so we use await
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        // in case user didnt enter email, password etc, we get error
        res.status(500).json(err);
    }
});

//LOGIN

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(401).json("Wrong credentials!"); // if wrong user email input then display 'Wrong credentials'

        //decrypt pasword
        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        const Orignalpassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        Orignalpassword !== req.body.password && res.status(401).json("Wrong Password"); //if password dosent match the password from DB

        //after login is successfull, we create json token for user
        const accessToken = jwt.sign({
            id: user._id, // from mongoDB get the unique userId created by mongoDB
            isAdmin: user.isAdmin,
        }, process.env.JWT_SEC,
            { expiresIn: "3d" } // token expires in 3 days, after that login again
        );

        const { password, ...others } = user._doc; // removing password from other information from the user json that is fetched from mongoDB
        //mongoDB actually stores our documents in attribute _doc of the actual fetched document (user)

        res.status(200).json({...others,accessToken});  // we are showing user only informaatio other than password

    } catch (err) {
        res.status(500).json(err);
    }

})

module.exports = router;

