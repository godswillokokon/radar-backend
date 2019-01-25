import mongoose from 'mongoose'
import Cloudinary from 'cloudinary'
import httpStatus from 'http-status'
import { omit } from 'lodash'
const APIError = require('../utils/APIError')
const Transaction = require('../models/transaction.model')
const { handler: errorHandler } = require('../middlewares/error')

Cloudinary.config({
  cloud_name: 'soundit-africa',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

exports.get = (req, res) => res.json(req.locals.user.transform())

exports.create = async (req, res, next) => {
  console.log(req.body, '---');
  try {
    const { body: fields, files } = req
    const user = mongoose.Types.ObjectId(req.locals.user._id)
    if (files.length) {
      const imageUpload = await Promise.all(
        files.map(async image => {
          const uploadImages = await Cloudinary.v2.uploader.upload(image.path, {
            secure: true,
            sign_url: true,
            type: 'authenticated'
          })
          return uploadImages.public_id
        })
      )
      const payload = {
        ...fields,
        user,
        cardImages: imageUpload
      }
      const transaction = new Transaction(payload)
      const savedTransaction = await transaction.save()
      res.status(httpStatus.CREATED)
      res.json(savedTransaction.transform())
    }
  } catch (error) {
    return next(error);
  }
}
