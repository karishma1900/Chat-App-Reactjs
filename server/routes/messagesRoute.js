const { addMessage, getAllMessage } = require("../controllers/messagescontroller"); // Make sure these are defined in usercontroller
  
  const router = require("express").Router();
  
  // Define routes and associate them with the controller functions
  router.post("/addmsg/", addMessage);
  router.post("/getmsg", getAllMessage);

  
  module.exports = router;
  