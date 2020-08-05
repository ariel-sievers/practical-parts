/* eslint-disable */
const fetch = require('node-fetch');

const contactInfoFields  = 'customer_email,phone,shop_owner'
const addressFields = 'address1,address2,city,province,zip,country'

var fields = ''

exports.handler = async function(event, context) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${process.env.BASE_64_STRING}`
  };

  // get products by id if one is given
  const fieldType = event.queryStringParameters.collection_id
  if (fieldType === 'address') {
    fields = addressFields
  } else {
    fields = contactInfoFields
  }

  const url = `https://practical-parts.myshopify.com/admin/api/${process.env.API_VERSION}/shop.json?fields=${fields}`

  try {
    const response = await fetch(url, {
      headers: headers,
    })
    if (!response.ok) {
      // NOT res.status >= 200 && res.status < 300
      return { statusCode: response.status, body: response.statusText }
    }
    const data = await response.json()

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    }
  } catch (err) {
    console.log(err) // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify(err.message), // Could be a custom message or object i.e. JSON.stringify(err)
    }
  }
}

