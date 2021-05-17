//this is package where we are just install on terminal
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require("lodash");



const app = express()
app.use(bodyParser.urlencoded({extended: true}))
// this is how to use ejs view engine
app.set('view engine', 'ejs');

app.use(express.static("public"));


/// Mongoose///

//mongoose connect
mongoose.connect('mongodb://localhost:27017/todolistDB' , {

    useNewUrlParser: true,
    useUnifiedTopology: true
});

// mongoose DB scheme
const itemsScheme = {
    name: String,
};

//mongoose model
const Item = mongoose.model("Item",itemsScheme);

const item1 = new Item ({

    name:"Welcome",
});
const item2 = new Item ({

    name:"To",
});
const item3 = new Item ({

    name:"To DO List V2",
});

const defaultItems = [item1 ,item2 ,item3];


/////New item scheme

const Listscheme = {

    name:String,
    items:[itemsScheme],
};

const List = mongoose.model("List",Listscheme);





// get route to root
app.get('/' , function(req , res ){

    Item.find({} , function (err ,foundItems) {

        if (foundItems.length === 0){

            Item.insertMany(defaultItems , function (err) {

                if(err){
                    console.log("error");
                }else{
                    console.log("success");
                }   
            });
            res.redirect("/");

        }else{
        res.render('list', {ListTitle : "Today" ,  newListItems : foundItems})
        }
    });
});

// create new list
app.get('/:customListName' , function(req , res){

    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name:customListName} , function (err , foundLists) {

        if (!err){

            if(!foundLists){

               const list = new List({

                name:customListName,
                items:defaultItems,
               });
            list.save();
            res.redirect('/' + customListName);
               
            }else{
                
                res.render("list",  {ListTitle : foundLists.name ,  newListItems : foundLists.items} )
            }
        }
        
    });

});

// delete item on the list
app.post('/delete' , function (req, res) {

    const checkItemId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today"){

        Item.findByIdAndRemove(checkItemId , function (err) {

            if (!err) {
                console.log("success remove item");
                res.redirect("/");
            }  
        });
    }else{

        List.findOneAndUpdate({name: listName} , {$pull: {items: {_id: checkItemId}}} , function (err ,foundList) {
            if(!err){
                
                res.redirect("/" + listName);
            }
        })
    }

    
})

// adding new item to DB
app.post('/' , function(req , res){

    
    
     const NewItem = req.body.input;
     const listName = req.body.button;

     const item = new Item({

        name:NewItem,
     }); 

    if(listName === "Today"){

    item.save();
    res.redirect('/')

   }else{

    List.findOne({name: listName}, function (err , foundListItem) {
        
        foundListItem.items.push(item);
        foundListItem.save();
        res.redirect("/"+ listName);    
    });
   }

});

app.listen(3000 , function(res , req){

    console.log('server is running on port 3000')
})