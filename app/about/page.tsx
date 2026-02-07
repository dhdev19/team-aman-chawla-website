import { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { generatePageMetadata } from "@/lib/metadata";
import { FadeIn, SlideIn } from "@/components/animations";

/* Inline SVG icons for about page (no extra dependency) */
const IconBuilding = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
    <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
    <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
    <path d="M10 6h4" />
    <path d="M10 10h4" />
    <path d="M10 14h4" />
  </svg>
);
const IconTarget = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);
const IconShield = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconAward = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </svg>
);
const IconHeart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);
const IconBriefcase = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    <rect width="20" height="14" x="2" y="6" rx="2" />
  </svg>
);
const IconLayoutGrid = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <rect width="7" height="7" x="3" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="14" rx="1" />
    <rect width="7" height="7" x="3" y="14" rx="1" />
  </svg>
);
const IconUserCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="m19 8 2 2 4-4" />
  </svg>
);
const IconUsers = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const IconArrowRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);
const IconYouTube = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);
const IconMail = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export const metadata: Metadata = generatePageMetadata(
  "About Us - Team Aman Chawla",
  "Learn more about Team Aman Chawla, your trusted real estate partner. Discover our mission, values, and commitment to helping you find your perfect property."
);

const values = [
  {
    title: "Integrity",
    description:
      "We conduct business with honesty, transparency, and ethical practices. Your trust is our most valuable asset.",
    icon: IconShield,
  },
  {
    title: "Excellence",
    description:
      "We strive for excellence in every interaction, ensuring you receive the highest quality service and support.",
    icon: IconAward,
  },
  {
    title: "Client-Centric",
    description:
      "Your needs and goals are at the center of everything we do. We're here to serve you, not just sell properties.",
    icon: IconHeart,
  },
];

