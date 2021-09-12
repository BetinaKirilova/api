const express = require("express");
const bodyParser = require("body-parser");

const mailchimp = require("@mailchimp/mailchimp_marketing");
const app = express();
app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});
app.post("/", (req, res) => {
  let fn = req.body.firstName;
  let ls = req.body.lastName;
  let email = req.body.email;
  const subscribingUser = {
    firstName: fn,
    lastName: ls,
    email: email,
  };

  mailchimp.setConfig({
    apiKey: "d2ab303c1691857e14371bfb792d3730-us5",
    server: "us5",
  });
  const listId = "81f92b5588";
  //Mailchimp API POST New Subscriber Function
  async function run() {
    //"Try" this function and if successful do the following
    try {
      const response = await mailchimp.lists.addListMember(listId, {
        email_address: subscribingUser.email,
        status: "subscribed",
        merge_fields: {
          FNAME: subscribingUser.firstName,
          LNAME: subscribingUser.lastName,
        },
      });
      //My Custom Response. You can log anything you want, like just the whole 'response' too
      console.log(`${response.merge_fields.FNAME} 
                             ${response.merge_fields.LNAME} with email ${response.email_address} has been successfully registered`);
      res.sendFile(__dirname + "/success.html");
    } catch (err) {
      // If the 'Try' function isn't successful, do this on failure.
      //This is will return the error code
      console.log(err.status);
      res.sendFile(__dirname + "/failure.html");
    }
  }
  run();
});

app.listen(3000, () => {
  console.log("Listening on port 3000;");
});

//API Key
//d2ab303c1691857e14371bfb792d3730-us5
//List ID
//81f92b5588
