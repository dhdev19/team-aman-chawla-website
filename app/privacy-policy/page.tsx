import { Metadata } from "next";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { generatePageMetadata } from "@/lib/metadata";
import { FadeIn, SlideIn } from "@/components/animations";

export const metadata: Metadata = generatePageMetadata(
  "Privacy Policy - Team Aman Chawla",
  "Read our privacy policy to understand how Team Aman Chawla collects, uses, and protects your personal information."
);

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="bg-primary-700 text-white py-12">
          <Container>
            <FadeIn>
              <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
              <p className="text-lg text-primary-100">
                How we protect and use your information
              </p>
            </FadeIn>
          </Container>
        </div>

        <Container className="py-12">
          <div className="space-y-8 privacy-policy-content">
            <SlideIn direction="up">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                  The Purpose
                </h2>
                <p className="text-neutral-700">
                  The purpose of this policy is to explain how we safeguard the
                  privacy of those who provide us with their personal information
                  either through the website or in other ways and to explain how you
                  can view, modify or remove the information that we have collected.
                </p>
              </div>
            </SlideIn>

            <SlideIn direction="up" delay={0.1}>
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                  What personally identifiable information do we collect?
                </h2>
                <p className="text-neutral-700">
                  We collect personally identifiable information like your name,
                  email, phone and your website link but only when you choose to
                  provide such information to us while subscribing to our newsletter,
                  filling out a form or commenting on our site. You may, however,
                  visit our site anonymously.
                </p>
              </div>
            </SlideIn>

            <SlideIn direction="up" delay={0.2}>
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                  Any additional information do we collect?
                </h2>
                <p className="text-neutral-700 mb-4">
                  We make use of Server log files, Cookies and Pixel tags to help
                  diagnose problems with our server, to administer our site, analyze
                  trends, track user's movement around the site and gather
                  demographic information.
                </p>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                      Server log files:
                    </h3>
                    <p className="text-neutral-700">
                      The information inside the server log files includes visitor's
                      Internet Protocol ( IP ) addresses, type of browser, Internet
                      Service Provider ( ISP ), date-time stamp, referring-exit pages
                      and number of clicks. However, IP addresses and other such
                      information are not linked to any information that is personally
                      identifiable.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                      Cookies:
                    </h3>
                    <p className="text-neutral-700 mb-2">
                      A Cookie is a small text file that is placed in your browser
                      during your visit to a web page to gain information on how you
                      use the website. Cookies themselves do not contain any
                      information that is personally identifiable.
                    </p>
                    <p className="text-neutral-700 mb-2">
                      Cookies may also be used by third party content providers such
                      as ad networks and analytics services we work with. Third party
                      ad networks that are serving ads on our site may be placing and
                      reading cookies on your browsers, or using web beacons to
                      collect information as a result of ad serving.
                    </p>
                    <p className="text-neutral-700">
                      However, you have the ability to accept or decline cookies by
                      modifying the settings in your browser. To manage cookies on
                      your browser follow these guidelines for{" "}
                      <a
                        href="https://support.google.com/chrome/answer/95647"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-700 hover:underline"
                      >
                        Google Chrome
                      </a>
                      ,{" "}
                      <a
                        href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-700 hover:underline"
                      >
                        Mozilla Firefox
                      </a>{" "}
                      and{" "}
                      <a
                        href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-700 hover:underline"
                      >
                        Internet Explorer
                      </a>
                      .
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                      Pixel tags:
                    </h3>
                    <p className="text-neutral-700">
                      These are small objects embedded into a web page, but are not
                      visible. They can also be known as clear gifs, web bugs or tags
                      and are often used in combination with cookies. They allow us to
                      count users who have visited certain pages and to generate
                      statistics about how our site is used. Just like cookies pixel
                      tags also do not contain any information that is personally
                      identifiable. Unlike cookies, you cannot decline pixel tags.
                      However, setting your browser to decline cookies or to prompt
                      you for a response will keep pixel tags from tracking your
                      activity.
                    </p>
                  </div>
                </div>
              </div>
            </SlideIn>

            <SlideIn direction="up" delay={0.3}>
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                  How do we protect your information?
                </h2>
                <p className="text-neutral-700 mb-4">
                  We are committed to protecting your privacy. Broadly speaking, we
                  will not obtain any personally identifying information about you
                  when you visit our site, unless you choose to provide such
                  information to us and nor will such information be ever sold or
                  otherwise transferred to outside parties.
                </p>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                      Personal information:
                    </h3>
                    <p className="text-neutral-700">
                      We do not sell, rent, lease, trade, share or transfer any of
                      your personal information to outside parties. We will not
                      provide any of your personal information to any third party,
                      individual, government agency, or company at any time unless
                      strictly compelled to do so by law.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                      Email:
                    </h3>
                    <p className="text-neutral-700">
                      Every email sent from our organization will clearly state who
                      the email is from and provide clear information on how to contact
                      the sender. In addition, all email messages will also include a
                      method to remove yourself from our mailing list so that you
                      receive no further emails from us.
                    </p>
                  </div>
                </div>
              </div>
            </SlideIn>

            <SlideIn direction="up" delay={0.4}>
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                  How do we use your information?
                </h2>
                <p className="text-neutral-700 mb-4">
                  Any of the information we collect from you may be used in one of the
                  following ways:
                </p>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                      To improve our website, services and personalize your
                      experience:
                    </h3>
                    <p className="text-neutral-700">
                      Your information helps us to better respond to your individual
                      needs as we continually strive to provide you the most
                      appropriate information and services based on the information
                      and feedback, we receive from you.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                      To send periodic emails:
                    </h3>
                    <p className="text-neutral-700">
                      The email address you provide may be used to send you
                      information, respond to inquiries and other requests or
                      questions.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                      To offer Services:
                    </h3>
                    <p className="text-neutral-700">
                      We may use your personal information to offer you Services we
                      believe may be of interest to you, but we will not do so if you
                      tell us not to. We will ensure each email we send includes a
                      method to unsubscribe from our mailing list so that you receive
                      no further emails from us.
                    </p>
                  </div>
                </div>
              </div>
            </SlideIn>

            <SlideIn direction="up" delay={0.5}>
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                  Links to external websites
                </h2>
                <p className="text-neutral-700">
                  Our website contains links to many other websites. If you choose to
                  click on a third-party link, you will be directed to that third
                  party's website. Note that these external websites are not operated
                  by us and have established their own terms of use and privacy
                  policies.
                </p>
                <p className="text-neutral-700 mt-4">
                  As we have no control over their provisions it is very likely their
                  terms and policies may differ greatly from ours, therefore we
                  encourage you to read the privacy policies or statements of the other
                  websites you visit.
                </p>
                <p className="text-neutral-700 mt-4">
                  The fact that we link to a website is not an endorsement,
                  authorization or representation of our affiliation with that third
                  party, nor is it an endorsement of their privacy or information
                  security policies or practices.
                </p>
              </div>
            </SlideIn>

            <SlideIn direction="up" delay={0.6}>
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                  Changes to our privacy policy
                </h2>
                <p className="text-neutral-700 mb-4">
                  We may update our privacy policy from time to time and whenever we
                  decide to change our privacy policy, we will post those changes on
                  this page. These changes are effective immediately, after they are
                  posted on this page. Thus, we advise you to review this page
                  periodically for any changes.
                </p>
                <p className="text-neutral-700">
                  However, please be assured that if the privacy policy changes in the
                  future, we will not use the personal information you have submitted
                  to us under this privacy policy in a manner that is materially
                  inconsistent with this privacy policy, without your prior consent.
                </p>
                <p className="text-neutral-700 mt-4 font-semibold">
                  This policy was last modified on August 18, 2022.
                </p>
              </div>
            </SlideIn>

            <SlideIn direction="up" delay={0.7}>
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                  Online privacy policy only
                </h2>
                <p className="text-neutral-700">
                  This online privacy policy applies only to information collected
                  through our website and not to information collected offline.
                </p>
              </div>
            </SlideIn>

            <SlideIn direction="up" delay={0.8}>
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                  Contacting us
                </h2>
                <p className="text-neutral-700">
                  If you have any question about our privacy policy, please contact us
                  at{" "}
                  <a
                    href="mailto:info@teamamanchawla.com"
                    className="text-primary-700 hover:underline"
                  >
                    info@teamamanchawla.com
                  </a>
                </p>
              </div>
            </SlideIn>

            <SlideIn direction="up" delay={0.9}>
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                  Your consent
                </h2>
                <p className="text-neutral-700">
                  By using our site, you consent to our website privacy policy.
                </p>
              </div>
            </SlideIn>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
