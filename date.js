
// here we have created another js file so that we do not cluster our server files which is app.js 
// once the file is created we need to use module.exports to be able to send the function information to whereever it is required
// once we set it to require we can tap into the function that we have created here 

// note that we can target by assigining the function to not the entire module using that variable as module can send an object which means we can assign mutiple things to an object
// module.exports.date = myDate

// now there is another way to call a function in javascript 
exports.date = function (){
    const today  = new Date();
    const options = {
        weekday:'long',
        day:'numeric',
        month:'long'
    }
    return today.toLocaleDateString('en-us',options)
     
}

exports.day = function (){
    const today  = new Date();
    const options = {
        weekday:'long',
    }
    return today.toLocaleDateString('en-us',options)
}
