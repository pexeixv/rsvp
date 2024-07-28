import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method not allowed" }),
    };
  }
  const body = JSON.parse(event.body);
  console.log(body.veg);

  try {
    const { code, email, name, veg, nonVeg } = body;

    if (!code || !email || !name || veg === undefined || nonVeg === undefined) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required fields" }),
      };
    }

    const { data, error } = await supabase
      .from("submissions")
      .insert([{ code, email, name, veg, nonVeg }]);

    if (error) {
      throw error;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Form submitted successfully", data }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
    };
  }
};
