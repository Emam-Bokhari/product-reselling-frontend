import ContactUsForm from "@/components/modules/Contact";
import { Fragment } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | ResellBD - Support & Help Center",
  description:
    "Get in touch with ResellBD customer support team in Bangladesh. Reach us via WhatsApp live chat, phone, email, or visit our office in Dhanmondi, Dhaka.",
};

export default function ContactUsPage() {
  return (
    <Fragment>
      <ContactUsForm />
    </Fragment>
  );
}
