//validar diferentes datos
'use strict'

import { hash, compare} from 'bcrypt'

export const encrypt = (password)=>{
    try {

        return hash(password, 10)

    } catch (error) {
        console.error(error)
        return error
    }

}

export const checkPassword = async(password, hash)=>{
    try{
        return await compare(password, hash)
    }catch(error) {
        console.error(error)
            return error
    }
}

export const checkUpdate = async(data, id)=>{
    if(id) {
        if(Object.entries(data).length === 0 ||
            data.password ||
            data.password == '') {
                return false
            } 
            return true         
        }else {
            if (Object.entries(data).length === 0 ||
                data.levelImpact ||
                data.levelImpact == '') {
                return false
            }
            return true
        }
    }