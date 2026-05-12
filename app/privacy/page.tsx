export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#12150F] text-[#E7E4D8] py-20 px-6">
      <div className="max-w-4xl mx-auto bg-[#1C2117] p-8 md:p-12 rounded-3xl border border-[#4E5B2A]/30 shadow-2xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-[#C6A15B]">Privacy Policy</h1>
        
        <div className="space-y-8 text-[#A6A99F] leading-relaxed">
          <p className="text-sm">Effective Date: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-xl font-semibold text-[#E7E4D8] mb-3">1. Information We Collect</h2>
            <p>We collect information you provide directly to us, such as when you create an account, update your profile, or submit a grant application. This may include your name, email address, organization details, and any other information you choose to provide.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-[#E7E4D8] mb-3">2. How We Use Your Information</h2>
            <p>We use the information we collect to operate, maintain, and improve our services, including processing your grant applications, communicating with you about your account, and sending you relevant updates.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-[#E7E4D8] mb-3">3. Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect the security of your personal information. However, please note that no method of transmission over the Internet or method of electronic storage is 100% secure.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-[#E7E4D8] mb-3">4. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us through our contact page.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
