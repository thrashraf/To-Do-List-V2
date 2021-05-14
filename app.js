//this is package where we are just install on terminal
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');



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




///////////////////////////////

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

app.post('/delete' , function (req, res) {

    const checkItemId = req.body.checkbox;

    Item.findByIdAndRemove(checkItemId , function (err) {

        if (!err) {
            console.log("success remove item");
            res.redirect("/");
        }
        
    })
    
})


app.post('/' , function(req , res){

    
    
     const NewItem = req.body.input;

     const item = new Item({

        name:NewItem,
     });

     item.save();
     
    res.redirect('/')


});

app.get('/work' ,function(req , res){

    res.render('list',{ListTitle: 'Work List' , newListItems: workItem})
})

app.post('/work' , function(req ,res){


    let item = req.body.newItem


  
})

app.get('/about' , function(req ,res){

    res.render('about')
})


app.listen(3000 , function(res , req){

    console.log('server is running on port 3000')
})