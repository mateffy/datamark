import DefaultSearchDialog from "fumadocs-ui/components/dialog/search-default";
import type { SharedProps } from "fumadocs-ui/contexts/search";

export default function SearchDialog(props: SharedProps) {
  return (
    <DefaultSearchDialog
      {...props}
      type="static"
      api="/api/search"
    />
  );
}
