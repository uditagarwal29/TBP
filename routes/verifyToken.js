const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    //Headers represent the metadata associated with API request, here api request is "/user" and metadata is the token
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            if (err) res.status(403).json("Token is not valid!"); //if token is expired or wrong
            req.user = user; // if token is valid , current user is assigned to the request like adding
            next();
        });
    }
    else {
        return res.status(401).json("You are not Authenticated"); // if token dosent exits in user
    }
};

const verifyTokenAndAuthorization = (req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.id === req.params.id || req.user.isAdmin){
            next()
        }
        else{
            res.status(403).json("NOT AUTHORIZED")
        }
    })
}

//Since adding or order or product can be done only by admin, we are creating a seperate token verifier for admin
const verifyTokenAndAdmin = (req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.isAdmin){
            next()
        }
        else{
            res.status(403).json("NOT AUTHORIZED")
        }
    })
}

module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin };