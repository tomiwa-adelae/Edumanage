"use client";

import { Input } from "@/components/ui/input";
import { LoaderCircleIcon, SearchIcon, X } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "./ui/label";

interface Props {
  placeholder?: string;
  label?: string;
}

export const SearchBar = ({ placeholder = "Search...", label }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState(() => searchParams.get("search") || "");

  // Sync query state with URL search param
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    setQuery(urlSearch);
  }, [searchParams]);

  // Debounced update to URL
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentSearch =
        new URLSearchParams(window.location.search).get("search") || "";

      // Only update URL if query has actually changed
      if (query.trim() !== currentSearch) {
        startTransition(() => {
          const params = new URLSearchParams(window.location.search);

          if (query.trim()) {
            params.set("search", query.trim());
          } else {
            params.delete("search");
          }

          // Reset to page 1 when searching
          params.set("page", "1");

          router.replace(`?${params.toString()}`, { scroll: false });
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleClear = () => {
    setQuery("");
  };

  return (
    <div className="w-full">
      {label && <Label className="mb-2 block">{label}</Label>}
      <div className="flex items-center relative justify-between bg-muted rounded-md">
        <Input
          className="peer ps-9 pe-9"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
        />
        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
          {isPending ? (
            <LoaderCircleIcon
              className="animate-spin"
              size={16}
              role="status"
              aria-label="Loading..."
            />
          ) : (
            <SearchIcon size={16} aria-hidden="true" />
          )}
        </div>
        {query && (
          <Button
            size="icon"
            variant={"ghost"}
            className="absolute right-1"
            onClick={handleClear}
          >
            <X />
          </Button>
        )}
      </div>
    </div>
  );
};
