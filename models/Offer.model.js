const { Date } = require('mongoose');
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const offerSchema = Schema({
  creatorId: {type: Schema.Types.ObjectId, ref: 'User'},
  authorId: {type: Schema.Types.ObjectId, ref: 'User'},
  postId: {type: Schema.Types.ObjectId, ref: 'Post'},
  goodToExchange: String,
  pointsEstimate: String,
  messages: String,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'refused'],
    default: 'pending'
  }
},
{
  timestamps: true,
}
);

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;
