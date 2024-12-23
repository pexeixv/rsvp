import { useEffect, useState } from "react";
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
import { LogOutIcon, RefreshCwIcon } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const correctPasswordHash = import.meta.env.VITE_ADMIN_PASSWORD;

export const columns: ColumnDef<Record<string, any>>[] = [
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.createdAt}</div>;
    },
    enableSorting: true,
  },
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: true,
    sortingFn: "alphanumeric",
    cell: ({ row }) => <div>{row.getValue<string>("name")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    enableSorting: true,
    sortingFn: "alphanumeric",
    cell: ({ row }) => <div>{row.getValue<string>("email")}</div>,
  },
  {
    accessorKey: "nonVeg",
    header: "Non-Veg Count",
    enableSorting: true,
    sortingFn: "basic",
    cell: ({ row }) => <div>{row.getValue<number>("nonVeg")}</div>,
  },
  {
    accessorKey: "veg",
    header: "Veg Count",
    enableSorting: true,
    sortingFn: "basic",
    cell: ({ row }) => <div>{row.getValue<number>("veg")}</div>,
  },
];
export default function Admin() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const [kpis, setKpis] = useState([
    { label: "Total Submissions", value: 0 },
    { label: "Total Count", value: 0 },
    { label: "Veg Count", value: 0 },
    { label: "Non-Veg Count", value: 0 },
  ]);

  useEffect(() => {
    const savedPassword = localStorage.getItem("RSVP_GAVN_IN");
    if (savedPassword) {
      const inputPasswordHash = SHA256(savedPassword).toString();
      if (inputPasswordHash === correctPasswordHash) {
        setIsAuthenticated(true);
      }
    }
  }, []);

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
    const inputPasswordHash = SHA256(password.trim().toLowerCase()).toString();
    if (inputPasswordHash === correctPasswordHash) {
      setIsAuthenticated(true);
      localStorage.setItem("RSVP_GAVN_IN", password);
      toast({
        title: "Success!",
        description: "You are now authenticated.",
      });
    } else {
      toast({
        title: "Error",
        description: "Incorrect password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const logout = () => {
    localStorage.removeItem("RSVP_GAVN_IN");
    setIsAuthenticated(false);
    setPassword("");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
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
          <div className="flex justify-between gap-4 mb-8 sm:items-center max-sm:flex-col">
            <h1 className="text-2xl font-bold lg:text-4xl">Submissions Data</h1>
            <div className="flex gap-4">
              <Button
                onClick={getData}
                variant="secondary"
                size="sm"
                className="flex items-center gap-1"
              >
                <RefreshCwIcon className="size-4" />
                Refresh Data
              </Button>
              <Button
                onClick={logout}
                variant="secondary"
                size="sm"
                className="flex items-center gap-1"
              >
                <LogOutIcon className="size-4" />
                Logout
              </Button>
            </div>
          </div>
          {isLoading && (
            <section>
              <div className="grid grid-cols-2 gap-4 mb-4 lg:grid-cols-4">
                {[1, 2, 3, 4].map((_, index) => (
                  <Skeleton key={index} className="w-full h-24" />
                ))}
              </div>
              <div className="flex justify-between mt-8">
                <Skeleton className="w-full h-10 max-w-lg" />
                <Skeleton className="w-full h-10 max-w-24" />
              </div>
              <Skeleton className="w-full h-[600px] mt-4" />
            </section>
          )}
          {isError && <div>Error loading data.</div>}
          {!isLoading && !isError && (
            <div>
              <div className="grid grid-cols-2 gap-4 mb-4 lg:grid-cols-4">
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
      <Toaster />
    </div>
  );
}
