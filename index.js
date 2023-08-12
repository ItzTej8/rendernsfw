import express from 'express';
import nsfwClient from './nsfwClient.js';
const app = express();
const port = 8087

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})


app.get('/', async (req, res, next) => {
  res.send("Hello");
  next()
});
  
app.get('/classify', async (req, res) => {
try {
  
  {

  const result = await nsfwClient(req.query.url);

  if(result[0] == true)
  {
    
    res.status(200).json({error : true})
    
  }
  else
  {
    res.status(200).json({
    error : result[0],
    isSafe : result[1],
    detetction: result[2][0].className,
    data: result[2],
    
  })
  }


    } 
  
}
catch (error)
{
  console.log(error)
}

})

