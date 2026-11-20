const express = require('express');
const path = require('path');
const db = require('./utils/db-connection')

const userRoutes = require('./routes/userRoutes')


// require('/models')

const app = express();

app.use(express.static('public'))

app.use(express.json());


app.use('/users',userRoutes);


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,"views","index.html"));
});


db.sync({force:true}).then(()=>{
    app.listen(3000, () => {
          console.log('Server is running on port 3000');
     })
}).catch(err => {
     console.log(err)
})
