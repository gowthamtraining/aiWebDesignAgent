import { VerifyEmail } from "@insforge/nextjs";

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  return (
    <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <VerifyEmail token={searchParams.token || ""} />
    </div>
  );
}
