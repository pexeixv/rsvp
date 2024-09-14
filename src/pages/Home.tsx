import Card from "../components/Card";
import Form from "../components/Form";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  return (
    <>
      <main
        className="flex min-h-screen gap-16 p-6 bg-left bg-no-repeat bg-cover max-lg:flex-col justify-evenly lg:bg-center bg-sky-200/40 lg:p-8"
        style={{ backgroundImage: "url(/bg.png)" }}
      >
        <section className="grid w-full place-items-center">
          <Card />
        </section>
        <section className="grid w-full place-items-center">
          <Form />
        </section>
      </main>
      <Toaster />
    </>
  );
}
