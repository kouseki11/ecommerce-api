const { User } = require('../../models')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretKey = process.env.SECRET_KEY;
const { validationResult } = require('express-validator')

const register = async (req, res) => {
  // Retrieve the user's credentials from the request body
  const { name, username, email, phone_number, password } = req.body;

  // Validate the request body using Express Validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // Check if the email already exists
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Check if the phone number already exists
    const existingPhoneNumber = await User.findOne({ where: { phone_number } });
    if (existingPhoneNumber) {
      return res.status(409).json({ error: 'Phone number already exists' });
    }

    const defaultRole = 'user'

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      name,
      username,
      email,
      phone_number,
      password: hashedPassword,
      role: defaultRole,
    });

    res.status(201).json({
      status: 'ok',
      data: newUser,
    });
  } catch (error) {
    console.error('Failed to register user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};


const login = async (req, res) => {
  // Validate input
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Add role and user_id to the JWT payload
    const payload = {
      id: user.id,
      name: user.name,
      username: user.username,
      email,
      is_login: true,
      role: user.role, // Assuming user has a 'role' property
      addrees: user.address,
      phone_number: user.phone_number,
      photo_profile: user.photo_profile
    };

    // Generate a JWT
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

    // Set is_login to true and save it to the database
    user.is_login = true;
    await user.save();

    // Return the token to the client
    res.json({ token });
  } catch (error) {
    console.error('Failed to login user:', error);
    res.status(500).json({ error: 'Failed to login user' });
  }
};


const logout = async (req, res) => {
  try {
  
    const userId = req.user.id; // Assuming you have middleware to verify and extract user info from the token

    // Find the user by ID
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Invalidate the user's token by setting is_login to false
    user.is_login = false;
    await user.save();

    // Respond with a success message
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Failed to logout user:', error);
    res.status(500).json({ error: 'Failed to logout user' });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const data = await User.findAll({
      attributes: {
        exclude: ['password']
      },
       order: [['id', 'ASC']]
    })

    const result = {
       status: 'ok',
       data: data
    }
    
    res.status(200).json(result)
  } catch (error) {
    console.log(error, '<<< error get all users')
  }
}

module.exports = { register, login, logout, getAllUsers }