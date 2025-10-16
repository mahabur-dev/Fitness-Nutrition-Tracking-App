const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, unique: true },
    lastName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: null,},
    age: {
      type: Number,
      min: [13, 'Must be at least 13 years old'],
      max: [120, 'Age must be realistic'],
    },
    gender: {
      type: String,
      enum: {
        values: ['Male', 'Female', 'Other'],
        message: 'Gender must be Male, Female, or Other',
      },
    },
    height: {
      // in cm
      type: Number,
      min: [100, 'Height must be at least 100 cm'],
      max: [250, 'Height must be less than 250 cm'],
    },
    weight: {
      // in kg (current weight)
      type: Number,
      min: [30, 'Weight must be at least 30 kg'],
    },

    // Fitness Information
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
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
module.exports.userSchema = userSchema;