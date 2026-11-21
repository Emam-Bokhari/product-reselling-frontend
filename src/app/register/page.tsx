import { Suspense } from "react";
import RegistrationForm from "@/components/modules/Auth/Register/RegistrationForm";

export default function RegistrationPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">Loading...</div>}>
      <RegistrationForm />
    </Suspense>
  );
}
