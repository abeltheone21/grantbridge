import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
export default function Dashboard() {
  return (
    <>
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-gray-600">Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500">Total Grants</h2>
          <p className="text-2xl font-bold mt-2 text-blue-400">12</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500">Applications</h2>
          <p className="text-2xl font-bold mt-2 text-blue-400">4</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500">Approved</h2>
          <p className="text-2xl font-bold mt-2 text-blue-400">1</p>
        </div>
      </div>
    </div>
    
    {/* social media section */}
          <section className="bg-white py-8 sm:py-10 border-t">
            <div className="text-center px-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
                Connect With Us
              </h2>
    
              <div className="flex justify-center gap-6 sm:gap-8 text-xl sm:text-2xl">
                <a href="#" className="text-gray-600 hover:text-blue-600 transition transform hover:scale-110"
                  aria-label="Facebook">
                  <FaFacebook />
                </a>
    
                <a href="#"className="text-gray-600 hover:text-sky-500 transition transform hover:scale-110"
                  aria-label="Twitter">
                  <FaTwitter />
                </a>
    
                <a href="#" className="text-gray-600 hover:text-blue-700 transition transform hover:scale-110"
                  aria-label="LinkedIn">
                  <FaLinkedin />
                </a>
                <a href="#" className="text-gray-600 hover:text-pink-500 transition transform hover:scale-110"
                  aria-label="Instagram">
                  <FaInstagram />
                </a>
              </div>
    
              <p className="text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6">
                Empowering African organizations through funding opportunities.
              </p>
            </div>
          </section>
    
          {/* FOOTER */}
          <footer className="bg-white border-t p-6 sm:p-8 text-center">
            <p className="text-gray-500 text-xs sm:text-sm">
              © {new Date().getFullYear()} GrantBridge. All rights reserved.
            </p>
          </footer>

    </>
  );
}