import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import SHA256 from "crypto-js/sha256";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchData() {
  let { data, error } = await supabase.from("submissions").select("*");

  if (error) {
    console.error("Error fetching data:", error);
    return [];
  }
  return data;
}

export default function Admin() {
  const [data, setData] = useState([]);
  const [kpis, setKpis] = useState({
    total: 0,
    totalPeople: 0,
    veg: 0,
    nonVeg: 0,
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const correctPasswordHash =
    "e546cabfbd6682c1c1af2af956300910a1a20a2afcde2467807f0099ed290583";

  useEffect(() => {
    async function getData() {
      if (isAuthenticated) {
        const fetchedData = await fetchData();
        setData(fetchedData);
        calculateKpis(fetchedData);
      }
    }

    getData();
  }, [isAuthenticated]);

  function calculateKpis(data) {
    const total = data.length;
    const totalPeople = data.reduce(
      (sum, item) => sum + item.veg + item.nonVeg,
      0
    );
    const veg = data.reduce((sum, item) => sum + item.veg, 0);
    const nonVeg = data.reduce((sum, item) => sum + item.nonVeg, 0);
    setKpis({ total, totalPeople, veg, nonVeg });
  }

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const inputPasswordHash = SHA256(password).toString();
    if (inputPasswordHash === correctPasswordHash) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  return (
    <div className="container mx-auto p-4">
      {!isAuthenticated ? (
        <form
          onSubmit={handlePasswordSubmit}
          className="max-w-xs mx-auto mt-10"
        >
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Enter Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
          <button
            type="submit"
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Submit
          </button>
        </form>
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-4">Submissions Data</h1>
          <div className="mb-4">
            <h2 className="text-xl font-bold">KPIs</h2>
            <p>Total Submissions: {kpis.total}</p>
            <p>Total People: {kpis.totalPeople}</p>
            <p>Veg Count: {kpis.veg}</p>
            <p>Non-Veg Count: {kpis.nonVeg}</p>
          </div>
          {/* Add your table and charts here */}
        </div>
      )}
    </div>
  );
}
