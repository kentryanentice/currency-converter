import express from 'express'
import { convert } from '../api/Converter.js'

const router = express.Router()

router.post('/convert', convert)

export default router