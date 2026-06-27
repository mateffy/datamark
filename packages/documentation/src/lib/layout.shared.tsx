import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { DatamarkLogo } from "@/components/logo";

export const gitConfig = {
  user: "mateffy",
  repo: "datamark",
  branch: "main",
};

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <DatamarkLogo className="h-10 w-auto" />,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
