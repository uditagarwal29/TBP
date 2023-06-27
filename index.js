const express = require("express"); // to initialize express library
const app = express(); // to use express
const mongoose = require("mongoose") // initialize mongodob library
const dotenv = require("dotenv");
const multer = require('multer')
const path = require('path');
const cors = require('cors')
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const port = process.env.PORT

dotenv.config();

//initialising mongoDB with secret key
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successfull!"))
  .catch((err) => {
    console.log(err);
  });

app.use(cors(
  {"Access-Control-Allow-Origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE"    
}
));

//multer to fetch images in websites
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});

app.use(express.static(__dirname + '/public'));

app.get('/' , (req,res) => {
  try{
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }catch(err){
      console.log(err);
  }
})

app.use(express.json()); //to allow express to take json files and to parse the json body recieved from user
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, "/public")));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public', 'index.html'));
  });
  }

app.listen(port || 80, () => { // to run this application of express on port number 5000
  console.log("Backend server is running at "+port)
})

//sending get request ---> when someone makes request to the url with "/api/test"--> we run the function
//but it is not a good practice to put all url requests in get request functions like below
// app.get("/api/test", () => {
//     console.log("test is successful")
// })


