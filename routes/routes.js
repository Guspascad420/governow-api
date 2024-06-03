const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const db = require('../config/database')

const register = async (req, res) => {
    try {
        const { fullName, email, username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.collection('users').add({ fullName, email, username, password: hashedPassword })
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed', message: error.message });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const snapshot = await db.collection('users').where('email', '==', email).get()
        const user = snapshot.docs[0].data()
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
            expiresIn: '1h',
        });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed', message: error.message });
    }
}



module.exports = { register, login }