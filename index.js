const express = require('express');
const fs = require('fs');
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

const usersTable = require('./data/users.json');
const citiesTable = require('./data/cities.json');
const planesTable = require('./data/planes.json');

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - users
 *     responses:
 *       '200':
 *         description: Returns an array of users
 *       500:
 *         description: Error retrieving users
 */
app.get('/users', (req, res) => {
    res.json(usersTable);
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags:
 *       - users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Returns the user with the specified ID
 *       404:
 *         description: User not found
 */
app.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = usersTable.find(user => user.id === userId);
    if (user) {
        res.json(user);
    } else {
        res.status(404).send('User not found');
    }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags:
 *       - users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Error saving user data
 */
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

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags:
 *       - users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Error saving user data
 */
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

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags:
 *       - users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Error saving user data
 */
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

/**
 * @swagger
 * /cities:
 *   get:
 *     summary: Get all cities
 *     tags:
 *       - cities
 *     responses:
 *       200:
 *         description: Returns an array of cities
 *       500:
 *         description: Error retrieving cities
 */
app.get('/cities', (req, res) => {
    res.json(citiesTable);
});

/**
 * @swagger
 * /cities:
 *   post:
 *     summary: Create a new city
 *     tags:
 *       - cities
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       201:
 *         description: City created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Error saving city data
 */
app.post('/cities', (req, res) => {
    const newCity = req.body;
    if (!newCity.full_name || !newCity.abbreviation) {
        res.status(400).send('Missing required fields');
        return;
    }
    const newId = citiesTable.length + 1;
    newCity.id = newId;
    citiesTable.push({
        id: newCity.id,
        full_name: newCity.full_name,
        abbreviation: newCity.abbreviation
    });
    fs.writeFile('./data/cities.json', JSON.stringify(citiesTable), (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error saving city data');
        } else {
            res.status(201).send('City data saved successfully');
        }
    });
});


/**
 * @swagger
 * /cities/{id}:
 *   get:
 *     summary: Get a city by ID
 *     tags:
 *       - cities
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Returns the city with the specified ID
 *       404:
 *         description: City not found
 */
app.get('/cities/:id', (req, res) => {
    const cityId = parseInt(req.params.id);
    const city = citiesTable.find(city => city.id === cityId);
    if (city) {
        res.json(city);
    } else {
        res.status(404).send('City not found');
    }
});


/**
 * @swagger
 * /cities/{id}:
 *   put:
 *     summary: Update a city by ID
 *     tags:
 *       - cities
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/City'
 *     responses:
 *       200:
 *         description: City updated successfully
 *       404:
 *         description: City not found
 *       500:
 *         description: Error saving city data
 */
app.put('/cities/:id', (req, res) => {
    const cityId = parseInt(req.params.id);
    const updatedCity = req.body;
    const cityIndex = citiesTable.findIndex(city => city.id === cityId);
    if (cityIndex !== -1) {
        citiesTable[cityIndex] = {
            id: cityId,
            full_name: updatedCity.full_name,
            abbreviation: updatedCity.abbreviation
        };
        fs.writeFile('./data/cities.json', JSON.stringify(citiesTable), (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error saving city data');
            } else {
                res.status(200).send('City data updated successfully');
            }
        });
    } else {
        res.status(404).send('City not found');
    }
});

/**
 * @swagger
 * /cities/{id}:
 *   delete:
 *     summary: Delete a city by ID
 *     tags:
 *       - cities
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: City deleted successfully
 *       404:
 *         description: City not found
 *       500:
 *         description: Error saving city data
 */
app.delete('/cities/:id', (req, res) => {
    const cityId = parseInt(req.params.id);
    const cityIndex = citiesTable.findIndex(city => city.id === cityId);
    if (cityIndex !== -1) {
        citiesTable.splice(cityIndex, 1);
        fs.writeFile('./data/cities.json', JSON.stringify(citiesTable), (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error saving city data');
            } else {
                res.status(200).send('City deleted successfully');
            }
        });
    } else {
        res.status(404).send('City not found');
    }
});


/**
 * @swagger
 * /planes:
 *   get:
 *     summary: Get all planes
 *     tags:
 *       - planes
 *     responses:
 *       200:
 *         description: Returns an array of planes
 *       500:
 *         description: Error retrieving planes
 */
app.get('/planes', (req, res) => {
    res.json(planesTable);
});

/**
 * @swagger
 * /planes:
 *   post:
 *     summary: Create a new plane
 *     tags:
 *       - planes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Plane'
 *     responses:
 *       201:
 *         description: Plane created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Error saving plane data
 */
app.post('/planes', (req, res) => {
    const newPlane = req.body;
    if (!newPlane.capacity || !newPlane.IDFSCity) {
        res.status(400).send('Missing required fields');
        return;
    }
    const newId = planesTable.length + 1;
    newPlane.id = newId;
    planesTable.push(newPlane);
    fs.writeFile('./data/planes.json', JSON.stringify(planesTable), (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error saving plane data');
        } else {
            res.status(201).send('Plane data saved successfully');
        }
    });
});

/**
 * @swagger
 * /planes/{id}:
 *   get:
 *     summary: Get a plane by ID
 *     tags:
 *       - planes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Returns the plane with the specified ID
 *       404:
 *         description: Plane not found
 */
app.get('/planes/:id', (req, res) => {
    const planeId = parseInt(req.params.id);
    const plane = planesTable.find(plane => plane.id === planeId);
    if (plane) {
        res.json(plane);
    } else {
        res.status(404).send('Plane not found');
    }
});

/**
 * @swagger
 * /planes/{id}:
 *   put:
 *     summary: Update a plane by ID
 *     tags:
 *       - planes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Plane'
 *     responses:
 *       200:
 *         description: Plane updated successfully
 *       404:
 *         description: Plane not found
 *       500:
 *         description: Error saving plane data
 */
app.put('/planes/:id', (req, res) => {
    const planeId = parseInt(req.params.id);
    const updatedPlane = req.body;
    const planeIndex = planesTable.findIndex(plane => plane.id === planeId);
    if (planeIndex !== -1) {
        planesTable[planeIndex] = updatedPlane;
        fs.writeFile('./data/planes.json', JSON.stringify(planesTable), (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error saving plane data');
            } else {
                res.status(200).send('Plane data updated successfully');
            }
        });
    } else {
        res.status(404).send('Plane not found');
    }
});

/**
 * @swagger
 * /planes/{id}:
 *   delete:
 *     summary: Delete a plane by ID
 *     tags:
 *       - planes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Plane deleted successfully
 *       404:
 *         description: Plane not found
 *       500:
 *         description: Error saving plane data
 */
app.delete('/planes/:id', (req, res) => {
    const planeId = parseInt(req.params.id);
    const planeIndex = planesTable.findIndex(plane => plane.id === planeId);
    if (planeIndex !== -1) {
        planesTable.splice(planeIndex, 1);
        fs.writeFile('./data/planes.json', JSON.stringify(planesTable), (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error saving plane data');
            } else {
                res.status(200).send('Plane deleted successfully');
            }
        });
    } else {
        res.status(404).send('Plane not found');
    }
});






app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
