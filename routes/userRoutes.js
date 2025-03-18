const express = require("express");
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require("../controllers/user");
const {login,logout}=require("../controllers/login")
const {validateUser}= require("../middlewares/validateUser")
const {authenticateUser}=require("../middlewares/authMiddleware")
const router = express.Router();

router.get("/users", authenticateUser, getAllUsers);//To get all users
router.get("/users/:id",authenticateUser,getUserById);//to fetch user by id
router.post("/users",validateUser, createUser);//to create user
router.put("/users/:id", authenticateUser,updateUser);//to update user
router.delete("/users/:id", authenticateUser,deleteUser);//to delete user
router.post("/login",login)//to login
router.post("/logout",authenticateUser,logout);//to logout

module.exports = router;

