const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/', adminController.getIndex);

router.get('/inventory', adminController.getInventory);

router.post('/inventory', adminController.postInventory);

router.get('/add-product', adminController.getAddProduct);

router.post('/add-product', adminController.postAddProduct);

router.get('/delete-product', adminController.getDeleteProduct);

router.post('/delete-product', adminController.postDeleteProduct);

router.post('/edit-product', adminController.postEditProduct);

router.get('/edit-product', adminController.getEditProduct);

router.post('/product-details', adminController.postEditProduct);

router.get('/product-details', adminController.getProductDetails);

router.post('/order-details', adminController.postOrderUpdate);

router.get('/order-details', adminController.getOrderDetails);

router.post('/maps', adminController.postMap);

router.get('/maps', adminController.getMap);

router.post('/sell', adminController.postSell);

router.get('/sell', adminController.getSell);

router.post('/orders', adminController.postOrders);

router.get('/orders', adminController.getOrders);

module.exports = router;