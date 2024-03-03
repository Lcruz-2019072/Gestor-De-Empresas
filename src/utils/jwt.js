'use strict'

import jwt from 'jsonwebtoken'
const secretKey = '@LlaveSecreta@'

export const generateJwt = async(payload)=>{
    try {
        return jwt.sign(payload, secretKey, {
            expiresIn: '50h', 
            algorithm: 'HS256'
        })
    } catch (error) {
        console.error(error)   
        return error
    }
}