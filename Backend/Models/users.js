import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: null },

    age: {
      type: Number,
      min: [13, 'Must be at least 13 years old'],
      max: [120, 'Age must be realistic'],
      required: true,
    },
    gender: {
      type: String,
      enum: {
        values: ['Male', 'Female', 'Other'],
        message: 'Gender must be Male, Female, or Other',
      },
      required: true,
    },
    height: {
      type: Number,
      min: [100, 'Height must be at least 100 cm'],
      max: [250, 'Height must be less than 250 cm'],
      required: true,
    },
    weight: {
      type: Number,
      min: [30, 'Weight must be at least 30 kg'],
      required: true,
    },

    fitnessGoals: {
      type: [String],
      enum: {
        values: ['Weight Loss', 'Muscle Gain', 'Endurance', 'Flexibility', 'General Health'],
        message: 'Invalid fitness goal',
      },
      default: ['General Health'],
    },
    fitnessLevel: {
      type: String,
      enum: {
        values: ['Beginner', 'Intermediate', 'Advanced'],
        message: 'Fitness level must be Beginner, Intermediate, or Advanced',
      },
      default: 'Beginner',
    },
   // OTP fields
    otp: { type: String, default: null },
    otpExpiresAt: { type: Date, default: null },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true, // ✅ Correct place for timestamps
  }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
