import { collection, getDocs } from "firebase/firestore";
import { db } from "../../src/firebase";

export const handler = async () => {
  try {
    const submissionsSnapshot = await getDocs(collection(db, "submissions"));
    const submissions = submissionsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(submissions),
    };
  } catch (error) {
    console.error("Error retrieving submissions:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
