"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Label } from "./ui/label";

type Company = {
  _id: string;
  name: string;
  domain: string;
};

type CompanyValue = {
  companyId: string;
  companyName: string;
};

const LOGO_DEV_KEY = process.env.NEXT_PUBLIC_LOGO_DEV_PUBLIC_KEY!;

export default function CompanySelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: CompanyValue) => void;
}) {
  const [query, setQuery] = useState(value || "");
  const [results, setResults] = useState<Company[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selected, setSelected] = useState(false);

  const ref = useRef<HTMLInputElement>(null);

  // setting if it already exists you know.
  useEffect(() => {
    if (value !== query) {
      setSelected(!!value);
      setQuery(value || "");
    }
  }, [value]);

  useEffect(() => {
    if (selected) return; // 🛑 stop re-fetch after selecting
    const timer = setTimeout(() => {
      if (query.length >= 3) fetchCompanies(query);
      else setResults([]);
    }, 400);

    return () => clearTimeout(timer);
  }, [query, selected]);

  const fetchCompanies = async (search: string) => {
    try {
      const res = await fetch(`/api/company?search=${search}`);
      const data = await res.json();
      setResults(data);
      if (!selected) setShowDropdown(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelect = (company: Company) => {
    setQuery(company.name);

    onChange({
      companyId: company._id,
      companyName: company.name,
    });

    setSelected(true);
    setShowDropdown(false);
    ref.current?.blur();
  };

  const handleChange = (val: string) => {
    setQuery(val);
    setSelected(false);
    onChange({ companyId: "", companyName: "" });
  };

  return (
    <div className="relative w-full">
      <Label className="mb-2">
        Company <span className="text-red-500">*</span>
      </Label>

      <Input
        ref={ref}
        value={query}
        placeholder="Type your company..."
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => query.length >= 3 && setShowDropdown(true)}
      />

      {showDropdown && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-[#16161A] border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {results.map((company) => (
            <div
              key={company._id}
              onClick={() => handleSelect(company)}
              className="transition-all px-4 py-2 cursor-pointer flex gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-900 items-center"
            >
              <Image
                src={`https://img.logo.dev/${company.domain}?token=${LOGO_DEV_KEY}`}
                alt="logo"
                width={20}
                height={20}
              />
              {company.name}
            </div>
          ))}
        </div>
      )}

      {!selected && query.length > 0 && (
        <p className="text-xs text-red-500 mt-1">
          Please select a company from the list
        </p>
      )}
    </div>
  );
}
