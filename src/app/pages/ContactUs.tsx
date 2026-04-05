import { Helmet } from "react-helmet-async";
import { Mail, Send } from "lucide-react";
import { FORMSUBMIT_CONTACT_ACTION } from "../constants/contact";
import { Button } from "../components/ui/button";

export function ContactUs() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Helmet>
        <title>Contact Us | Infusion Sensei</title>
        <meta
          name="description"
          content="Contact Infusion Sensei for support, bug reports, and feature requests."
        />
      </Helmet>

      <section className="bg-white border border-green-200 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <Mail className="w-6 h-6 text-green-700" />
          <h1 className="text-3xl font-black text-gray-900">Contact Us</h1>
        </div>
        <p className="text-gray-600 mb-6">
          Send us your questions, bug reports, or feature ideas. We read every message.
        </p>

        <form
          action={FORMSUBMIT_CONTACT_ACTION}
          method="POST"
          className="space-y-4"
        >
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_subject" value="Infusion Sensei Contact Form" />

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
            <input
              required
              name="name"
              type="text"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
            <input
              required
              name="email"
              type="email"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Subject</label>
            <input
              required
              name="subject"
              type="text"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="What can we help with?"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Message</label>
            <textarea
              required
              name="message"
              rows={6}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Write your message here..."
            />
          </div>

          <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold">
            <Send className="w-4 h-4 mr-2" /> Send Message
          </Button>
        </form>

        <p className="text-xs text-gray-500 mt-4">
          Direct email:{" "}
          <a className="text-green-700 font-semibold underline" href="mailto:senseiselector@gmail.com">
            senseiselector@gmail.com
          </a>
        </p>
      </section>
    </div>
  );
}

