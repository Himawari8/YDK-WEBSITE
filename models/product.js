const { database } = require('../util/firebase');

class Product {
    constructor(prodId, name, category, quantity, reorderLevel, supplier, purchasePrice, sellingPrice, status, description) {
        this.prodId = prodId;  // Product ID
        this.name = name;  // Product Name
        this.category = category;  // Product Category
        this.quantity = quantity;  // Quantity in stock
        this.reorderLevel = reorderLevel;  // Minimum quantity before reorder
        this.supplier = supplier;  // Supplier information
        this.purchasePrice = purchasePrice;  // Cost price
        this.sellingPrice = sellingPrice;  // Selling price
        this.status = status;  // Product status (e.g., Available, Out of Stock)
        this.description = description;  // Product description
    }


    save() {
        const ref = database.ref('products');
        
        if (this.prodId) {
            const existingProductRef = ref.child(this.prodId);
    
            console.log("Updating Product:", this);
    
            if (!this.name || !this.category || !this.quantity || !this.reorderLevel || !this.supplier || !this.purchasePrice || !this.sellingPrice || !this.status || !this.description) {
                console.error("Error: Product contains undefined values", this);
                return Promise.reject("Product data contains undefined values");
            }
    
            return existingProductRef.update(this)
            .then(() => {
                console.log("Product updated successfully with ID:", this.prodId);
            })
            .catch((error) => {
                console.error("Error updating product:", error);
            });
        } else {
            const newProductRef = ref.push();
            this.prodId = newProductRef.key;
    
            console.log("Saving New Product:", this);
    
            if (!this.name || !this.category || !this.quantity || !this.reorderLevel || !this.supplier || !this.purchasePrice || !this.sellingPrice || !this.status || !this.description) {
                console.error("Error: Product contains undefined values", this);
                return Promise.reject("Product data contains undefined values");
            }
            
            return newProductRef.set(this)
            .then(() => {
                console.log("Product saved successfully with ID:", this.prodId);
            })
            .catch((error) => {
                console.error("Error saving product:", error);
            });
        }
    }
    
    
    static fetchAllProducts() {
        const ref = database.ref('products');
        
        return ref.once('value')
            .then(snapshot => {
                const products = [];
                snapshot.forEach(childSnapshot => {
                    const product = childSnapshot.val();  // Get the product data
                    products.push(product);  // Push each product into the products array
                });
                return products;  // Return the array of products
            })
            .catch(error => {
                console.error("Error fetching products:", error);
                throw error;  // Rethrow error to be handled elsewhere
            });
    }

    static deleteByProdId(prodId) {
        const ref = database.ref('products');
        console.log("Deleting product with prodId:", prodId);  // Log the prodId before the deletion
    
        return ref.once('value')
            .then(snapshot => {
                let productFound = false;
    
                snapshot.forEach(childSnapshot => {
                    const product = childSnapshot.val();
                    console.log("Checking product:", product);  // Log the product being checked
    
                    if (product.prodId === prodId) {
                        productFound = true;
                        const productRef = ref.child(childSnapshot.key);
                        return productRef.remove();
                    }
                });
    
                if (!productFound) {
                    throw new Error(`Product with prodId ${prodId} not found.`);
                }
    
                console.log(`Product with prodId ${prodId} deleted successfully.`);
            })
            .catch(error => {
                console.error("Error deleting product:", error);
                throw error;
            });
    }

    static editByProdId(prodId) {
        const ref = database.ref('products');
        console.log("Editing product with prodId:", prodId);  // Log the prodId before the operation
    
        return ref.once('value')
            .then(snapshot => {
                // Use find() to find the product that matches the prodId
                const product = snapshot.val() && Object.values(snapshot.val()).find(product => product.prodId === prodId);
    
                if (product) {
                    console.log(product);
                    return product;  // Return the product if found
                } else {
                    throw new Error(`Product with prodId ${prodId} not found.`);  // Handle case where product is not found
                }
            })
            .catch(error => {
                console.error("Error editing product:", error);
                throw error;
            });
    }

    static getProductById(prodId) {
        const ref = database.ref('products').orderByChild('prodId').equalTo(prodId);
    
        return ref.once('value')
            .then(snapshot => {
                if (!snapshot.exists()) {
                    return null; // No product found
                }
                
                let product = null;
                snapshot.forEach(childSnapshot => {
                    product = childSnapshot.val(); // Get the first match
                });
    
                return product;
            })
            .catch(error => {
                console.error("Error fetching product:", error);
                throw error;
            });
    }

    updateProductQuantity(prodId, newQuantity) {
        const ref = database.ref('products').orderByChild('prodId').equalTo(prodId);
    
        return ref.once('value')
            .then(snapshot => {
                if (!snapshot.exists()) {
                    console.log(`Product with ID ${prodId} not found.`);
                    return; // Stop execution if product does not exist
                }
    
                snapshot.forEach(childSnapshot => {
                    let oldQuantity = childSnapshot.val().quantity;
                    let updatedQuantity = Math.max(0, oldQuantity - newQuantity);
    
                    // Update product quantity without returning
                    childSnapshot.ref.update({ quantity: updatedQuantity })
                        .then(() => console.log(`Updated product ${prodId}: ${updatedQuantity}`))
                        .catch(error => console.error("Error updating product:", error));
                });
            })
            .catch(error => {
                console.error("Error fetching product:", error);
            });
    }
    
    
}

module.exports = Product;
