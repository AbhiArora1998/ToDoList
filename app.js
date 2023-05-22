// express to run the server
const express = require("express")
// to send the input back and forth from the front end 
const bodyParser = require("body-parser");
// to get the date
const dateJs = require(__dirname+"/date.js")
// for the mongo db data
const mongoose = require('mongoose');
const _ =require("lodash");
const { application } = require("express");

const myApp = express();

// The issue i had here was using app.use intead of app.set 
// ejs is one of the templating used in javascript  to use same html template for mutiple ususage
myApp.set('view engine','ejs')
myApp.use(bodyParser.urlencoded({extended:true}))

// to make this folder public 
myApp.use(express.static('public'))

// to connect to the port allocated to mongoose in this os
mongoose.connect('mongodb+srv://admin_Abhi:Badminton23@cluster0.hpojfyp.mongodb.net/todolistDB',{useNewUrlParser:true});



var list
itemCounter = 2;
// get function is like asking server to provide some content and we use reponse to respond to the get function 



// schema for the items in the list
const itemSchema ={
    item_id: Number,
    item: String
}
// this is the list for all the items in particular page
const listSchema={
    listName:String,
    listOfItems: [itemSchema]
}


const Item =  mongoose.model('Item',itemSchema)
const List = mongoose.model('List',listSchema)

const item1 = new Item({
    item_id:1,
    item:"Read book"
})

const item2 = new Item({
    item_id:2,
    item:"eat Something"
})

itemsArrayForSchema=[item1,item2]


myApp.get("/",function(req, res){
    // this is the response from our server after the function from website

       // Note that i had an error here and i was not able to shwo te values inside the  table
        // this was because i forgot to add two variables one is err and the ohter will be values 
        // err variables is needed to be added or it will show null value error
    Item.find({},function(err,foundItems){
        
        if(foundItems.length === 0){
            Item.insertMany(itemsArrayForSchema, function(err){
                if(err){
                    console.log("the item has not been added",err)
                }else{
                    console.log("the items has been added successfully")
                }
            });   
            res.redirect('/')   
        }else{
            const day = "Today";
            res.render('list',{listTitle:day, itemsChosen:foundItems},);   
        }
    }); 
});

/*
this will choose the custom path made by people
and will reflect the custom list assocaited with it 
*/
myApp.get("/:pathchosen", function(req,res){
    
    const myCustomPath = _.capitalize(req.params.pathchosen) ;
    

    // look for the record with given path
   List.findOne({listName:myCustomPath},function(err, result){
        if(!err){
            // if it does not exist which is null
            if(!result){
                console.log("We successfully invented a new list")
                  
                const list =  new List({
                    listName: myCustomPath,
                    listOfItems: itemsArrayForSchema
                })
                list.save();
                res.redirect('/'+myCustomPath)
            }else{  
               // else just rerender that list as it exist already in our database
                res.render("list",{listTitle:result.listName,itemsChosen:result.listOfItems})
            }
        }else{
            console.log("I am sorry seargeant")
        }
   })
   
  
})


/*
    This gets called when user add anything to the list in today's todo list 
*/ 
myApp.post("/",function (req, res){
    const  itemName= req.body.userInput;
    const listTitle =req.body.button;
    console.log("This is suppose to be the title",listTitle)
    const item = new Item({
        item:itemName
    })

    if(listTitle ==="Today"){
        item.save();
    res.redirect('/')
    }else{
        List.findOne({listName:listTitle}, function (err, foundList){
            foundList.listOfItems.push(item);
            foundList.save();
            res.redirect("/"+ listTitle)
        })
    }
    
})

myApp.post('/delete', function(req,res){
    const checkboxId= req.body.myCheckbox;
    const listName = req.body.hiddenListname
    
    if(listName ==="Today"){
        Item.findByIdAndRemove(checkboxId,function(err){
            if(err){
                console.log("item has not been deleted")
            }else{
                console.log("item has been deleted successfully")
                res.redirect('/')
            }
        })
    }else{
        List.findOneAndUpdate({listName:listName},{$pull: {listOfItems:{_id:checkboxId}}},function(err, foundList){
            if(!err){
                res.redirect("/"+listName)
            }
        });
    }

    
})






myApp.get("/about", function (req, res){
    res.render('about')
})

const port = process.env.PORT ;

if(port == null|| port==""){
    port = 3000
}



myApp.listen(port, function(){
    console.log("the server has started on the 3000");
})


// const pageName  =req.body.button;
    // const item = new Item({
    //     item:itemName
    // });

    // if(pageName==='today'){
    //     item.save();
    //     res.redirect('/');
    // }else{
        
    //     ListSchema.findOne({listName:pageName},function(err,foundList){
    //         if(!err){
    //             foundList.listOfItems.push(item);
    //             foundList.save();
    //             res.redirect('/'+pageName)
    //         }
    //     })
    // }


    // myApp.get("/:chosenPage", function(req,res){
//     const page = req.params.chosenPage
//     console.log(page,"what")

//     ListSchema.findOne({listName:page},function(err, foundList){
//        console.log("are we here")
//         if(!err){
            
//             if(!foundList){
//                 console.log("did not find the list",page)
//                 const list  = new ListSchema({
//                     listName: page,
//                     listOfItems: itemsArrayForSchema
//                 })
//                 list.save();
//                 res.redirect('/'+page)
//             }else{
//                 // where we show the list
//                 res.render('list',{listTitle:foundList.listName,itemsChosen:foundList.listOfItems})
//             }   
//         }
//     })


    
// })
// myApp.post('/delete',function(req,res){
//     const valueToBeDeleted= req.body.checkbox
//     const valueFromOtherpages = req.body.deletedItems
//     console.log(valueFromOtherpages,"here we are for the deleted items",valueToBeDeleted);

//     if(valueFromOtherpages==='today'){
//         Item.findByIdAndRemove(valueToBeDeleted,function(err){
//             if(err){
//                 console.log(err)
//             } else{
//                 console.log("the value has been deleted")
//                 res.redirect('/')
//             }
                
//         })
//     }else{
//         ListSchema.findOneAndRemove(valueToBeDeleted,function(err){
//             if(!err){
//                 console.log('Successfully deleted')
//                 res.redirect('/'+valueFromOtherpages)
//             }else{
//                 console.log(err)
//             }
//         })
//     }

   
// })
