const express = require('express');
const bodyParser = require('body-parser');

const app = express();
var port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine",'ejs')

const week = ['','monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

app.get('/', (req, res) => {
    var today = new Date();
    res.render('list',{day : week[today.getDay()]});
});

app.listen(process.env.PORT || port , () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
