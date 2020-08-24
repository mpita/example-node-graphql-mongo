'use strict'

const { MongoClient } = require('mongodb')

/*
const {
    DB_USER,
    DB_PASSWD,
    DB_HOST,
    DB_PORT,
    DB_NAME
  } = process.env
*/
const {
  DB_USER,
  DB_PASSWD,
  DB_HOST,
  DB_PORT,
  DB_NAME
} = {
    DB_USER: false,
    DB_PASSWD: false,
    DB_HOST: 'localhost',
    DB_PORT: 27017,
    DB_NAME: 'platzi-cursos'
}

let mongoUrl
if (DB_USER) {
    mongoUrl = `mongodb://${DB_USER}:${DB_PASSWD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`
} else {
    mongoUrl = `mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`
}

let connection

async function connectDB () {
  if (connection) return connection

  let client
  try {
    client = await MongoClient.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    connection = client.db(DB_NAME)
  } catch (error) {
    console.error('Could not connect to db', mongoUrl, error)
    process.exit(1)
  }

  return connection
}

module.exports = connectDB
