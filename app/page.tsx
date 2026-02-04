import CalculatorForm from "@/components/CalculatorForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center">
          <h1 className="text-4xl font-extrabold text-green-600">
            Nutri Craft
          </h1>
          <p className="text-gray-600">Planifie ta nutrition intelligemment</p>
        </header>

        <section className="bg-white p-6 rounded-2xl shadow-xl">
          <CalculatorForm />;
        </section>
      </div>
    </main>
  );
}
