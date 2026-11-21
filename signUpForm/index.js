const express = require('express');
const path = require('path');
const db = require('./utils/db-connection')

const userRoutes = require('./routes/userRoutes')
const expenseRoutes = require('./routes/expenseRoutes')
const paymentRoutes = require('./routes/paymentRoutes');

// require('/models')

const app = express();

app.use(express.static('public'))

app.use(express.json());


app.use('/users',userRoutes);
app.use('/expenses',expenseRoutes);

app.use('/', paymentRoutes);




// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname,"views","signup.html"));
// });

// app.get('/signup', (req, res) => {
//     res.sendFile(path.join(__dirname,"views","signup.html"));
// });

// app.get('/login', (req, res) => {
//     res.sendFile(path.join(__dirname,"views","login.html"));
// });

// app.get('/expense', (req, res) => {
//     res.sendFile(path.join(__dirname,"views","expense.html"));
// });

// app.get('/payment', (req, res) => {
//     res.sendFile(path.join(__dirname,"views","payment.html"));
// });


db.sync({force:true}).then(()=>{
    app.listen(3000, () => {
          console.log('Server is running on port 3000');
     })
}).catch(err => {
     console.log(err)
})
