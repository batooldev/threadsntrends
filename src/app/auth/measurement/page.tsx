"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [isNextEnabled, setIsNextEnabled] = useState(false);
  const initialFormData = {
    name: "",
    email: "",
    feet: "",
    inches: "",
    weight: "",
    bodyType: "",
    chest: "",
    waist: "",
    hips: "",
    neck: "",
    shoulders: "",
    sleeveLength: "",
    shirtLength: "",
    armhole: "",
    wrist: "",
    inseam: "",
    thigh: "",
    calf: "",
    ankle: "",
    trouserLength: "",
    knee: "",
  };
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Transform form data to match the Mongoose schema structure
    const transformedData = {
      // Assuming you have a way to get the userID
      userID: "64f5b3d7e330b9001af30c52", // Replace with actual user ID from your auth system
      name: formData.name,
      email: formData.email,
      height: {
        feet: parseInt(formData.feet),
        inches: parseInt(formData.inches)
      },
      weight: parseInt(formData.weight),
      bodyType: formData.bodyType,
      shirtMeasurements: {
        chest: parseInt(formData.chest),
        waist: parseInt(formData.waist),
        hips: parseInt(formData.hips),
        neck: parseInt(formData.neck),
        shoulders: parseInt(formData.shoulders),
        sleeveLength: parseInt(formData.sleeveLength),
        shirtLength: parseInt(formData.shirtLength),
        armhole: parseInt(formData.armhole),
        wrist: parseInt(formData.wrist)
      },
      trouserMeasurements: {
        inseam: parseInt(formData.inseam),
        thigh: parseInt(formData.thigh),
        calf: parseInt(formData.calf),
        ankle: parseInt(formData.ankle),
        trouserLength: parseInt(formData.trouserLength),
        knee: parseInt(formData.knee)
      },
      isSubmitted: true
    };

    console.log("Submitting transformed data:", transformedData);

    try {
      const response = await fetch('/api/measurement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
        return;
      }

      const data = await response.json();
      console.log('Form submitted successfully:', data);

      // Reset the form data
      setFormData(initialFormData);

      // Reset the step to the first step
      setStep(1);

      alert('Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred while submitting the form.');
    }
  };

  // Validate if all required fields in the current step are filled
  useEffect(() => {
    const validateStep = () => {
      if (step === 1) {
        setIsNextEnabled(
          !!(
            formData.name &&
            formData.email &&
            formData.feet &&
            formData.inches &&
            formData.weight &&
            formData.bodyType
          )
        );
      } else if (step === 2) {
        setIsNextEnabled(
          !!(
            formData.chest &&
            formData.waist &&
            formData.hips &&
            formData.neck &&
            formData.shoulders &&
            formData.sleeveLength &&
            formData.shirtLength &&
            formData.armhole &&
            formData.wrist
          )
        );
      } else if (step === 3) {
        setIsNextEnabled(
          !!(
            formData.inseam &&
            formData.thigh &&
            formData.calf &&
            formData.ankle &&
            formData.trouserLength &&
            formData.knee
          )
        );
      }
    };

    validateStep();
  }, [formData, step]);

  return (
    <div className="bg-rosy_pink min-h-screen opacity-95 flex items-center justify-center">
      <div className="max-w-lg mx-auto p-5 bg-white shadow-lg rounded-lg mt-6 mb-5">
        {step === 1 && (
          <form>
            <h2 className="text-xl font-bold">Step 1: Basic Info</h2>
            <label className="block">
              User Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                required
              />
            </label>

            <label className="block">
              Email:
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                required
              />
            </label>

            <label className="block">
              Height:
              <div className="flex gap-2">
                <input
                  type="number"
                  name="feet"
                  value={formData.feet}
                  onChange={handleChange}
                  placeholder="Feet"
                  className="border p-2 w-1/2 rounded"
                  required
                />
                <input
                  type="number"
                  name="inches"
                  value={formData.inches}
                  onChange={handleChange}
                  placeholder="Inches"
                  className="border p-2 w-1/2 rounded"
                  required
                />
              </div>
            </label>

            <label className="block">
              Weight (kg):
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="border p-2 w-full rounded"
                required
              />
            </label>

            <label className="block mb-4">
              Body Type:
              <div className="flex gap-2">
                <select
                  name="bodyType"
                  value={formData.bodyType}
                  onChange={handleChange}
                  className="border p-2 w-1/2 rounded"
                >
                  <option value="">Select Body Type</option>
                  <option value="slim">Slim</option>
                  <option value="toned">Toned</option>
                  <option value="average">Average</option>
                  <option value="curvy">Curvy</option>
                  <option value="broad">Broad</option>
                  <option value="petite">Petite</option>
                  <option value="muscular">Muscular</option>
                  <option value="plus-size">Plus-size</option>
                </select>
                <input
                  type="text"
                  name="bodyType"
                  value={formData.bodyType}
                  onChange={handleChange}
                  placeholder="Or write your own"
                  className="border p-2 w-1/2 rounded"
                />
              </div>
            </label>

            <Button
              onClick={nextStep}
              className={`p-2 rounded ${
                isNextEnabled
                  ? "bg-solid_brown text-white"
                  : "bg-solid_brown text-gray-700 cursor-not-allowed"
              }`}
              disabled={!isNextEnabled}
            >
              Next
            </Button>
          </form>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold">Step 2: Shirt Measurements</h2>
            <input
              type="text"
              name="chest"
              placeholder="Chest (cm)"
              value={formData.chest}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-2"
              required
            />
            <input
              type="text"
              name="waist"
              placeholder="Waist (cm)"
              value={formData.waist}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-2"
              required
            />
            <input
              type="text"
              name="hips"
              placeholder="Hips (cm)"
              value={formData.hips}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-2"
              required
            />
            <input
              type="text"
              name="neck"
              placeholder="Neck (cm)"
              value={formData.neck}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-2"
              required
            />
            <input
              type="text"
              name="shoulders"
              placeholder="Shoulders (cm)"
              value={formData.shoulders}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-2"
              required
            />
            <input
              type="text"
              name="sleeveLength"
              placeholder="Sleeve Length (cm)"
              value={formData.sleeveLength}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-2"
              required
            />
            <input
              type="text"
              name="shirtLength"
              placeholder="Shirt Length (cm)"
              value={formData.shirtLength}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-2"
              required
            />
            <input
              type="text"
              name="armhole"
              placeholder="Armhole (cm)"
              value={formData.armhole}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-2"
              required
            />
            <input
              type="text"
              name="wrist"
              placeholder="Wrist (cm)"
              value={formData.wrist}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-2"
              required
            />
            <div className="flex justify-between mt-3">
              <Button onClick={prevStep} className="bg-solid_brown text-white">
                Back
              </Button>
              <Button
                onClick={nextStep}
                className={`p-2 rounded ${
                  isNextEnabled
                    ? "bg-solid_brown text-white"
                    : "bg-solid_brown text-gray-700 cursor-not-allowed"
                }`}
                disabled={!isNextEnabled}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold">Step 3: Trouser Measurements</h2>
            <input
              type="text"
              name="inseam"
              placeholder="Inseam (cm)"
              value={formData.inseam}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-2"
              required
            />
            <input
              type="text"
              name="thigh"
              placeholder="Thigh (cm)"
              value={formData.thigh}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-2"
              required
            />
            <input
              type="text"
              name="calf"
              placeholder="Calf (cm)"
              value={formData.calf}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-2"
              required
            />
            <input
              type="text"
              name="ankle"
              placeholder="Ankle (cm)"
              value={formData.ankle}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-2"
              required
            />
            <input
              type="text"
              name="trouserLength"
              placeholder="Trouser Length (cm)"
              value={formData.trouserLength}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-2"
              required
            />
            <input
              type="text"
              name="knee"
              placeholder="Knee (cm)"
              value={formData.knee}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-2"
              required
            />
            <div className="flex justify-between mt-3">
              <Button onClick={prevStep} className="bg-solid_brown text-white">
                Back
              </Button>
              <Button
                onClick={nextStep}
                className={`p-2 rounded ${
                  isNextEnabled
                    ? "bg-solid_brown text-white"
                    : "bg-solid_brown text-gray-700 cursor-not-allowed"
                }`}
                disabled={!isNextEnabled}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-xl font-bold">Step 4: Review & Submit</h2>
            <div className="bg-gray-100 p-3 rounded">
              <p><strong>Name:</strong> {formData.name}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Height:</strong> {formData.feet} feet {formData.inches} inches</p>
              <p><strong>Weight:</strong> {formData.weight} kg</p>
              <p><strong>Body Type:</strong> {formData.bodyType}</p>
              <p><strong>Chest:</strong> {formData.chest} cm</p>
              <p><strong>Waist:</strong> {formData.waist} cm</p>
              <p><strong>Hips:</strong> {formData.hips} cm</p>
              <p><strong>Neck:</strong> {formData.neck} cm</p>
              <p><strong>Shoulders:</strong> {formData.shoulders} cm</p>
              <p><strong>Sleeve Length:</strong> {formData.sleeveLength} cm</p>
              <p><strong>Shirt Length:</strong> {formData.shirtLength} cm</p>
              <p><strong>Armhole:</strong> {formData.armhole} cm</p>
              <p><strong>Wrist:</strong> {formData.wrist} cm</p>
              <p><strong>Inseam:</strong> {formData.inseam} cm</p>
              <p><strong>Thigh:</strong> {formData.thigh} cm</p>
              <p><strong>Calf:</strong> {formData.calf} cm</p>
              <p><strong>Ankle:</strong> {formData.ankle} cm</p>
              <p><strong>Trouser Length:</strong> {formData.trouserLength} cm</p>
              <p><strong>Knee:</strong> {formData.knee} cm</p>
            </div>
            <div className="flex justify-between mt-3">
              <Button onClick={prevStep} className="bg-solid_brown text-white">
                Back
              </Button>
              <Button onClick={handleSubmit} className="bg-solid_brown text-white">
                Submit
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default MultiStepForm;