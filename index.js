const express = require('express');
const Users = require('./data/db.js');

const server = express();
server.use(express.json());

server.get('/api/users', (req, res) => {
    Users.find()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ errorMessage: 'Could not retrieve all Users information'})
        })
});
server.get('/api/users/:id', (req, res) => {
    const { id } = req.params;
    Users.findById(id)
        .then(user => {
            if(user){ 
            res.status(200).json(user) 
            } else {
            res.status(404).json({ message: 'The user with the specified ID does not exist.' 
            })}
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ errorMessage: "The user information could not be retrieved." })
        })
});
server.post('/api/users', (req, res) => {
    const newUser = req.body;
    console.log('Posting New User', newUser)
    if(newUser.name && newUser.bio){
        Users.insert(newUser)
            .then(user => {
                res.status(201).json(user)
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({ errorMessage: "There was an error while saving the user to the database." })
            })
   } else {
       res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
   };
});
server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;
    Users.remove(id)
        .then(user => {
            if(user){
                res.status(200).json(user)
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist." })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ errorMessage: "The user could not be removed." })
        })
});
server.put('/api/users/:id', (req, res) => {
    const editUser = req.body;
    const { id } = req.params;
    if(editUser.name && editUser.bio){
        Users.update(id, editUser)
            .then(user => {
                if(user){
                    res.status(200).json(user)
                } else {
                    res.status(404).json({ message: "The user with the specified ID does not exist." })
                }
            })
            .catch(err => {
                console.log(err)
                res.status(500).json({ errorMessage: "The user information could not be modified." })
            })
    } else {
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." })
    }
});

const port = 5000;
server.listen(port, () => console.log(`\n API is listening on port ${port} \n`))