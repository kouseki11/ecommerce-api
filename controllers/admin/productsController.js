const { Product } = require('../../models')
const path = require('path');
const fs = require('fs');
const { generateSlug } = require('../../helpers/generateSlug')
const { v4: uuidv4 } = require('uuid');
const APP_URL = process.env.APP_URL;

const getAllProducts = async (req, res) => {
  try {
    // Define pagination parameters
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const pageSize = 2; // Number of products per page

    // Calculate the offset based on the current page and page size
    const offset = (page - 1) * pageSize;

    // Retrieve products with pagination
    const products = await Product.findAll({
      order: [['id', 'ASC']],
      limit: pageSize,
      offset: offset,
    });

    const result = {
      status: 'ok',
      data: products.map((product) => ({
        id: product.id,
        user_id: product.user_id,
        category_id: product.category_id,
        name: product.name,
        code_product: product.code_product,
        slug: product.slug,
        price: product.price,
        stock: product.stock,
        description: product.description,
        detail: product.detail,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        productsImages: product.productsImages.split(',').map((image) => image.trim()),
      })),
    };

    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


  const getProductsBySlug = async (req, res) => {
    try {
      const { slug } = req.params;
  
      const product = await Product.findOne({ where: { slug: slug } });
      if (!product) { // Changed "data" to "product" in the if statement
        return res.status(404).json({
          status: 'failed',
          message: `Product with slug '${slug}' is not found`,
        });
      }
  
      res.status(200).json({
        status: 'ok',
        data: {
          id: product.id,
          user_id: product.user_id,
          category_id: product.category_id,
          name: product.name,
          code_product: product.code_product,
          slug: product.slug,
          price: product.price,
          stock: product.stock,
          description: product.description,
          detail: product.detail,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
          productsImages: product.productsImages.split(',').map(image => image.trim()),
        },
      });
    } catch (error) {
      console.log('Error getting product by slug:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to retrieve product by slug',
      });
    }
  };
  


const createProducts = async (req, res) => {
    const { category_id, name, price, stock, description, detail } = req.body;
  
    try {
      let productsImages = [];
  
      if (req.files) {
        req.files.forEach((file) => {
          const filePath = `products/productsImages/${file.filename}`;
          productsImages.push(filePath);
        });
      }
  
      const codeProduct = `P-${uuidv4()}`;
  
      const slug = generateSlug(name);
  
      const newProduct = await Product.create({
        user_id: req.user.id,
        category_id,
        name,
        code_product: codeProduct,
        price,
        stock,
        description,
        detail,
        productsImages: productsImages.join(','),
        slug,
      });
  
      res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  };


  const updateProducts = async (req, res) => {
    try {
      const { code_product } = req.params; // Use code_product instead of id
      const { name, price, stock, description, detail } = req.body;
  
      const product = await Product.findOne({
        where: {
          code_product: code_product, // Find the product by its code_product
        },
      });
  
      if (!product) {
        return res.status(404).json({
          status: 'failed',
          message: `Product with code_product '${code_product}' does not exist`,
        });
      }
  
      let productsImages = [];
  
      if (req.files) {
        req.files.forEach((file) => {
          const filePath = `products/productsImages/${file.filename}`;
          productsImages.push(`${filePath}`);
        });
        product.productsImages = productsImages.join(',')
      }
  
      product.name = name;
      product.price = price;
      product.stock = stock;
      product.description = description;
      product.detail = detail;
      product.updatedAt = new Date();
  
      await product.save();
  
      res.status(200).json({
        status: 'ok',
        data: product,
      });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({
        status: 'error',
        message: 'Failed to update product',
      });
    }
  };
  

const deleteProducts = async (req, res) => {
    try { 
      const { code_product } = req.params

      const product =  await Product.findOne({
        where: {
          code_product: code_product, // Find the product by its code_product
        },
      });
  

      if(!product) {
        return res.status(404).json({
            status: 'failed',
            message: `data product with code_product ${code_product} is not exists`
        })
      }

      product.destroy()

      const products = await Product.findAll({
        order: [['id', 'ASC']]
     })

      res.status(201).json({
        status: 'ok',
        message: `sucess delete product with code_product ${code_product}`,
        data: products.map(product => ({
            id: product.id,
            user_id: product.user_id,
            category_id: product.category_id,
            name: product.name,
            code_product: product.code_product,
            slug: product.slug,
            price: product.price,
            stock: product.stock,
            description: product.description,
            detail: product.detail,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
            productsImages: product.productsImages.split(',').map(image => image.trim()),
          })),
      })
    } catch (error) {
        console.log(error, '<<< error delete product')
    }
}

const getImageProducts = (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(process.cwd(), 'public', 'productsImages', filename);

  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).json({ error: 'Image not found' });
  }
}


module.exports = { createProducts, getAllProducts,  getProductsBySlug, updateProducts, deleteProducts, getImageProducts }