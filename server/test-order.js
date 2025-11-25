const axios = require('axios');

const testOrder = {
    customer: {
        firstName: "Test",
        lastName: "User",
        email: "test@test.com",
        address: "123 Test St",
        city: "Mumbai",
        zipCode: "400001",
        phone: "9999999999"
    },
    items: [
        {
            id: 1,
            name: "Natural Laundry Liquid",
            price: 499,
            quantity: 1,
            image: "/images/laundry-liquid.png",
            selectedSize: "1L",
            sizes: [{ size: "1L", price: 120 }]
        }
    ],
    total: 499,
    paymentMethod: "cod",
    date: new Date().toISOString()
};

console.log('Testing order endpoint...');
console.log('Sending:', JSON.stringify(testOrder, null, 2));

axios.post('http://localhost:5000/api/orders', testOrder)
    .then(response => {
        console.log('\n✅ SUCCESS!');
        console.log('Status:', response.status);
        console.log('Response:', response.data);
    })
    .catch(error => {
        console.log('\n❌ ERROR!');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Error:', error.response.data);
        } else {
            console.log('Error:', error.message);
        }
    });
