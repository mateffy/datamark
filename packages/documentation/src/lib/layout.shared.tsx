import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export const gitConfig = {
  user: "mateffy",
  repo: "datamark",
  branch: "main",
};

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="inline-block mr-2"
          >
            <rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.9" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.6" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.6" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" opacity="0.3" />
          </svg>
          <span className="font-medium">datamark</span>
        </>
      ),
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
