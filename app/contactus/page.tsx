import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
export default function ContactPage() {
  return (
    <>
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">

      <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow">

        <h1 className="text-2xl font-bold text-center mb-6 text-gray-600">
          Contact Us
        </h1>

        <input
          type="text"
          placeholder="Your Name"
          className="w-full mb-4 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-400"/>

        <input
          type="email"
          placeholder="Email Address"
          className="w-full mb-4 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-400"/>

        <textarea
          placeholder="Your Message"
          className="w-full mb-4 px-4 py-3 border rounded-lg h-32 focus:ring-2 focus:ring-blue-500 text-gray-400"/>

        <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 ">
          Send Message
        </button>

      </div>
    </div>
    {/* SOCIAL MEDIA */}
      <section className="bg-white py-8 sm:py-10 border-t">
        <div className="text-center px-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 sm:mb-6">
            Connect With Us
          </h2>

          <div className="flex justify-center gap-6 sm:gap-8 text-xl sm:text-2xl">
            <a 
              href="#" 
              className="text-gray-600 hover:text-blue-600 transition transform hover:scale-110"
              aria-label="Facebook">
              <FaFacebook/>
            </a>

            <a 
              href="#" 
              className="text-gray-600 hover:text-sky-500 transition transform hover:scale-110"
              aria-label="Twitter"
            >
              <FaTwitter/>
            </a>

            <a href="#" className="text-gray-600 hover:text-blue-700 transition transform hover:scale-110"
              aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a 
              href="#" 
              className="text-gray-600 hover:text-pink-500 transition transform hover:scale-110"
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