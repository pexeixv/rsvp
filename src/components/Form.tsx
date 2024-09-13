import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Minus, Plus, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import SHA256 from "crypto-js/sha256";

const correctPasswordHash = import.meta.env.VITE_FORM_PASSWORD;

interface FormInputs {
  email: string;
  password: string;
  name: string;
  veg: number;
  nonVeg: number;
}

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .test(
      "password-match",
      "Password incorrect!",
      (value) => SHA256(value).toString() === correctPasswordHash
    ),
  name: Yup.string().required("Name is required"),
  veg: Yup.number()
    .min(0, "Must be greater than or equal to 0")
    .required("Vegetarian count is required"),
  nonVeg: Yup.number()
    .min(0, "Must be greater than or equal to 0")
    .required("Non-Vegetarian count is required"),
});

function Form() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormInputs>({ resolver: yupResolver(validationSchema) });

  const [customError, setCustomError] = useState("");
  const [veg, setVeg] = useState(0);
  const [nonVeg, setNonVeg] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setValue("veg", veg);
  }, [veg, setValue]);

  useEffect(() => {
    setValue("nonVeg", nonVeg);
  }, [nonVeg, setValue]);

  const incrementVeg = () => {
    setCustomError("");
    setVeg(veg + 1);
  };

  const decrementVeg = () => {
    setCustomError("");
    setVeg(veg > 0 ? veg - 1 : 0);
  };

  const incrementNonVeg = () => {
    setCustomError("");
    setNonVeg(nonVeg + 1);
  };

  const decrementNonVeg = () => {
    setCustomError("");
    setNonVeg(nonVeg > 0 ? nonVeg - 1 : 0);
  };

  const handleFormSubmission = async (form: FormInputs) => {
    // Check if both vegetarian and non-vegetarian counts are zero
    if (form.veg === 0 && form.nonVeg === 0) {
      setCustomError(
        "There should be at least one Vegetarian or Non-vegetarian guest."
      );
      return;
    }

    setIsLoading(true); // Set loading state to true while processing

    try {
      // Make the POST request to the serverless function
      const response = await fetch(
        "/.netlify/functions/firebase-form-handler",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form), // Send form data in the request body
        }
      );

      // Check if the response was successful
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit form");
      }

      // If successful, show a success alert and reset the form
      alert("Form submitted successfully");
      reset(); // Reset form fields
      setVeg(0); // Reset veg count
      setNonVeg(0); // Reset non-veg count
    } catch (error) {
      // Handle errors and show appropriate alert message
      alert(`Error submitting form: ${error.message}`);
    } finally {
      setIsLoading(false); // Stop loading state once the process is done
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmission)}
      id="rsvpForm"
      className="w-full max-w-2xl p-8 bg-white border-2 rounded-lg form-control border-sky-200/50"
    >
      <h2 className="text-2xl font-bold lg:text-3xl">RSVP here</h2>
      <div className="grid gap-8 mt-4">
        <div>
          <Label className="font-bold label" htmlFor="name">
            Name
          </Label>
          <Input
            className="w-full mt-2 input input-primary"
            type="text"
            id="name"
            {...register("name")}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>
        <div>
          <Label className="font-bold label" htmlFor="email">
            Email
          </Label>
          <Input
            className="w-full mt-2 input input-primary"
            type="email"
            id="email"
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        <div>
          <Label className="font-bold label" htmlFor="password">
            Password
          </Label>
          <Input
            className="w-full mt-2 input input-primary"
            type="text"
            id="password"
            {...register("password")}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8 mt-8">
        <div>
          <Label className="block font-bold label" htmlFor="veg">
            Vegetarian guests
          </Label>
          <div
            className="inline-block px-3 py-2 mt-4 border rounded-lg border-sky-200 bg-sky-50"
            data-hs-input-number=""
          >
            <div className="flex items-center gap-x-1.5">
              <button
                type="button"
                className="inline-flex items-center justify-center text-sm font-medium text-gray-800 transition-all duration-300 border rounded-md shadow-sm bg-sky-200 border-sky-100 size-6 gap-x-2 hover:bg-sky-300 disabled:opacity-50 disabled:pointer-events-none"
                onClick={decrementVeg}
              >
                <Minus className="flex-shrink-0 size-3.5" />
              </button>
              <Input
                className="w-6 p-0 text-center text-gray-800 bg-transparent border-0 focus:ring-0"
                type="text"
                data-hs-input-number-input=""
                id="veg"
                {...register("veg")}
                value={veg}
                readOnly
              />
              <button
                type="button"
                className="inline-flex items-center justify-center text-sm font-medium text-gray-800 transition-all duration-300 border rounded-md shadow-sm bg-sky-200 border-sky-100 size-6 gap-x-2 hover:bg-sky-300 disabled:opacity-50 disabled:pointer-events-none"
                onClick={incrementVeg}
              >
                <Plus className="flex-shrink-0 size-3.5" />
              </button>
            </div>
          </div>
          {errors.veg && (
            <p className="mt-1 text-sm text-red-600">{errors.veg.message}</p>
          )}
        </div>
        <div>
          <Label className="block font-bold label" htmlFor="nonVeg">
            Non-vegetarian guests
          </Label>
          <div
            className="inline-block px-3 py-2 mt-4 border rounded-lg border-sky-200 bg-sky-50"
            data-hs-input-number=""
          >
            <div className="flex items-center gap-x-1.5">
              <button
                type="button"
                className="inline-flex items-center justify-center text-sm font-medium text-gray-800 transition-all duration-300 border rounded-md shadow-sm bg-sky-200 border-sky-100 size-6 gap-x-2 hover:bg-sky-300 disabled:opacity-50 disabled:pointer-events-none"
                onClick={decrementNonVeg}
              >
                <Minus className="flex-shrink-0 size-3.5" />
              </button>
              <Input
                className="w-6 p-0 text-center text-gray-800 bg-transparent border-0 focus:ring-0"
                type="text"
                data-hs-input-number-input=""
                id="nonVeg"
                {...register("nonVeg")}
                value={nonVeg}
                readOnly
              />
              <button
                type="button"
                className="inline-flex items-center justify-center text-sm font-medium text-gray-800 transition-all duration-300 border rounded-md shadow-sm bg-sky-200 border-sky-100 size-6 gap-x-2 hover:bg-sky-300 disabled:opacity-50 disabled:pointer-events-none"
                onClick={incrementNonVeg}
              >
                <Plus className="flex-shrink-0 size-3.5" />
              </button>
            </div>
          </div>
          {errors.nonVeg && (
            <p className="mt-1 text-sm text-red-600">{errors.nonVeg.message}</p>
          )}
        </div>
      </div>
      {customError && (
        <p className="mt-2 text-sm text-red-600">{customError}</p>
      )}
      <Button
        type="submit"
        disabled={isLoading}
        className="mt-8 bg-sky-200 text-sky-900 hover:bg-sky-300 "
      >
        {isLoading && <Loader2 className="mr-2 animate-spin" />}
        Submit
      </Button>
    </form>
  );
}

export default Form;
