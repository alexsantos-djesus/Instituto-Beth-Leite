import { Suspense } from "react";
import Container from "@/components/Container";
import ResetPasswordClient from "./ResetPasswordClient";

export default function ResetPasswordPage() {
  return (
    <Container className="py-10">
      <Suspense fallback={<p>Carregando…</p>}>
        <ResetPasswordClient />
      </Suspense>
    </Container>
  );
}
