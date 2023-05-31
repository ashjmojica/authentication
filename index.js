const express = require("express");
const app = express();
const port = 3000;
const bcrypt =
  //middleware
  app.use(express.json());
//intercepting a route, before you hit the request and response

function authenticate(req, res, next) {
  if (req.body.name === "Joe") {
    next();
  } else {
    res.status(400).send("No");
  }
}

app.post("/sign_up", async (req, res) => {
  //expect user to send in the req.body
  //an email and password
  const { email, password } = req.body;
  if (!email) {
    res.status(400).send("Please include an email");
    return;
  }
  if (!password) {
    res.status(400).send("Please include a password");
    return;
  }
  // find the user by email
  const userToFind = await User.findOne({
    where: {
      email: email,
    },
  });
  // compare the user password that is coming in
  // to the user password that we found in the database on line 49
  // this returns true if it matches, false if it doesn't
  const passwordMatch = await bcrypt.compare(password, userToFind.password);
  if (!passwordMatch) {
    res.status(403).send("That is the wrong password, try again");
    return;
  }
  // this is where we start the passport session
  res.send(passwordMatch);
});

app.post("/login", (req, res) => {
  res.json({ message: "Login successful" });
});

app.post("/delete_secret_information", authenticate, (req, res) => {
  res.json({ message: "You deleted some stuff" });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
