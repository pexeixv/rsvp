import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import {
  Minus,
  Plus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";

interface FormInputs {
  email: string;
  code: string;
  name: string;
  veg: number;
  nonVeg: number;
}

const validation = Yup.object().shape({
  email: Yup.string().required("Email is required"),
  code: Yup.string().required("Code is required"),
  name: Yup.string().required("Name is required"),
  veg: Yup.number().required("People is required"),
  nonVeg: Yup.number().required("People is required"),
});

function Form() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormInputs>({ resolver: yupResolver(validation) });

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
    setVeg(veg + 1);
  };

  const decrementVeg = () => {
    setVeg(veg > 0 ? veg - 1 : 0);
  };

  const incrementNonVeg = () => {
    setNonVeg(nonVeg + 1);
  };

  const decrementNonVeg = () => {
    setNonVeg(nonVeg > 0 ? nonVeg - 1 : 0);
  };

  const handleFormSubmission = async (form: FormInputs) => {
    setIsLoading(true);
    try {
      const response = await fetch("/.netlify/functions/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      alert("Form submitted successfully");
      reset();
      setIsLoading(false);
    } catch (error) {
      alert("Error submitting form");
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmission)}
      id="rsvpForm"
      className="form-control p-8 rounded-lg bg-white border-amber-200/50 border-2 w-full  max-w-2xl"
    >
      <h2 className="font-bold text-2xl lg:text-3xl">RSVP here</h2>
      <div className="grid gap-8 mt-4">
        <div>
          <label className="label font-bold" htmlFor="code">
            Code
          </label>
          <input
            className="input input-primary w-full"
            required
            type="text"
            id="code"
            {...register("code")}
          />
        </div>
        <div>
          <label className="label font-bold" htmlFor="email">
            Email
          </label>
          <input
            className="input input-primary w-full"
            type="email"
            required
            id="email"
            {...register("email")}
          />
        </div>
        <div>
          <label className="label font-bold" htmlFor="name">
            Name
          </label>
          <input
            className="input input-primary w-full"
            type="text"
            required
            id="name"
            {...register("name")}
          />
        </div>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-8">
        <div>
          <label className="label font-bold" htmlFor="veg">
            Vegetarian guests
          </label>
          <div
            className="py-2 px-3 inline-block bg-amber-50 border border-amber-200 rounded-lg"
            data-hs-input-number=""
          >
            <div className="flex items-center gap-x-1.5">
              <button
                type="button"
                className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border bg-amber-200 border-amber-100 text-gray-800 shadow-sm hover:bg-amber-300 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
                onClick={decrementVeg}
              >
                <Minus className="flex-shrink-0 size-3.5" />
              </button>
              <input
                className="p-0 w-6 bg-transparent border-0 text-gray-800 text-center focus:ring-0"
                type="text"
                data-hs-input-number-input=""
                id="veg"
                {...register("veg")}
                value={veg}
                readOnly
              />
              <button
                type="button"
                className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border bg-amber-200 border-amber-100 text-gray-800 shadow-sm hover:bg-amber-300 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
                onClick={incrementVeg}
              >
                <Plus className="flex-shrink-0 size-3.5" />
              </button>
            </div>
          </div>
        </div>
        <div>
          <label className="label font-bold" htmlFor="nonVeg">
            Non-vegetarian guests
          </label>
          <div
            className="py-2 px-3 inline-block bg-amber-50 border border-amber-200 rounded-lg"
            data-hs-input-number=""
          >
            <div className="flex items-center gap-x-1.5">
              <button
                type="button"
                className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border bg-amber-200 border-amber-100 text-gray-800 shadow-sm hover:bg-amber-300 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
                onClick={decrementNonVeg}
              >
                <Minus className="flex-shrink-0 size-3.5" />
              </button>
              <input
                className="p-0 w-6 bg-transparent border-0 text-gray-800 text-center focus:ring-0"
                type="text"
                data-hs-input-number-input=""
                id="nonVeg"
                {...register("nonVeg")}
                value={nonVeg}
                readOnly
              />
              <button
                type="button"
                className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border bg-amber-200 border-amber-100 text-gray-800 shadow-sm hover:bg-amber-300 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none"
                onClick={incrementNonVeg}
              >
                <Plus className="flex-shrink-0 size-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        className="btn btn-primary mt-8 flex items-center justify-center bg-amber-200 hover:bg-amber-100 transition-all duration-300"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="animate-spin mr-2" /> : "Submit"}
      </button>
    </form>
  );
}

export default Form;
