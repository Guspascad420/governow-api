const express = require('express');
const editProfileRoutes = require('../routes/edit_profile.routes');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use(editProfileRoutes); 

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
