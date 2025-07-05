// jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https"); 

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;

  const url = "https://us19.api.mailchimp.com/3.0/lists/6cb7d055fc";
  
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fname,
          LNAME: lname
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const options = {
    method: "POST",
    auth: "shikat:f5b57ab8837b8accdad66511dd02bbc2-us19"
  };

  const request = https.request(url, options, function(response) {
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });

    // Optional: Check status code and send success/failure page
    if (response.statusCode === 200) {
      res.sendFile(__dirname+"/succ.html");
    } else {
      res.sendFile(__dirname+"/fail.html");
    }
  });

  request.write(jsonData);
  request.end(); // ✅ IMPORTANT: Close the request
});
app.post("/redo",(req,res)=>{
  res.redirect("/");
});

// Start server
app.listen(process.env.PORT ||3000, () => {
  console.log("Server is running on port 3000");
});

// the 
// curl -sS -X POST "https://mandrillapp.com/api/1.0/users/ping" \
//   --header 'Content-Type: application/json' \
//   --data-raw '{ "key": "YOUR_API_KEY" }'

// api key
// f5b57ab8837b8accdad66511dd02bbc2-us19
// audience id
// 6cb7d055fc