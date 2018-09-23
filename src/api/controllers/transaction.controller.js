import Cloudinary from 'cloudinary'
const httpStatus = require('http-status')
const { omit } = require('lodash')
const Transacttion = require('../models/transaction.model')
const { handler: errorHandler } = require('../middlewares/error')
Cloudinary.config({
  cloud_name: 'soundit-africa',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

exports.get = (req, res) => res.json(req.locals.user.transform())

exports.create = async (req, res, next) => {
  try {
    const { body: fields, files } = ctx.request
    console.log(req.locals.user)
    const user = mongoose.Types.ObjectId(req.locals.user._id)
    if (files.length) {
      const imageUpload = files.map(async image => {
        const uploadImages = await Cloudinary.v2.uploader.upload(image.path, {
          secure: true,
          sign_url: true,
          type: 'authenticated'
        })
        return uploadImages.public_id
      })
      const payload = {
        ...fields,
        user,
        cardImages: imageUpload
      }
      console.log(payload)
      const transaction = new Transaction(payload)
      const savedTransaction = await transaction.save()
      res.status(httpStatus.CREATED)
      res.json(savedTransaction.transform())
    }
  } catch (error) {
    console.log(error)
    // next(Transacttion.checkDuplicateMobile(error));
  }
}
