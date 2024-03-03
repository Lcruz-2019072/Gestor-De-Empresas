'use strict'

import express  from "express"
import { generateExcel,createCompany, getAllCompany, getCompanyToAZ, getCompanyCategory, getCompanyTime, getCompanyToZA, updatedCompany } from "./company.controller.js"
import {validateJwt} from '../middlewares/validate-jwt.js'

const api = express.Router()

api.post('/createCom', [validateJwt],createCompany)

api.put('/updateCom/:id', [validateJwt], updatedCompany)
api.get('/getAllCom', [validateJwt], getAllCompany)

api.get('/getComTime', [validateJwt], getCompanyTime)
api.get('/getComCategory/:id', [validateJwt], getCompanyCategory)

api.get('/getComAZ', [validateJwt], getCompanyToAZ)
api.get('/getComZA', [validateJwt], getCompanyToZA)

api.get('/getExcel', [validateJwt], generateExcel)


export default api
