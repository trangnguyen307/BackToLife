const { Date } = require('mongoose');
const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const PostSchema = Schema({
  title: String,
  creatorId: {type: Schema.Types.ObjectId, ref: 'User'},
  description: String,
  picURL: String,
  pointsEstimate: String,
  city: String,
  categories: { type: String, enum: ['Dressing', 'Books/CDs', 'Services', 'Beauty', 'IT'] },
  type: { type: String, enum: ['good', 'service'] },
},
{
  timestamps: new Date(),
}
);

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;