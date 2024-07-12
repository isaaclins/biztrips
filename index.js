const express = require('express');
const fs = require('fs');
const usersTable = require('./data/users.json');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();
app.use(express.json()); 
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: "Edelflies API",
            version: '1.0.0',
            description: 'Edelfliest API for Biztrip',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./index.js'],
};
const swaggerSpec = swaggerJsdoc(options);
app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerSpec));






app.get('/users', (req, res) => {
    res.json(usersTable);
});
app.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = usersTable.find(user => user.id === userId);
    if (user) {
        res.json(user);
    } else {
        res.status(404).send('User not found');
    }
});



app.post('/users', (req, res) => {
    const newUser = req.body;
    if (!newUser.first_name || !newUser.last_name || !newUser.email || !newUser.password) {
        res.status(400).send('Missing required fields');
        return;
    }
    const newId = usersTable.length + 1;
    newUser.id = newId;
    usersTable.push({
        id: newUser.id,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        password: newUser.password
    });
    fs.writeFile('./data/users.json', JSON.stringify(usersTable), (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error saving user data');
        } else {
            res.status(201).send('User data saved successfully');
        }
    });
});

app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const updatedUser = req.body;
    const userIndex = usersTable.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        usersTable[userIndex] = {
            id: userId,
            first_name: updatedUser.first_name,
            last_name: updatedUser.last_name,
            email: updatedUser.email,
            password: updatedUser.password
        };
        fs.writeFile('./data/users.json', JSON.stringify(usersTable), (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error saving user data');
            } else {
                res.status(200).send('User data updated successfully');
            }
        });
    } else {
        res.status(404).send('User not found');
    }
});

app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = usersTable.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        usersTable.splice(userIndex, 1);
        fs.writeFile('./data/users.json', JSON.stringify(usersTable), (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error saving user data');
            } else {
                res.status(200).send('User deleted successfully');
            }
        });
    } else {
        res.status(404).send('User not found');
    }
});
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
