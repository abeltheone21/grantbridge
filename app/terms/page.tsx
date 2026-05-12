export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-[#12150F] text-[#E7E4D8] py-20 px-6">
      <div className="max-w-4xl mx-auto bg-[#1C2117] p-8 md:p-12 rounded-3xl border border-[#4E5B2A]/30 shadow-2xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-[#C6A15B]">Terms and Conditions</h1>
        
        <div className="space-y-8 text-[#A6A99F] leading-relaxed">
          <p className="text-sm">Effective Date: {new Date().toLocaleDateString()}</p>
          
          <section>
            <h2 className="text-xl font-semibold text-[#E7E4D8] mb-3">1. Acceptance of Terms</h2>
            <p>By accessing or using GrantBridge, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you disagree with any part of these terms, you may not access our service.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-[#E7E4D8] mb-3">2. User Accounts</h2>
            <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the terms, which may result in immediate termination of your account.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-[#E7E4D8] mb-3">3. Use License</h2>
            <p>Permission is granted to temporarily download one copy of the materials (information or software) on GrantBridge's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold text-[#E7E4D8] mb-3">4. Limitations</h2>
            <p>In no event shall GrantBridge or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on GrantBridge's website.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
