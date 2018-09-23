import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema(
  {
    cardType: {
      type: String,
      enum: ['ITUNES', 'AMAZON', 'STEAM'],
      required: true
    },
    totalAmount: { type: String, required: true, trim: true },
    cardImages: { type: Array, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    status: {
      type: String,
      enum: ['VERIFYING', 'SUCCESS', 'CAUTION'],
      required: true
    }
  },
  {
    timestamps: true
  }
)

/**
 * Methods
 */
transactionSchema.method({
  transform() {
    const transformed = {}
    const fields = [
      'id',
      'user',
      'status',
      'totalAmount',
      'cardImages',
      'cardType',
      'createdAt'
    ]

    fields.forEach(field => {
      transformed[field] = this[field]
    })

    return transformed
  }
})

module.exports = mongoose.model('Transaction', transactionSchema)
