const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");

});

app.post("/", function(req, res) {

  const fName = req.body.firstName;
  const lName = req.body.lastName;
  const email = req.body.email;

  var data = {
    members: [
    {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: fName,
        LNAME: lName
      }
    }
  ]
};


const jsonData = JSON.stringify(data);

const url = "https://us7.api.mailchimp.com/3.0/lists/a76922af71";

const options = {
  method: "POST",
  auth: "sezar81:02bcfa3ffe2fdb5a56bbf65780635747-us7"
}

const request = https.request(url, options, function(response) {

  response.on("data", function(data) {
    const serverData = (JSON.parse(data));

if(serverData.error_count > 0) {
  res.sendFile(__dirname + "/failure.html");
}
else if (response.statusCode != 200) {
  res.sendFile(__dirname + "/failure.html");
}
  else{
  res.sendFile(__dirname + "/success.html");

}
});
});

request.write(jsonData);
request.end();

});

app.post("/failure", function(req, res) {
  res.redirect("/");
});


app.listen(3000, function() {
  console.log("Server is running on port 3000");
});



// ETT ANNAT EXEMEPEL NEDAN!!!!
// const express = require("express");
// const bodyParser = require("body-parser");
// const https = require("https");
//
// //require MailChimp and async
// const mailchimp = require('@mailchimp/mailchimp_marketing');
// const async = require('async');
//
// const app = express();
//
// //Setting up our static path and Body Parser
// app.use(express.static("public"));
// app.use(bodyParser.urlencoded({
//   extended: true
// }));
//
// //This code comes from MailChimp's github and is now required to configure Mailchimp to be able to interface with your account.
// mailchimp.setConfig({
//   apiKey: '02bcfa3ffe2fdb5a56bbf65780635747-us7',
//   server: 'us7',
// });
//
// //Sending the signup page when someone comes to our website
// app.get("/", function(req, res) {
//   res.sendFile(__dirname + "/signup.html");
// })
//
// //Our post function for after they hit submit.  Grabs the data they sent to us so that we can send it to MailChimp.
// app.post("/", function(req, res) {
//   const firstName = req.body.firstName;
//   const lastName = req.body.lastName;
//   const email = req.body.email_addressmail;
//   const listId = "a76922af71";
//   console.log(firstName);
//   console.log(lastName);
//   console.log(email);
//
// //This creates a function for us to run later that sends the info to MailChimp.  Part of this comes straight from the MailChimp guide, the rest is for handling the response.
//   async function run() {
//
// //try/catch is used in an async function to catch any errors that come back.  Like if/else, it can run a different set of instructions based on what comes back.
//     try {
//       const response = await mailchimp.lists.addListMember(listId, {
//         email_address: email,
//         status: "subscribed",
//         merge_fields: {
//           FNAME: firstName,
//           LNAME: lastName
//         }
//       })
//       res.sendFile(__dirname + "/success.html");
//     } catch (error) {
//       console.log(error);
//       res.sendFile(__dirname + "/failure.html");
//     }
//   };
//
// //running the function created above.
//   run();
//
//
// //Our listener that opens the server
// app.listen(3000, function() {
//   console.log("I am so depressed.  Brain the size of a planet, but here I am starting your server on port 3000.  Shut up Marvin!!");
// });
