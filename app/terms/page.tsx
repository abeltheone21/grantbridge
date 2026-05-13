import React from 'react';

export const metadata = {
  title: 'Terms & Conditions | GrantBridge',
  description: 'The legal agreement for using the GrantBridge platform.',
};

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-[#0A0C08] text-[#E7E4D8] selection:bg-[#C6A15B] selection:text-[#12150F]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full pointer-events-none opacity-20">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#3F4F24] blur-[120px]" />
          <div className="absolute bottom-[10%] left-[-10%] w-[30%] h-[30%] rounded-full bg-[#C6A15B] blur-[100px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              Terms & <span className="text-[#C6A15B]">Conditions</span>
            </h1>
            <p className="text-xl text-[#A6A99F] leading-relaxed">
              Please read these terms and conditions carefully before using our platform. By accessing GrantBridge, you agree to be bound by these terms.
            </p>
            <div className="mt-8 flex items-center gap-4 text-sm text-[#6C6F66]">
              <span>Last Updated: May 11, 2026</span>
              <span className="w-1 h-1 rounded-full bg-[#4E5B2A]" />
              <span>Version: 2.1.0</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="pb-32">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-4 hidden lg:block sticky top-32 h-fit">
              <nav className="space-y-2 border-l border-[#4E5B2A]/20 pl-6">
                {[
                  { id: 'acceptance', label: '1. Acceptance of Terms' },
                  { id: 'eligibility', label: '2. User Eligibility' },
                  { id: 'accounts', label: '3. User Accounts' },
                  { id: 'content', label: '4. Platform Content' },
                  { id: 'prohibited', label: '5. Prohibited Conduct' },
                  { id: 'termination', label: '6. Termination' },
                  { id: 'liability', label: '7. Limitation of Liability' },
                ].map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block py-2 text-[#A6A99F] hover:text-[#C6A15B] transition-colors text-sm font-medium"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </aside>

            {/* Main Content */}
            <div className="lg:col-span-8 max-w-none prose prose-invert prose-headings:text-[#E7E4D8] prose-p:text-[#A6A99F] prose-li:text-[#A6A99F] prose-strong:text-[#C6A15B]">
              <div id="acceptance" className="mb-16 scroll-mt-32">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-4">
                  <span className="text-[#C6A15B]">01.</span> Acceptance of Terms
                </h2>
                <p>
                  By accessing or using GrantBridge (the "Service"), you agree to be bound by these Terms and Conditions ("Terms"). If you disagree with any part of the terms, then you may not access the Service.
                </p>
                <p>
                  These Terms apply to all visitors, users, and others who access or use the Service.
                </p>
              </div>

              <div id="eligibility" className="mb-16 scroll-mt-32">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-4">
                  <span className="text-[#C6A15B]">02.</span> User Eligibility
                </h2>
                <p>
                  The Service is intended for users who are at least 18 years old. By using the Service, you represent and warrant that you are of legal age to form a binding contract with GrantBridge and meet all of the foregoing eligibility requirements.
                </p>
              </div>

              <div id="accounts" className="mb-16 scroll-mt-32">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-4">
                  <span className="text-[#C6A15B]">03.</span> User Accounts
                </h2>
                <p>
                  When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                </p>
                <p>
                  You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.
                </p>
              </div>

              <div id="content" className="mb-16 scroll-mt-32">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-4">
                  <span className="text-[#C6A15B]">04.</span> Platform Content
                </h2>
                <p>
                  Our Service allows you to view grant information, submit applications, and post comments. You are responsible for the content you provide.
                </p>
                <p>
                  GrantBridge reserves the right to monitor and edit all Content provided by users.
                </p>
              </div>

              <div id="prohibited" className="mb-16 scroll-mt-32">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-4">
                  <span className="text-[#C6A15B]">05.</span> Prohibited Conduct
                </h2>
                <p>You agree not to engage in any of the following prohibited activities:</p>
                <ul className="list-disc pl-6 space-y-3">
                  <li>Copying, distributing, or disclosing any part of the Service in any medium.</li>
                  <li>Using any automated system, including "robots," "spiders," or "offline readers" to access the Service.</li>
                  <li>Attempting to interfere with, compromise the system integrity or security, or decipher any transmissions to or from the servers running the Service.</li>
                  <li>Taking any action that imposes, or may impose at our sole discretion an unreasonable or disproportionately large load on our infrastructure.</li>
                </ul>
              </div>

              <div id="termination" className="mb-16 scroll-mt-32">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-4">
                  <span className="text-[#C6A15B]">06.</span> Termination
                </h2>
                <p>
                  We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                </p>
                <p>
                  Upon termination, your right to use the Service will immediately cease.
                </p>
              </div>

              <div id="liability" className="scroll-mt-32">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-4">
                  <span className="text-[#C6A15B]">07.</span> Limitation of Liability
                </h2>
                <p>
                  In no event shall GrantBridge, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 border-t border-[#4E5B2A]/20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Have questions about our terms?</h2>
          <p className="text-[#A6A99F] mb-8">We're here to help you understand our platform rules.</p>
          <a 
            href="mailto:legal@grantbridge.com"
            className="inline-flex items-center justify-center px-8 py-3 bg-[#C6A15B] text-[#12150F] rounded-xl font-bold hover:bg-[#d4b46d] transition-all"
          >
            Contact Legal Team
          </a>
        </div>
      </section>
    </div>
  );
}
