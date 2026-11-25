const express = require('express');
const path = require('path');
const fs = require('fs')
const db = require('./utils/db-connection')
const cookieParser = require('cookie-parser');
const morgan = require('morgan')


const userRoutes = require('./routes/userRoutes')
const expenseRoutes = require('./routes/expenseRoutes')
const paymentRoutes = require('./routes/paymentRoutes');
const premiumRoutes = require('./routes/premiumRoutes');
const passwordRoutes = require('./routes/passwordRoutes')

const errorHandler = require('./middleware/errorHandler');

require('dotenv').config();
require('./models')



const app = express();


const accessLogStream = fs.createWriteStream(
    path.join(__dirname,'access.log'),
    {flags: 'a'}
);

app.use(morgan('combined',{stream:accessLogStream}));

app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/users',userRoutes);
app.use('/expenses',expenseRoutes);
app.use('/password',passwordRoutes);
app.use('/payment', paymentRoutes);
app.use('/premium',premiumRoutes)

app.use(errorHandler);





app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,"views","signup.html"));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname,"views","signup.html"));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname,"views","login.html"));
});

app.get('/expense', (req, res) => {
    res.sendFile(path.join(__dirname,"views","expense.html"));
});




const port = process.env.PORT || 3000

db.sync({force:true}).then(()=>{
    app.listen(port, () => {
          console.log('Server is running on port 3000');
     })
}).catch(err => {
     console.log(err)
})
