const { Product } = require('../../models')
const path = require('path');
const fs = require('fs');
const { generateSlug } = require('../../helpers/generateSlug')
const { v4: uuidv4 } = require('uuid');
const APP_URL = process.env.APP_URL;


  
  module.exports = { }