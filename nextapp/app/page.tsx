import React from "react";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero section" id="home">
        <div className="hero-bg" role="img" aria-label="Premium legal and financial consulting office"></div>
        <div className="hero-overlay"></div>
        <div className="hero-inner reveal">
          <p className="eyebrow">Tax . Legal . GST . Compliance . Notary</p>
          <h1>Expert Tax, GST, Legal &amp; Compliance Solutions Under One Roof</h1>
          <p className="hero-copy">Professional legal, taxation, compliance and business advisory services for businesses and individuals.</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="consultation.html">Book Consultation</a>
            <button className="btn btn-secondary" data-open-modal="uploadModal">Upload Documents</button>
            <a className="btn btn-secondary" href="consultation.html">Schedule Appointment</a>
            <a className="btn btn-whatsapp" href="https://wa.me/919898563718" target="_blank" rel="noopener">WhatsApp</a>
          </div>
          <div className="trust-strip">
            <span>Trusted Professionals</span>
            <span>Fast Service</span>
            <span>Confidential Support</span>
            <span>Expert Legal Guidance</span>
            <span>Business Compliance Specialists</span>
          </div>
        </div>
        <div className="hero-stat-panel reveal">
          <article><strong data-count="1250">0</strong><span>Clients Served</span></article>
          <article><strong data-count="890">0</strong><span>Cases Resolved</span></article>
          <article><strong data-count="5400">0</strong><span>GST Filings</span></article>
          <article><strong data-count="760">0</strong><span>Businesses Assisted</span></article>
        </div>
      </section>
      {/* About Section */}
      <section className="section about-section" id="about">
        <div className="container split">
          <div className="media-panel reveal">
            <img src="/assets/premium-office-hero.png" alt="Premium advisory office interior" />
            <div className="floating-card">
              <strong>20+ Years</strong>
              <span>Combined advisory and compliance experience</span>
            </div>
          </div>
          <div className="content-stack reveal">
            <p className="eyebrow">About the firm</p>
            <h2>Diligent counsel for complex compliance, tax and legal decisions.</h2>
            <p>Dilip Borge Associates provides integrated support across taxation, GST, legal documentation, notary, litigation representation and business compliance. The firm is designed around clarity, confidentiality and dependable execution.</p>
            <div className="value-grid">
              <article><i data-lucide="target"></i><h3>Mission</h3><p>Deliver practical, timely and ethically grounded advisory services.</p></article>
              <article><i data-lucide="eye"></i><h3>Vision</h3><p>Become a trusted long-term compliance partner for growing businesses.</p></article>
              <article><i data-lucide="shield-check"></i><h3>Values</h3><p>Integrity, precision, confidentiality, accountability and client-first guidance.</p></article>
            </div>
            <div className="founder-card">
              <div className="avatar">DB</div>
              <div>
                <h3>Founder Profile</h3>
                <p>Dilip Borge leads the firm with a focus on reliable documentation, careful representation and business-aware legal strategy.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="container timeline reveal">
          <article><span>2008</span><p>Practice foundation in tax and documentation services.</p></article>
          <article><span>2014</span><p>Expanded GST, compliance and business advisory capabilities.</p></article>
          <article><span>2019</span><p>Built dedicated legal documentation and notary workflows.</p></article>
          <article><span>2026</span><p>Premium digital-first client consultation and portal experience.</p></article>
        </div>
      </section>
    </>
  );
}


export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
