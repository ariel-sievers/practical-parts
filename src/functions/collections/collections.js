/* eslint-disable */
const fetch = require('node-fetch');

var fields = 'id,title,handle,body_html,image,published_at'
var type = ''
var id = ''

exports.handler = async function(event, context) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Basic ${process.env.BASE_64_STRING}`
  };

  const typeParam = event.queryStringParameters.type
  if (typeParam) {
    type = typeParam.concat('_')
  }

  // get collection by id if one is given
  const idParam = event.queryStringParameters.id
  if (idParam) {
    id = id.concat(`/${idParam}`)
  }

  const url = `https://practical-parts.myshopify.com/admin/api/${process.env.API_VERSION}/${type}collections${id}.json?fields=${fields}`
  console.log(url)

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