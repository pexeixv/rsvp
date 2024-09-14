import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../src/firebase";

function formatFirestoreTimestamp(timestamp) {
  if (timestamp && timestamp.seconds) {
    const date = new Date(
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
    );
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }
  return "";
}

export const handler = async () => {
  try {
    // Create a query to sort the submissions by createdAt in descending order
    const submissionsQuery = query(
      collection(db, "submissions"),
      orderBy("createdAt", "desc")
    );

    // Execute the query
    const submissionsSnapshot = await getDocs(submissionsQuery);

    const submissions = submissionsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        createdAt: formatFirestoreTimestamp(data.createdAt),
      };
    });

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
