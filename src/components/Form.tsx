import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { Minus, Plus } from "lucide-react";

const url =
  "https://docs.google.com/forms/d/e/1FAIpQLSeR3H9vgQf-yQucnUoBk_rpJyzNtC8WSAJxlKaHYC9tpAAxOA/viewform?usp=pp_url&entry.1743438762=gavn@duck.com&entry.447022224=123&entry.1091390236=Pex&entry.2111883223=5&entry.1133838629=Non-veg";

const baseUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLSeR3H9vgQf-yQucnUoBk_rpJyzNtC8WSAJxlKaHYC9tpAAxOA/viewform?usp=pp_url";

interface FormInputs {
  email: string;
  code: string;
  name: string;
  vegCount: number;
  nonVegCount: number;
}

const validation = Yup.object().shape({
  email: Yup.string().required("Email is required"),
  code: Yup.string().required("Code is required"),
  name: Yup.string().required("Name is required"),
  vegCount: Yup.number().required("People count is required"),
  nonVegCount: Yup.number().required("People count is required"),
});

function Form() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormInputs>({ resolver: yupResolver(validation) });

  const [vegCount, setVegCount] = useState(0);
  const [nonVegCount, setNonVegCount] = useState(0);

  useEffect(() => {
    setValue("vegCount", vegCount);
  }, [vegCount, setValue]);

  useEffect(() => {
    setValue("nonVegCount", nonVegCount);
  }, [nonVegCount, setValue]);

  const incrementVegCount = () => {
    setVegCount(vegCount + 1);
  };

  const decrementVegCount = () => {
    setVegCount(vegCount > 0 ? vegCount - 1 : 0);
  };

  const incrementNonVegCount = () => {
    setNonVegCount(nonVegCount + 1);
  };

  const decrementNonVegCount = () => {
    setNonVegCount(nonVegCount > 0 ? nonVegCount - 1 : 0);
  };

  const handleFormSubmission = async (form: FormInputs) => {
    try {
      const response = await fetch("/.netlify/functions/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Form submitted successfully:", result);
      } else {
        console.error("Error submitting form:", result);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(handleFormSubmission)}
        id="rsvpForm"
        className="form-control p-8 rounded-lg bg-slate-100"
      >
        <div className="grid gap-8">
          <div>
            <label className="label font-bold" htmlFor="code">
              Code
            </label>
            <input
              className="input input-primary w-full"
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
              id="name"
              {...register("name")}
            />
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-8">
          <div>
            <label className="label font-bold" htmlFor="vegCount">
              Vegetarian guests
            </label>
            <div
              className="py-2 px-3 inline-block bg-white border border-gray-200 rounded-lg"
              data-hs-input-number=""
            >
              <div className="flex items-center gap-x-1.5">
                <button
                  type="button"
                  className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                  onClick={decrementVegCount}
                >
                  <Minus className="flex-shrink-0 size-3.5" />
                </button>
                <input
                  className="p-0 w-6 bg-transparent border-0 text-gray-800 text-center focus:ring-0"
                  type="text"
                  data-hs-input-number-input=""
                  id="vegCount"
                  {...register("vegCount")}
                  value={vegCount}
                  readOnly
                />
                <button
                  type="button"
                  className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                  onClick={incrementVegCount}
                >
                  <Plus className="flex-shrink-0 size-3.5" />
                </button>
              </div>
            </div>
          </div>
          <div>
            <label className="label font-bold" htmlFor="nonVegCount">
              Non-vegetarian guests
            </label>
            <div
              className="py-2 px-3 inline-block bg-white border border-gray-200 rounded-lg"
              data-hs-input-number=""
            >
              <div className="flex items-center gap-x-1.5">
                <button
                  type="button"
                  className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                  onClick={decrementNonVegCount}
                >
                  <Minus className="flex-shrink-0 size-3.5" />
                </button>
                <input
                  className="p-0 w-6 bg-transparent border-0 text-gray-800 text-center focus:ring-0"
                  type="text"
                  data-hs-input-number-input=""
                  id="nonVegCount"
                  {...register("nonVegCount")}
                  value={nonVegCount}
                  readOnly
                />
                <button
                  type="button"
                  className="size-6 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-md border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
                  onClick={incrementNonVegCount}
                >
                  <Plus className="flex-shrink-0 size-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <button className="btn btn-primary mt-8" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default Form;
