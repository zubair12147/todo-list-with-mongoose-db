const express = require('express');
const bodyParser = require('body-parser');
const day = require(__dirname + '/day.js');
const mongoose = require('mongoose');
const _ = require("lodash");

mongoose.connect('mongodb://localhost:27017/to-do-list');

const app = express();
let port = 3000;
const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 200,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const TodoList = mongoose.model('TodoList', todoSchema);

const listSchema = new mongoose.Schema({
  name: String,
  list: [todoSchema],
});

const List = mongoose.model('List', listSchema);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

const item1 = new TodoList({
  text: 'This is just a text',
  completed: false,
  createdAt: Date.now(),
});

const item2 = new TodoList({
  text: 'This is just a text for item 2',
  completed: false,
  createdAt: Date.now(),
});

const item3 = new TodoList({
  text: 'This is just a text for item 3',
  completed: false,
  createdAt: Date.now(),
});

const items = [item1, item2, item3];

app.get('/', (req, res) => {
  var today = day.getDate();
  TodoList.find({})
      .then((foundItems) => {
        if (foundItems.length === 0) {
          TodoList.insertMany(items)
              .then(console.log('Inserted Successfully'))
              .catch((err) => {
                console.log(err);
              });
          res.redirect('/');
        } else {
          res.render('list', {today: today, item: foundItems});
        }
      })
      .catch((err) => {
        console.log(err);
      });
});

app.get('/:param', (req, res) => {
  const customListName = _.capitalize(req.params.param);
  List.findOne({name: customListName})
      .then((foundedItems) => {
        if (!foundedItems) {
          const list = new List({
            name: customListName,
            list: items,
          });
          list.save();
          res.redirect('/' + customListName);
        } else {
          res.render('list', {
            today: foundedItems.name,
            item: foundedItems.list,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
});

app.post('/delete', (req, res) => {
  const listName = req.body.listName;
  const checked = req.body.check;
  if (listName === day.getDate()) {
    TodoList.findByIdAndRemove(checked)
        .then(console.log('Removed successfully'))
        .catch((err) => {
          console.log(err);
        });
    res.redirect('/');
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {list: {_id: checked}}})
        .then((foundList) => {
          console.log('item removed: ' + foundList.list);
          res.redirect('/' + listName);
        })
        .catch((err) => {
          console.log(err);
        });
  }
});

app.post('/', (req, res) => {
  if (req.body.newItem === '') {
    console.log('Did you run right now');
    res.redirect('/');
  } else {
    const listName = req.body.button;
    let newList = new TodoList({
      text: req.body.newItem,
      completed: false,
      createdAt: Date.now(),
    });
    if (listName === day.getDate()) {
      newList.save();
      res.redirect('/');
    } else {
      List.findOne({name: listName})
          .then((foundedItem) => {
            foundedItem.list.push(newList);
            foundedItem.save();
            res.redirect('/' + listName);
          })
          .catch((err) => {
            console.log(err);
          });
    }
  }
});

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