const whyChooseUs = [
  {
    title: "Client-First Approach",
    description:
      "We assess your requirements through active listening, which allows us to present property options that precisely meet your budgetary constraints and future objectives.",
    icon: IconBriefcase,
  },
  {
    title: "Verified & Transparent Listings",
    description:
      "The property needs full verification because our system delivers you genuine options that come without any concealed charges.",
    icon: IconLayoutGrid,
  },
  {
    title: "Strong Local Market Expertise",
    description:
      "Our thorough knowledge of local real estate market patterns enables you to make secure and knowledgeable choices.",
    icon: IconUserCheck,
  },
  {
    title: "End-to-End Support",
    description:
      "Our team delivers complete support starting from property selection and ending at final documentation which enables you to experience a smooth and stress-free process.",
    icon: IconUsers,
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-neutral-50">
        {/* Hero */}
        <div className="relative bg-primary-700 text-white overflow-hidden breadcrumb-section">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
          </div>
          <Container className="relative">
            <FadeIn className="flex flex-col items-center text-center max-w-3xl mx-auto">
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 text-white mb-6" aria-hidden>
                <IconBuilding />
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
                About Us 
              </h1>
              <p className="text-lg md:text-xl text-primary-100">
                Your trusted partner in real estate
              </p>
            </FadeIn>
          </Container>
        </div>

        <div className="about-us-section">
      <Container>
        <div className="about-us-inner-section grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-6">
          <div className="about-us-content md:col-span-8">
           <p>Team Aman Chawla provides a property search service which enables clients to find properties through an easy-to-use process which enables them to track the information between them and the business. The real estate process needs our complete support because we deliver genuine property listings with straightforward testing techniques and professional guidance throughout every stage. Our team helps you achieve your property goals through our strong local expertise and dedicated support, whether you want to buy your first home or make a strategic investment.</p>
          </div>
          <div className="about-us-image md:col-span-4">
          <img src="/about-aman-chawla.png" alt="icon" />
          </div>
        </div>
      </Container>

        </div>

        <Container className="py-14 md:py-16">
          <div className="space-y-16 md:space-y-20 about-inner-section">
           

 {/* YouTube CTA Section */}
  <SlideIn direction="up" delay={0.2}>
              <a
                href="https://www.youtube.com/@TeamAmanChawla"
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <Card variant="elevated" className="bg-red-50 border-2 border-red-200 overflow-hidden text-center hover:border-red-400 hover:shadow-lg transition-all duration-300 group-hover:bg-red-100/80">
                  <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#FF0000] text-white mx-auto mb-5 group-hover:scale-110 transition-transform" aria-hidden>
                    <IconYouTube />
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3">
                    Watch Us on YouTube
                  </h2>
                  <p className="text-lg text-neutral-700 mb-6 max-w-xl mx-auto">
                    Property insights, market updates, and expert tips from Team Aman Chawla. Subscribe for the latest.
                  </p>
                  <span className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#FF0000] text-white rounded-md group-hover:bg-[#cc0000] transition-colors font-semibold shadow-md">
                    Visit Our Channel
                    <IconArrowRight />
                  </span>
                </Card>
              </a>
            </SlideIn>



 {/* Mission Section */}
 <SlideIn direction="up">
              <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-300 our-mission">
                <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
                  <div className="flex items-center justify-center sm:justify-start sm:w-14 shrink-0">
                    <span className="flex items-center justify-center w-14 h-14 rounded-xl bg-primary-100 text-primary-700" aria-hidden>
                      <IconTarget />
                    </span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
                      Our Mission
                    </h2>
                    <p>
                    Our mission is to transform the way people experience real estate by making every transaction clear, credible, and customized to the client’s needs. We aim to establish new benchmarks which define integrity and professional standards throughout the field of property consulting. The future will establish a system which supports homebuyers and investors throughout their entire real estate transaction process.
                    </p>
                     
                  </div>
                </div>
              </Card>
            </SlideIn>



            {/* Values Section */}
            <section className="our-values-section">
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-10 text-center">
                Our Values
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                {values.map((value, index) => {
                  const IconComponent = value.icon;
                  return (
                    <SlideIn key={value.title} direction="up" delay={index * 0.1}>
                      <Card variant="outlined" className="value-box h-full flex flex-col border-2 border-neutral-200 hover:border-primary-300 hover:shadow-md transition-all duration-300 group">
                        <span className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary-100 text-primary-700 mb-4 group-hover:bg-primary-200 transition-colors" aria-hidden>
                          <IconComponent />
                        </span>
                        <h3 className="text-xl font-semibold text-neutral-900 mb-3">
                          {value.title}
                        </h3>
                        <p className="text-neutral-700 flex-1 leading-relaxed">
                          {value.description}
                        </p>
                      </Card>
                    </SlideIn>
                  );
                })}
              </div>
            </section>

            {/* Why Choose Us Section */}
            <SlideIn direction="up" delay={0.2}>
              <Card className="border-0 shadow-md overflow-hidden">
                <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-8">
                  Why Choose Team Aman Chawla?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                  {whyChooseUs.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <div
                        key={item.title}
                        className="flex gap-4 p-4 rounded-lg bg-neutral-50/80 hover:bg-primary-50/50 transition-colors duration-200"
                      >
                        <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-primary-700 text-white shrink-0" aria-hidden>
                          <IconComponent />
                        </span>
                        <div>
                          <h3 className="font-semibold text-neutral-900 mb-1.5">
                            {item.title}
                          </h3>
                          <p className="text-neutral-700 text-sm leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </SlideIn>

           

            {/* CTA Section */}
            <SlideIn direction="up" delay={0.3}>
              <Card variant="elevated" className="bg-primary-50 border-2 border-primary-200 overflow-hidden text-center">
                <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-700 text-white mx-auto mb-5" aria-hidden>
                  <IconMail />
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3">
                  Ready to Find Your Perfect Property?
                </h2>
                <p className="text-lg text-neutral-700 mb-6 max-w-xl mx-auto">
                  Let's start your property journey together. Contact us today
                  to discuss your needs.
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-700 text-white rounded-md hover:bg-primary-800 transition-colors font-semibold shadow-md hover:shadow-lg"
                >
                  Get In Touch
                  <IconArrowRight />
                </a>
              </Card>
            </SlideIn>



            
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
