const express = require ("express");
const bodyParser = require("body-parser");
const request = require("request")
const https = require("https");
const { url } = require("inspector");
require("dotenv").config();


const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res){

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);

    const apiKey = process.env.MAILCHIMP_API_KEY;
    const listId = process.env.MAILCHIMP_LIST_ID;
    const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX;

    // const url = `https://us22.api.mailchimp.com/3.0/lists/3899c93c5c`;
    const url = `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}`;

    const options = {
        method: "POST",
        auth: `david1:${apiKey}`
        // auth: `david1:dbc98b8955faff0328ae51dc5b4bdc6a-us22`
    }

    const request = https.request(url, options, function(response){
        
        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        } else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();

})

app.post("/failure", function(req, res) {
    res.redirect("/")
})

app.post("/success", function(req, res) {
    res.redirect("/")
})

app.listen(7000, function(){
    console.log("Server is running on port 7000");
})


// api key
// dbc98b8955faff0328ae51dc5b4bdc6a-us22

// list id
// 3899c93c5c