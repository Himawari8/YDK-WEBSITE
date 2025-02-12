const { name } = require("ejs");
const Product = require("../models/product");
const Order = require("../models/order");
const e = require("express");

exports.getIndex = (req, res, next) => {
    res.render('index');
};

exports.getMap = (req, res, next) => {
    res.render('maps');
};

exports.postMap = (req, res, next) => {
    const orderId = req.body.orderId; // Retrieve orderId from the form
    res.render('maps', { orderId: orderId }); // Pass orderId to the maps page
};

exports.getSell = (req, res, next) => {
    Product.fetchAllProducts()
        .then(products => {
            res.render('sell', {products});
        })
        .catch(e => {
            console.log(e);
        });
};

exports.postSell = (req, res, next) => {
    const selectedProducts = typeof req.body.selectedProducts === "string" 
    ? JSON.parse(req.body.selectedProducts) 
    : req.body.selectedProducts;
    const discounts = parseFloat(req.body.discounts) || 0;
    const totalQuantity = parseInt(req.body.totalQuantity) || 0;
    const orderTotalAmount = parseFloat(req.body.orderTotalAmount) || 0;
    const dateOfSale = req.body.dateOfSale;
    const deliveryMethod = req.body.deliveryMethod;
    const customerName = req.body.customerName;
    const address = deliveryMethod === "deliver" ? req.body.address : null;
    const contactNumber = deliveryMethod === "deliver" ? req.body.contactNumber : null;
    const paid = req.body.paid;
    const notes = req.body.notes ?? null;
    const status = null;

    newOrder = new Order(
        null,
        selectedProducts,
        discounts,
        totalQuantity,
        orderTotalAmount,
        dateOfSale,
        deliveryMethod,
        customerName,
        address,
        contactNumber,
        paid,
        notes,
        status
    );

    newOrder.save();
    const updateProduct = new Product();

    selectedProducts.map(product => {
        const prodId = product.productId;
        const orderQuantity = product.quantity;

        updateProduct.updateProductQuantity(prodId, orderQuantity)
        .then(results => {
            console.log("Update Success");
            res.redirect('/');
        })
        .catch(e => {
            console.log(e);
        });
    });
    console.log(req.body);
};

exports.getInventory = (req, res, next) => {
    Product.fetchAllProducts()
        .then(products => {
            res.render('inventory', {
                products
            })
        })
        .catch(error => {
            console.log(error);
        });
}

exports.postInventory = (req, res, next) => {
    console.log("Received body:", req.body); 
    if (!req.body) {
        return res.status(400).send("Request body is missing");
    }
    if (!req.body.testName) {
        return res.status(400).send("testName is missing");
    }

    const name = req.body.testName;
    res.render('inventory', { name: name });
};

exports.getAddProduct = (req, res, next) => {
    res.render('add-product', { product: null });
};
exports.postAddProduct = (req, res, next) => {
    const productId = req.body.productId ?? null;
    const productName = req.body.productName;
    const productCategory = req.body.productCategory;
    const productQuantity = req.body.productQuantity;
    const reorderLevel = req.body.reorderLevel;
    const supplier = req.body.supplier;
    const purchasePrice = req.body.purchasePrice;
    const sellingPrice = req.body.sellingPrice;
    const status = req.body.status;
    const productDescription = req.body.productDescription;

    const newProduct = new Product(
        productId,
        productName,
        productCategory,
        productQuantity,
        reorderLevel,
        supplier,
        purchasePrice,
        sellingPrice,
        status,
        productDescription
    );

    newProduct.save()
        .then(() => {
            console.log('Product saved successfully');
            res.redirect('/inventory');
        })
        .catch((error) => {
            console.error('Error saving product:', error);
            res.status(500).send('There was an error saving the product');
        });
};


exports.getDeleteProduct = (req, res, next) => {

};

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.prodId;  // Ensure this is accessed correctly
    console.log("Received prodId:", prodId);  // Log the prodId to ensure it's being received

    if (!prodId) {
        return res.status(400).send("Product ID is required");
    }

    Product.deleteByProdId(prodId)
        .then(() => {
            res.redirect('/inventory');
        })
        .catch((error) => {
            console.error('Error deleting product:', error);
            res.status(500).send('Error deleting product');
        });
};

exports.getEditProduct = (req, res, next) => {
    const prodId = req.body.prodId;  // Ensure this is accessed correctly
    console.log("Received prodId:", prodId);  // Log the prodId to ensure it's being received

    if (!prodId) {
        return res.status(400).send("Product ID is required");
    }

    Product.editByProdId(prodId)
        .then(() => {
            res.redirect('/');
        })
        .catch((error) => {
            console.error('Error deleting product:', error);
            res.status(500).send('Error deleting product');
        });
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.prodId;  // Ensure this is accessed correctly
    console.log("Received prodId:", prodId);  // Log the prodId to ensure it's being received

    if (!prodId) {
        return res.status(400).send("Product ID is required");
    }

    Product.editByProdId(prodId)
        .then((product) => {
            res.render('add-product', { product: product});
        })
        .catch((error) => {
            console.error('Error deleting product:', error);
            res.status(500).send('Error deleting product');
        });
};

exports.getProductDetails = (req, res) => {
    const prodId = req.query.prodId;
   Product.getProductById(prodId)
    .then(product => {
        res.render('product-details', { product }); // Render product details page
    })
    .catch((error) => {
        console.error('Error getting product details:', error);
        res.status(500).send('Error getting product details');
    });
};

exports.postProductDetails = (req, res, next) => {
    
};

exports.getOrders = (req, res, next) => {
    const getOrders = new Order();
    getOrders.fetchAllOrders()
        .then(orders => {
            res.render('orders', {
                orders
            })
        })
        .catch(error => {
            console.log(error);
        });
};

exports.postOrders = (req, res, next) => {

};

exports.postOrderUpdate = (req, res, next) => {
    const orderId = req.body.orderId;
    const paidStatus = req.body.paidStatus;
    const status = req.body.orderStatus;

    Order.updateOrder(orderId, paidStatus, status)
        .then(result => {
            res.redirect('orders');
        })
        .catch((error) => {
            console.error('Error getting order details:', error);
            res.status(500).send('Error getting order details');
        });
};

exports.getOrderDetails = (req, res, next) => {
    const orderId = req.query.orderId;
   Order.getOrderById(orderId)
    .then(order => {
        console.log(order);
        res.render('order-details', { order }); // Render product details page
    })
    .catch((error) => {
        console.error('Error getting order details:', error);
        res.status(500).send('Error getting order details');
    });
};


