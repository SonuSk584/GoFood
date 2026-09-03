const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false   // ← excluded from query results by default, so
                     //    User.findOne({email}) etc. never returns the
                     //    bcrypt hash unless explicitly requested with
                     //    .select("+password") — which login already
                     //    needs, see note below.
  },
  role: {
    type: String,
    default: "user"
  },
  location: [
    {
      lat: Number,
      lng: Number,
      address: String
    }
  ],
  isVerified: {
    type: Boolean,
    default: false
  },
  verifyToken: {
    type: String,
    index: true   // login/verify both query by this field — index keeps
                   // that lookup fast as your user count grows
  },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);