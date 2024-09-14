import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import SHA256 from "crypto-js/sha256";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { RefreshCwIcon } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const correctPasswordHash = import.meta.env.VITE_ADMIN_PASSWORD;
const supabase = createClient(supabaseUrl, supabaseKey);

export const columns: ColumnDef[] = [
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      const formatted = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      return <div className="font-medium">{formatted}</div>;
    },
    enableSorting: true,
    sortingFn: (a, b) => {
      const dateA = new Date(a.original.createdAt);
      const dateB = new Date(b.original.createdAt);
      return dateA.getTime() - dateB.getTime(); // Sort by date in ascending order
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: true,
    sortingFn: "alphanumeric", // Use alphanumeric sorting for strings
  },
  {
    accessorKey: "email",
    header: "Email",
    enableSorting: true,
    sortingFn: "alphanumeric", // Use alphanumeric sorting for strings
  },
  {
    accessorKey: "nonVeg",
    header: "Non-Veg Count",
    enableSorting: true,
    sortingFn: "basic", // Use basic sorting for numbers
  },
  {
    accessorKey: "veg",
    header: "Veg Count",
    enableSorting: true,
    sortingFn: "basic", // Use basic sorting for numbers
  },
];

export default function Admin() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [kpis, setKpis] = useState([
    { label: "Total Submissions", value: 0 },
    { label: "Total Count", value: 0 },
    { label: "Veg Count", value: 0 },
    { label: "Non-Veg Count", value: 0 },
  ]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "/.netlify/functions/get-firebase-submissions"
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };
  const getData = async () => {
    setIsLoading(true);
    if (isAuthenticated) {
      const fetchedData = await fetchData();
      setData(fetchedData);
      calculateKpis(fetchedData);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, [isAuthenticated]);

  const calculateKpis = (data) => {
    const total = data.length;
    const totalPeople = data.reduce(
      (sum, item) => sum + item.veg + item.nonVeg,
      0
    );
    const veg = data.reduce((sum, item) => sum + item.veg, 0);
    const nonVeg = data.reduce((sum, item) => sum + item.nonVeg, 0);
    setKpis([
      { label: "Total Submissions", value: total },
      { label: "Total People", value: totalPeople },
      { label: "Veg Count", value: veg },
      { label: "Non-Veg Count", value: nonVeg },
    ]);
  };

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
    <div className="container p-4 mx-auto">
      {!isAuthenticated && (
        <form
          onSubmit={handlePasswordSubmit}
          className="max-w-xs mx-auto mt-10"
        >
          <Label
            className="block mb-2 text-sm font-bold text-gray-700"
            htmlFor="password"
          >
            Enter Password
          </Label>
          <PasswordInput
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="default" className="mt-4">
            Submit
          </Button>
        </form>
      )}

      {isAuthenticated && (
        <>
          <div className="flex items-center justify-between mb-12">
            <h1 className="text-2xl font-bold lg:text-4xl">Submissions Data</h1>
            <Button onClick={getData} variant="secondary" size="sm">
              <RefreshCwIcon />
            </Button>
          </div>
          {isLoading && <div>Loading..</div>}
          {isError && <div>Error loading data.</div>}
          {!isLoading && !isError && (
            <div>
              <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2 lg:grid-cols-4">
                {kpis.map((kpi) => (
                  <Card key={kpi.label}>
                    <CardHeader>
                      <CardTitle>{kpi.value}</CardTitle>
                      <CardDescription>{kpi.label}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
              <DataTable data={data} columns={columns} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
