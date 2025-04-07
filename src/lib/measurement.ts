import mongoose from 'mongoose';

const MeasurementSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId, // Changed from string to ObjectId
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    height: {
      feet: {
        type: Number,
        required: true,
        min: 1,
      },
      inches: {
        type: Number,
        required: true,
        min: 0,
        max: 11,
      },
    },
    weight: {
      type: Number,
      required: true,
      min: 1,
    },
    bodyType: {
      type: String,
      required: true,
      trim: true,
    },
    shirtMeasurements: {
      chest: {
        type: Number,
        required: true,
        min: 1,
      },
      waist: {
        type: Number,
        required: true,
        min: 1,
      },
      hips: {
        type: Number,
        required: true,
        min: 1,
      },
      neck: {
        type: Number,
        required: true,
        min: 1,
      },
      shoulders: {
        type: Number,
        required: true,
        min: 1,
      },
      sleeveLength: {
        type: Number,
        required: true,
        min: 1,
      },
      shirtLength: {
        type: Number,
        required: true,
        min: 1,
      },
      armhole: {
        type: Number,
        required: true,
        min: 1,
      },
      wrist: {
        type: Number,
        required: true,
        min: 1,
      },
    },
    trouserMeasurements: {
      inseam: {
        type: Number,
        required: true,
        min: 1,
      },
      thigh: {
        type: Number,
        required: true,
        min: 1,
      },
      calf: {
        type: Number,
        required: true,
        min: 1,
      },
      ankle: {
        type: Number,
        required: true,
        min: 1,
      },
      trouserLength: {
        type: Number,
        required: true,
        min: 1,
      },
      knee: {
        type: Number,
        required: true,
        min: 1,
      },
    },
    isSubmitted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Measurement || mongoose.model('Measurement', MeasurementSchema);
