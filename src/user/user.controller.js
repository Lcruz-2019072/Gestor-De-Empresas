'use strict'

import User from './user.model.js'
import { generateJwt } from '../utils/jwt.js'
import { encrypt, checkPassword, checkUpdate } from '../utils/validator.js'

export const test = (req, res)=>{
    console.log('test is running')
    return res.send({message: 'Test is okay :D'})
}

export const register = async(req,res) =>{
    try{
        
        let data = req.body
        console.log(data)
        data.password = await encrypt(data.password)
        let user = User(data)
        await user.save()
        return res.send({message: `Registered succesfully, You can login now ${user.username}`})
    }catch(error){
        console.error(error)
        if(error.keyValue.username) return res.status(400).send({message: `username ${error.keyValue.username} is exist`})
        return res.status(500).send({message: 'Error to register the user', error: error})
        
        
    }
}

export const login = async (req, res)=> {
    try {
        let data = req.body
        let loginUser = await User.findOne({
            $or:[
                {
                    username: data.username
                },
                {
                    email: data.email
                }
            ]
        })
        if(!loginUser) return res.status(404).send({message: 'username or email is not the correct'})

        if(loginUser){
            if(await checkPassword(data.password, loginUser.password)){
                let userLogged = {
                    uid: loginUser._id,
                    username: loginUser.username,
                    name: loginUser.name
                }
                let token = await generateJwt(userLogged)
                return res.send({message: `Welcome ${userLogged.name}`, userLogged, token})
            }
        }
    } catch(error){
        console.error(error)
            return res.send(500).send({message:'Error the user cant login', error: error})
    }
}

export const updateU = async(req, res)=>{
    try {
        let data = req.body
        data._id = req.user._id

        let updateUser =  await checkUpdate(data, data._id)
        if(!updateUser) return res.status(400).send({message: 'Have submitted some data that cannot be update'})
        let updateU = await User.findOneAndUpdate(
            { _id: data._id },
            data,
            {new: true} 
        )
        if (!updateU) return res.status(401).send({ message: 'user not found' })
        return res.send({ message: 'user update', updateU })

        
    } catch (error) {
        console.error(error)
        if(error.keyValue.username) return res.status(400).send({message: `username ${error.keyValue.username} is alredy taken ` })
        return res.status(500).send({ message: 'Error updating' })
    }

}

    export const deleteU = async (req, res)=>{
        try{
            let data = req.body
            data._id = req.user._id
            let deleteUser = await User.findOneAndDelete({_id: data._id})
            if(!deleteUser) return res.status(404).send({message: 'User not found , check your data'})
                return res.send({message: `User ${deleteUser.username} deleted successfully`})
        }catch(error) {
            console.error(error)
            return res.status(500).send({message: 'Errot to delete the usear'})
        }
    }

    export const updatePassword = async(req, res)=>{
        try {
            let data = req.body
            data._id = req.user._id
    
            if (data.password) {
                let user = await User.findById(data._id);
                if (!user) return res.status(401).send({ message: 'User not found' })
        
                let currentPassword = await checkPassword(data.password, user.password)
                if (!currentPassword) {
                    return res.status(400).send({ message: 'The password is not correct' })
                }else{
                    data.password = await encrypt(data.newPassword)
                }
            }
            let update =  await checkUpdatePassword(data, data._id)
            if(!update) return res.status(400).send({message: 'Have submitted some data that cannot be Update password'})
            let updateUser = await User.findOneAndUpdate(
                { _id: data._id },
                data,
                {new: true} 
            )
            if (!updateUser) return res.status(401).send({ message: 'user not found' })
            return res.send({ message: 'Update password', updateUser })
        } catch (error) {
            console.error(error)
            return res.status(500).send({ message: 'Error Update password' })
        }
    
    }
