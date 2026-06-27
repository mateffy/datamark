import { createFileRoute } from "@tanstack/react-router";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/lib/layout.shared";
import { LandingPage } from "@/components/landing-page";

export const Route = createFileRoute("/landing")({
  component: Landing,
});

function Landing() {
  return (
    <HomeLayout {...baseOptions()}>
      <LandingPage />
    </HomeLayout>
  );
}
