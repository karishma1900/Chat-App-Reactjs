const {
    login,
    register,
    getAllUsers,
    setAvatar,
    logOut   // Import logOut
  } = require("../controllers/usercontroller"); // Make sure these are defined in usercontroller
  
  const router = require("express").Router();
  
  // Define routes and associate them with the controller functions
  router.post("/login", login);
  router.post("/register", register);
  router.get("/allusers/:id",getAllUsers); // Ensure the correct function name is used
  router.post("/setavatar/:id",setAvatar);
  router.get("/logout/:id",logOut);
  
  module.exports = router;
  