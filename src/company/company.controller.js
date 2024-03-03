'use strict'

import Company from "./company.model.js"
import Excel from 'exceljs'
import {checkUpdateCompany} from '../utils/validator.js'

export const createCompany = async (req, res) => {
    try {
        let data = req.body
        let company = new Company(data)
        await company.save()
        return res.send({ message: `Company: ${company.Company} created succesfully` })
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Company has not been saved' })
    }
}

export const getCompanyCategory = async (req, res) => {
    try {
        let { id } = req.params
        let company = await Company.find({category: id}).populate('category', ['nameCategory'])
        if (!company) return res.status(404).send({message: 'Companies of category not exist'});
        return res.send({company});
    } catch (error) {
        console.error(error);
        return res.status(500).send({message: 'Companies with this category have not been found', error: error});
    }
}

export const getCompanyToAZ = async (req, res) => {
    try {
        let companyAZ = await Company.find().sort({Company: +1}).populate('category', ['nameCategory'])
        return res.send({companyAZ});
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Not found companies A-Z' });
    }
}

export const getCompanyToZA = async (req, res) => {
    try {
        let company = await Company.find().sort({Company: -1}).populate('category', ['nameCategory'])
        return res.send({company})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: ' Not found companies Z-A'})
    }

}

export const getAllCompany = async (req, res) => {
    try {
        let companies = await Company.find().populate('category', ['nameCategory'])
        return res.send({companies})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'companies not found'})
    }
}

export const updatedCompany = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        let update = await checkUpdateCompany(data, id)
        if(!update) return res.status(400).send({message: 'Data not updateable'})
        let updatedCompany = await Company.findOneAndUpdate(
            {_id: id},
            data,
            {new: true}
        )
        if(!updatedCompany) return res.status(404).send({message: 'Company not updated because and nor found'})
        return res.send({message: `Company ${updatedCompany.Company} has been updated`})
    } catch (err) {
        console.error(err)
        return res.status(500).send({message: 'Company has not been updated'})
    }
}


export const getCompanyTime = async (req, res) => {
    try {
        let data = req.body
        let companyYears = await Company.find({Years: data.Years}).populate('category', ['nameCategory'])
        return res.send({companyYears})
    } catch (error) {
        console.error(error)
        return res.status(500).send({message: 'Companies not found'})
    }
}

export const generateExcel = async (req, res) => {
    try {
        let companies = await Company.find().populate('category', ['nameCategory', 'description']);
        let libro = new Excel.Workbook();
        let worksheet = libro.addWorksheet('Companies');




        worksheet.columns = [
            { header: 'NameCategory', key: 'Company' },
            { header: 'Category', key: 'nameCategory'},
            { header: 'Impact', key: 'Impact'},
            { header: 'Description', key: 'description'}
        ];

        companies.forEach(company => {
            worksheet.addRow({
                Company: company.Company,
                nameCategory: company.category.nameCategory, 
                Impact: company.Impact,
                description: company.category.description 
            }).eachCell((cell) => {
                cell.alignment = { vertical: 'middle', horizontal: 'center' }; // Alinear texto al centro vertical y horizontalmente
      
            });
        });

        let filePath = 'company.xlsx';
        await libro.xlsx.writeFile(filePath);
        res.attachment(filePath);
        res.send();
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error generating Excel', error: error });
    }
}