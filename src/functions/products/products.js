/* eslint-disable */
const fetch = require('node-fetch');

var fields = 'id,title,handle,body_html,images,options,variants,created_at,published_at'
var url = `https://practical-parts.myshopify.com/admin/api/${process.env.API_VERSION}/products.json?fields=${fields}`

exports.handler = async function(event, context) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${process.env.BASE_64_STRING}`
  };

  // get products by id if one is given
  const collectionId = event.queryStringParameters.collection_id
  if (collectionId) {
    url = url.concat(`&collection_id=${collectionId}`)
  }

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
