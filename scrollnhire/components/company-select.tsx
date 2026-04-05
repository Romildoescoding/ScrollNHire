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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length >= 3) fetchCompanies(query);
      else setResults([]);
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  const fetchCompanies = async (search: string) => {
    try {
      const res = await fetch(`/api/company?search=${search}`);
      const data = await res.json();
      setResults(data);
      setShowDropdown(true);
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
        <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {results.map((company) => (
            <div
              key={company._id}
              onClick={() => handleSelect(company)}
              className="px-4 py-2 cursor-pointer hover:bg-primary/10 flex gap-3 items-center"
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
