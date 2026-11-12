import { Composer } from "@/components/composer";
import { Feed } from "@/components/feed";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Navbar */}
      <header className="bg-[#4267B2] text-white p-3 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto font-bold text-xl tracking-tight">
          wall
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8 p-6 mt-4">
        {/* Left Sidebar (Profile Details) */}
        <aside className="space-y-6">
          <div className="space-y-4">
            <div className="w-full aspect-square relative rounded-sm overflow-hidden border border-gray-200">
              <Image
                src="/profile-pic.webp"
                alt="Greg Wientjes"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Jess Kenneth Lacorte
              </h1>
              <p className="text-gray-600">wall</p>
            </div>
          </div>

          <div className="space-y-4 text-sm">
            <div className="border border-gray-200 p-2 bg-gray-50 w-max text-gray-600">
              Information
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Networks</h3>
              <p className="text-gray-600">St. Anthony's College</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Current City</h3>
              <p className="text-gray-600">Tobias Fornier, Philippines</p>
            </div>
          </div>
        </aside>

        {/* Right Main Column (Composer & Feed) */}
        <section className="bg-white rounded-md border border-gray-200 p-6 shadow-sm">
          <Composer />
          <div className="my-6 border-b border-gray-200"></div>
          <Feed />
        </section>
      </main>
    </div>
  );
}
