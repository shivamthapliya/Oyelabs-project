const express=require("express")
const dotenv=require("dotenv")
const sequelize = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app=express();
dotenv.config();
app.use(cookieParser());
app.use(cors({//allow cross origin sharing from anywhere
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"]
}));
app.use(express.json());
app.use(userRoutes);
const PORT = process.env.PORT || 5000;
app.get("/",(req,res)=>{res.send("server running...")});//default route


sequelize
  .sync({force:true}) 
  .then(() => {
    console.log(" Database connected & models synced");
    app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
  })
  .catch((error) => console.error(" Database sync error:", error));