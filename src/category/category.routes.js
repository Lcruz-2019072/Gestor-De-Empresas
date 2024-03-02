import express from 'express'
import { createCategory, deleteCategory, getCategory, getAllCategories, test, updatedCategory } from './category.controller.js'
import { validateJwt } from '../middlewares/validate-jwt.js';


const api = express.Router()

api.get('/test', test)
api.post('/createCa', [validateJwt], createCategory)
api.put('/updateCa/:id', [validateJwt], updatedCategory)
api.delete('/deleteCa/:id', [validateJwt], deleteCategory)
api.get('/getAllCa', [validateJwt], getAllCategories)
api.get('/getCa', [validateJwt], getCategory)

export default api