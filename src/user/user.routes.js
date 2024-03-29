import express from 'express'
import { test, register, login, updateU, deleteU, updatePassword } from './user.controller.js'
import { validateJwt } from '../middlewares/validate-jwt.js'

const api = express.Router();

api.get('/test', test)
api.post('/register', register)
api.post('/login', login)

api.put('/updatePassword',[validateJwt], updatePassword)
api.put('/updateUser', [validateJwt],updateU)
api.delete('/deleteUser', [validateJwt],deleteU)


export default api