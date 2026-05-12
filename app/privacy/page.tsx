import React from 'react';

export const metadata = {
  title: 'Privacy Policy | GrantBridge',
  description: 'How GrantBridge collects, uses, and protects your data.',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0A0C08] text-[#E7E4D8] selection:bg-[#C6A15B] selection:text-[#12150F]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full pointer-events-none opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#C6A15B] blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-[#3F4F24] blur-[100px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              Privacy <span className="text-[#C6A15B]">Policy</span>
            </h1>
            <p className="text-xl text-[#A6A99F] leading-relaxed">
              At GrantBridge, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information when you use our platform.
            </p>
            <div className="mt-8 flex items-center gap-4 text-sm text-[#6C6F66]">
              <span>Last Updated: May 11, 2026</span>
              <span className="w-1 h-1 rounded-full bg-[#4E5B2A]" />
              <span>Effective Date: June 1, 2026</span>
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
                  { id: 'introduction', label: '1. Introduction' },
                  { id: 'data-collection', label: '2. Data Collection' },
                  { id: 'usage', label: '3. How We Use Data' },
                  { id: 'sharing', label: '4. Data Sharing' },
                  { id: 'security', label: '5. Security Measures' },
                  { id: 'rights', label: '6. Your Rights' },
                  { id: 'contact', label: '7. Contact Us' },
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
              <div id="introduction" className="mb-16 scroll-mt-32">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-4">
                  <span className="text-[#C6A15B]">01.</span> Introduction
                </h2>
                <p>
                  GrantBridge ("we," "us," or "our") operates the GrantBridge platform, which connects organizations with grant opportunities. This Privacy Policy informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
                </p>
                <p>
                  We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy.
                </p>
              </div>

              <div id="data-collection" className="mb-16 scroll-mt-32">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-4">
                  <span className="text-[#C6A15B]">02.</span> Data Collection
                </h2>
                <p>We collect several different types of information for various purposes to provide and improve our Service to you:</p>
                <ul className="list-disc pl-6 space-y-3">
                  <li><strong>Personal Data:</strong> While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include Email address, First name and last name, Phone number, and Address.</li>
                  <li><strong>Usage Data:</strong> We may also collect information on how the Service is accessed and used ("Usage Data"). This may include your IP address, browser type, browser version, the pages of our Service that you visit, the time and date of your visit, and other diagnostic data.</li>
                  <li><strong>Tracking & Cookies Data:</strong> We use cookies and similar tracking technologies (like PostHog) to track the activity on our Service and hold certain information.</li>
                </ul>
              </div>

              <div id="usage" className="mb-16 scroll-mt-32">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-4">
                  <span className="text-[#C6A15B]">03.</span> How We Use Data
                </h2>
                <p>GrantBridge uses the collected data for various purposes:</p>
                <ul className="list-disc pl-6 space-y-3">
                  <li>To provide and maintain our Service</li>
                  <li>To notify you about changes to our Service</li>
                  <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
                  <li>To provide customer support</li>
                  <li>To gather analysis or valuable information so that we can improve our Service</li>
                  <li>To monitor the usage of our Service</li>
                  <li>To detect, prevent and address technical issues</li>
                </ul>
              </div>

              <div id="security" className="mb-16 scroll-mt-32">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-4">
                  <span className="text-[#C6A15B]">04.</span> Security Measures
                </h2>
                <p>
                  The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
                </p>
                <div className="bg-[#12150F] border border-[#4E5B2A]/30 p-6 rounded-2xl mt-6">
                  <p className="text-sm italic">
                    We implement industry-standard encryption and security protocols, including SSL/TLS for data in transit and secure database RLS (Row Level Security) for data at rest.
                  </p>
                </div>
              </div>

              <div id="contact" className="scroll-mt-32">
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-4">
                  <span className="text-[#C6A15B]">05.</span> Contact Us
                </h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <ul className="list-none p-0 space-y-2 mt-4">
                  <li className="flex items-center gap-3">
                    <span className="text-[#C6A15B]">Email:</span> 
                    <a href="mailto:privacy@grantbridge.com" className="hover:underline text-[#E7E4D8]">privacy@grantbridge.com</a>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-[#C6A15B]">Address:</span> 
                    <span>Addis Ababa, Ethiopia</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 border-t border-[#4E5B2A]/20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Have questions about your data?</h2>
          <p className="text-[#A6A99F] mb-8">Our support team is here to help you understand your rights.</p>
          <a 
            href="mailto:support@grantbridge.com"
            className="inline-flex items-center justify-center px-8 py-3 bg-[#C6A15B] text-[#12150F] rounded-xl font-bold hover:bg-[#d4b46d] transition-all"
          >
            Contact Support
          </a>
        </div>
      </section>
  );
}
