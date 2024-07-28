const faker = require('faker')

faker.seed(123)

const products =  [...Array(80)].map((_) => ({
    productName : faker.commerce.productName(),
}))

module.exports= {products}