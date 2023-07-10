const express = require('express');
const bodyParser = require('body-parser');
const day = require(__dirname + '/day.js');
const app = express();
var port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set("view engine", 'ejs')

var items = [];

app.get('/', (req, res) => {
    var today = day.getDate();
    res.render('list', { today: today, item: items });
});

app.post('/', (req,res)=>{
    items.push(req.body.newItem);
    res.redirect('/');
})

app.listen(process.env.PORT || port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
