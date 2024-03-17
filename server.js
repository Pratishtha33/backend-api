const express= require('express')
const app =express();
const port= 3000;
app.get("/" ,(req, res) => {
res.send("hello worlld");   //get request
});
app.listen(port, ()=> console.log(`app lisening ${port} `));