const authentication = function (req, res, next) {
  const jwt = require("jsonwebtoken");

  const t = req.headers.authorization;
  if (t != undefined) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "Protected", (err, decode) => {
      if (err) {
        console.log("Wrong token . Please enter correct token");
        res.send("Wrong token . Please enter correct token");
      } else {
        next();
      }
    });
  } else {
    res.send("Please enter token");
  }
};

module.exports = authentication;
