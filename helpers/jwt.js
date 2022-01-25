const expressJwt = require('express-jwt');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const authJwt = () => {
    const secret = process.env.JWT_SECRET;
    const api = process.env.API_URL
    return expressJwt({
        secret: secret,
        algorithms:['HS256'],
        isRevoked:isRevoked
    }).unless({
        path:[
            {url:/\/public\/uploads(.*)/, methods:['GET', 'OPTIONS']},
            {url:/\/api\/v1\/products(.*)/, methods:['GET', 'OPTIONS']},
            {url:/\/api\/v1\/categories(.*)/, methods:['GET', 'OPTIONS']},
            {url:/\/api\/v1\/orders(.*)/, methods:['POST', 'OPTIONS']},

            `${api}/login`,
            `${api}/register`
            // {url: /(.*)/}
        ]
    })
}

const isRevoked = async (err, payload, done) => {
    if(!payload.isAdmin){
        done(null, true)
    }

    done()
}

module.exports = authJwt;