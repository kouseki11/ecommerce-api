const router = require('express').Router();
const isAdmin = require('../../middleware/isAdmin')
const userOrganization = require('../../middleware/userOrganization')
const upload = require('../../utils/uploadProductsImages');
const { createProducts, getImageProducts, getAllProducts, getProductsBySlug, updateProducts, deleteProducts } = require('../../controllers/admin/productsController');

router.get('/',  getAllProducts)
router.post('/create', upload.array('productsImages', 3), userOrganization, isAdmin, createProducts);
router.get('/productsImages/:filename', getImageProducts)
router.get('/:slug', getProductsBySlug)
router.post('/update/:code_product', upload.array('productsImages', 3), userOrganization, isAdmin, updateProducts)
router.post('/delete/:code_product', userOrganization, isAdmin, deleteProducts)

module.exports = router;
