const { database } = require('../util/firebase');

class Order {
    constructor( 
        orderId,
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
    ) {
        this.orderId = orderId;
        // Parse selectedProducts if it's a string
        this.selectedProducts = typeof selectedProducts === "string" ? JSON.parse(selectedProducts) : selectedProducts;

        this.discounts = parseFloat(discounts) || 0;
        this.totalQuantity = parseInt(totalQuantity) || 0;
        this.orderTotalAmount = parseFloat(orderTotalAmount) || 0;
        this.dateOfSale = dateOfSale;
        this.deliveryMethod = deliveryMethod;
        this.customerName = customerName;
        this.address = deliveryMethod === "deliver" ? address : "null";
        this.contactNumber = deliveryMethod === "deliver" ? contactNumber : "null";
        this.paid = paid;
        this.notes = notes || null;
        this.status = status || "pending"; // Default to "pending" if not provided
    }

    save() {
        const newOrderRef = database.ref('orders').push();
    
        return newOrderRef.set({
            orderId: newOrderRef.key, // Store the generated order ID
            selectedProducts: this.selectedProducts, // Save the entire array of products
            discounts: this.discounts,
            totalQuantity: this.totalQuantity,
            orderTotalAmount: this.orderTotalAmount,
            dateOfSale: this.dateOfSale,
            deliveryMethod: this.deliveryMethod,
            customerName: this.customerName,
            address: this.address,
            contactNumber: this.contactNumber,
            paid: this.paid,
            notes: this.notes,
            status: this.status
        })
        .then(() => {
            console.log("Order saved successfully!");
            return newOrderRef.key; // Return the new order ID if needed
        })
        .catch(error => {
            console.error("Error saving order:", error);
            throw error;
        });
    }

    fetchAllOrders() {
        const ref = database.ref('orders');
        
        return ref.once('value')
            .then(snapshot => {
                const orders = [];
                snapshot.forEach(childSnapshot => {
                    const order = childSnapshot.val();  // Get the product data
                    orders.push(order);  // Push each product into the products array
                });
                return orders;  // Return the array of products
            })
            .catch(error => {
                console.error("Error fetching products:", error);
                throw error;  // Rethrow error to be handled elsewhere
            });
    }
    static getOrderById(orderId) {
        const ref = database.ref('orders').orderByChild('orderId').equalTo(orderId);
    
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
                console.error("Error fetching order:", error);
                throw error;
            });
    }
    
}

module.exports = Order;
