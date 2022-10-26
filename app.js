const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
// console.log(date());

//setup the app
const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static("public"));


//collection for new items added to ToDo list
let items = ["Buy Food","Cook Food", "Eat Food"];
let workItems = [];

//home route for GET req
app.get("/", function(req, res){
  // console.log("GET request received");
  // res.send("Hello World!");
  let day = date.getDate();

  res.render("list", {listTitle: day, newListItems:items});
});

//POST req to home route
app.post("/", function(req, res){

  let item = req.body.newItem;

  if(req.body.list === "Work"){
    workItems.push(item);
    res.redirect("/work");
  } else{
    items.push(item);
    res.redirect("/");
  }

});

//work route
app.get("/work", function(req, res){
  res.render("list", {listTitle:"Work List", newListItems: workItems});
});

app.listen(3000, function(){
  console.log("Server is running on port 3000");
});









// switch (currentDay) {
//   case 0:
//     day = "Sunday";
//     break;
//   case 1:
//     day = "Monday";
//     break;
//   case 2:
//     day = "Tuesday";
//     break;
//   case 3:
//     day = "Wednesday";
//     break;
//   case 4:
//     day = "Thursday";
//     break;
//   case 5:
//     day = "Friday";
//     break;
//   case 6:
//     day = "Saturday";
//     break;
//   default:
//     console.log("Error: current day is equal to: " + currentDay);
// }
