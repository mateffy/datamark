import { createFileRoute } from "@tanstack/react-router";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/lib/layout.shared";
import { LandingPage } from "@/components/landing-page";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <HomeLayout {...baseOptions()}>
      <LandingPage />
    </HomeLayout>
  );
}
