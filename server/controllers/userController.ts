import { Request, Response } from 'express';
import User from '../models/user';
import bcrypt from 'bcrypt';

const login = async (req: Request, res: Response) => {
    const email = req.body.email
    const password = req.body.password
    const users = await User.find({email: email})
    if(users.length > 0){
        const user = users[0];
        bcrypt.compare(password, user.password, (err: Error | undefined, result: boolean) => {
            if(result){
                req.session.user = {
                    username: user.name,
                    user_id: user._id.toString()
                }
                res.json({
                    message: 'Login successful',
                    user: User,
                    user_session: req.session.user
                })
            } else {
                res.status(400).json({message: 'Invalid password'})
            }
        })
    } else {
        res.status(400).json({message: 'User not found'})
    }
}

const register = async (req: Request, res: Response) => {

    const emails = await User.find({email: req.body.email})
    if(emails.length > 0) {
        return res.status(400).json({message: 'Email already exists'})
    }

    
    if(req.body.password.length < 8){
        return res.status(400).json({message: 'Password must be at least 8 characters long'})
    }

    bcrypt.hash(req.body.password, 10, async (err: Error | undefined, hash: string) => {
        if(err) {
            return res.status(500).json({message: 'Error hashing password'})
        }
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hash
        })
        try {
            const newUser = await user.save()
            req.session.user = {
                username: user.name,
                user_id: user._id.toString()
            }
            console.log(req.session)
            res.json({
                message: 'User created',
                user: newUser,
                user_session: req.session.user
            })
        } catch (error){
            res.status(400).json({error: error})
        }
    }
)}

export default {
    login,
    register
}