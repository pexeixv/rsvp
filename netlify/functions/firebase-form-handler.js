import { collection, addDoc } from "firebase/firestore";
import { db } from "../../src/firebase";

export const handler = async (event) => {
  try {
    const data = JSON.parse(event.body);

    // Ensure data contains required fields
    if (
      !data.email ||
      !data.name ||
      data.veg === undefined ||
      data.nonVeg === undefined
    ) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid data" }),
      };
    }

    // Add document to Firestore
    await addDoc(collection(db, "submissions"), {
      email: data.email,
      name: data.name,
      veg: data.veg,
      nonVeg: data.nonVeg,
      createdAt: new Date(),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Form submitted successfully" }),
    };
  } catch (error) {
    console.error("Error submitting form:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
