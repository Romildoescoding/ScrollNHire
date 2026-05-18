"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Label } from "./ui/label";
import { Building2 } from "lucide-react";

type College = {
  _id: string;
  name: string;
  domain: string;
};

type CollegeValue = {
  collegeId: string;
  collegeName: string;
};

const LOGO_DEV_KEY = process.env.NEXT_PUBLIC_LOGO_DEV_PUBLIC_KEY!;

export default function CollegeSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: CollegeValue) => void;
}) {
  const [query, setQuery] = useState(value || "");
  const [results, setResults] = useState<College[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selected, setSelected] = useState(false);

  // setting if it already exists you know.
  useEffect(() => {
    if (value !== query) {
      setSelected(!!value);
      setQuery(value || "");
    }
  }, [value]);

  // 🔥 Debounce
  useEffect(() => {
    if (selected) return; // 🛑 stop re-fetch after selecting
    const timer = setTimeout(() => {
      if (query.length >= 3) {
        fetchColleges(query);
      } else {
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, selected]);

  const fetchColleges = async (search: string) => {
    try {
      const res = await fetch(`/api/colleges?search=${search}`);
      const data = await res.json();

      setResults(data);
      if (!selected) setShowDropdown(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelect = (college: College) => {
    setQuery(college.name);

    onChange({
      collegeId: college._id,
      collegeName: college.name,
    });

    setSelected(true);
    setShowDropdown(false);
    ref.current?.blur();
  };

  const handleChange = (val: string) => {
    setQuery(val);
    setSelected(false);
    onChange({ collegeId: "", collegeName: "" });
  };

  const ref = useRef(null);

  const [imgError, setImgError] = useState<Record<string, boolean>>({});

  return (
    <div className="relative w-full flex-1">
      <Label className="mb-2">
        College <span className="text-red-500">*</span>
      </Label>
      <Input
        placeholder="Type your college..."
        ref={ref}
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => query.length >= 3 && setShowDropdown(true)}
      />

      {/* DROPDOWN */}
      {showDropdown && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-[#16161A] border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {results.map((college) => (
            <div
              key={college._id}
              onClick={() => handleSelect(college)}
              className="transition-all px-4 py-2 cursor-pointer flex gap-3 hover:bg-zinc-100 dark:hover:bg-zinc-900 items-center"
            >
              {college.domain && !imgError[college._id] ? (
                <Image
                  src={`https://img.logo.dev/${college.domain}?token=${LOGO_DEV_KEY}`}
                  alt="Company logo"
                  width={24}
                  height={24}
                  onError={() =>
                    setImgError((prev) => ({ ...prev, [college._id]: true }))
                  }
                />
              ) : (
                <div className="h-fit w-fit">
                  <Building2 />
                </div>
              )}
              <span>{college.name}</span>
            </div>
          ))}
        </div>
      )}

      {/* ERROR */}
      {!selected && query.length > 0 && (
        <p className="text-xs text-red-500 mt-1">
          Please select a college from the list
        </p>
      )}
    </div>
  );
}
