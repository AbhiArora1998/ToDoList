
const express = require("express")
const bodyParser = require("body-parser");

const dateJs = require(__dirname+"/date.js")

const myApp = express();

// The issue i had here was using app.use intead of app.set 
// ejs is one of the templating used in javascript  to use same html template for mutiple ususage
myApp.set('view engine','ejs')

myApp.use(bodyParser.urlencoded({extended:true}))
myApp.use(express.static('public'))


const items = []
var list
// get function is like asking server to provide some content and we use reponse to respond to the get function 
const workItems=[]
myApp.get("/",function(req, res){
    // this is the response from our server after the function from website
    
    // if(today.getDay() === 6|| today.getDay() === 0 ){
    //     // res.write('<p>shaka boom</p>')
    //     // res.write('<h1>hehe</h1>')
    //    day = "Weekend"
    // }else{
    //    day = "Weekday"
        
    //     // res.write('<p>shaka boom huhuhuh</p>')
    //     // res.write('<h1>its not hehe is hehe</h1>')
     
    // }
    // res.send();

    // if(today.getDay()===0){
    //     day = 'Sunday'
    // }else if(today.getDay()===1){
    //     day ='Monday'
    // }else if(today.getDay()===2){
    //     day ='Tuesday'
    // }else if(today.getDay()===3){
    //     day ='Wednesday'
    // }else if(today.getDay()===4){
    //     day ='Thursday'
    // }else if(today.getDay()===5){
    //     day ='Friday'
    // }else {
    //     day = 'Saturday'
    // }

    
    const day = dateJs.date();

    res.render('list',{listTitle:day, itemsChosen:items},);
})


myApp.post("/",function (req, res){
    var  item= req.body.userInput;
    console.log(req.body)
    if(req.body.button === 'Work'){
        
        workItems.push(item)
        res.redirect("/work")
    }else{
        items.push(item)
        res.redirect("/")
    }
  
 
})


// here list is the ejs page that we have created 
myApp.get('/work', function (req, res){
    res.render('list',{listTitle: 'Work List',itemsChosen: workItems })
})

myApp.get("/about", function (req, res){
    res.render('about')
})

myApp.listen(3000, function(){
    console.log("the server has started on the 3000");
})