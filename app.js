const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
// console.log(date());

//setup the app
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.set("view engine", "ejs");
app.use(express.static("public"));


//database for new items added to todolist
//setting up connection to mongodb by mongoose
mongoose.connect("mongodb://localhost:27017/todolistDB");

//creating a blueprint for document in collection
const itemsSchema = new mongoose.Schema({
  name: String
});

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema]
});

//compiling itemsSchema into a model
const Item = mongoose.model("Item", itemsSchema);
const List = mongoose.model("List", listSchema);

//creating default documents to be put into our Items collection in todolistDB
const item1 = new Item({
  name: "Welcome to your todolist!"
});

const item2 = new Item({
  name: "Hit the + button to add a new item"
});

const item3 = new Item({
  name: "<-- Hit this to delete an item"
});

const defaultItems = [item1, item2, item3];

//home route for GET req
app.get("/", function(req, res) {
  // console.log("GET request received");
  // res.send("Hello World!");

  //reading data from todolistDB using mongoose
  Item.find({}, function(err, foundItems) {
    if (err) {
      console.log(err);
    } else {
      if (foundItems.length === 0) {
        Item.insertMany(defaultItems, function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log("Successfully saved default items to DB.");
            res.redirect("/");
          }
        })
      } else {
        // var items = foundItems;
        res.render("list", {
          listTitle: "Today",
          newListItems: foundItems
        });
      }
    }
  });
});

//GET req to dynamic route
app.get("/:customListName", function(req, res) {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({
    name: customListName
  }, function(err, foundList) {
    if (err) {
      console.log(err);
    } else {
      if (foundList) {
        // Show an existing list
        // console.log("Exists");
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items
        })
      } else {
        // Create a new list
        // console.log("Doesn't exist");
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
      }
    }

  });



});

//POST req to home route
app.post("/", function(req, res) {

  let itemName = req.body.newItem;
  let listName = req.body.list;

  const newItem = new Item({
    name: itemName
  });


  if (listName === "Today") {
    newItem.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: listName
    }, function(err, foundList) {
      if (!err) {
        foundList.items.push(newItem);
        foundList.save();
        res.redirect("/" + listName);
      } else {
        console.log(err);
      }
    });
  }
});

//delete route
app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === "Today"){
    Item.findByIdAndRemove(checkedItemId, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully deleted the checked item from Items List.");
      }
    });
    res.redirect("/");
  }else{
    List.findOneAndUpdate({name:listName}, {$pull: {items: {_id:checkedItemId}}}, function(err, foundList){
      if(!err){
        res.redirect("/" + listName);
      }else{
        console.log(err);
      }
    });
  }


});

app.listen(3000, function() {
  console.log("Server is running on port 3000");
});
