"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CollegeSelect from "./college-select";

export default function StudentOnboarding({ onNext }: { onNext: any }) {
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    dob: "",
    gender: "",
    collegeId: "",
    collegeName: "",
    rollno: "",
  });

  const [errors, setErrors] = useState<any>({});
  //   const [colleges, setColleges] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: any = {};

    if (!form.firstName) newErrors.firstName = "First name is required";
    if (!form.lastName) newErrors.lastName = "Last name is required";
    if (!form.dob) newErrors.dob = "Date of birth is required";
    if (!form.gender) newErrors.gender = "Please select a gender";
    if (!form.collegeId) {
      newErrors.college = "Please select a college from the list";
    }
    if (!form.rollno) {
      newErrors.rollno = "Please enter you rollno";
    }

    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    setErrors(validationErrors);
    setSubmitted(true);

    if (Object.keys(validationErrors).length === 0) {
      onNext(form);
    }
  };

  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const validationErrors = validate();
    setIsValid(Object.keys(validationErrors).length === 0);
  }, [form]);

  //   const hasErrors = Object.keys(validate()).length > 0;

  return (
    <>
      <div className="flex flex-col flex-1 pt-2">
        <header className="text-center mb-8">
          <h1
            className={`font-playfair text-slate-900 dark:text-slate-100 text-4xl italic leading-tight mb-2`}
          >
            Basic details
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base">
            {`Let's get you started with the basic information.`}
          </p>
        </header>
      </div>

      <div className="space-y-6 max-w-xl mx-auto">
        {/* NAME */}
        <div className="space-y-2">
          <Label>
            Full Name <span className="text-red-500">*</span>
          </Label>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <Input
                placeholder="First Name"
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
              />
              {submitted && errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <Input
                placeholder="Middle Name"
                value={form.middleName}
                onChange={(e) =>
                  setForm({ ...form, middleName: e.target.value })
                }
              />
            </div>

            <div>
              <Input
                placeholder="Last Name"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
              {submitted && errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>
        </div>

        {/* DOB */}
        <div className="flex justify-between w-full gap-2">
          <div className="space-y-2 w-full max-w-52">
            <Label>
              Date of Birth <span className="text-red-500">*</span>
            </Label>
            <Input
              type="date"
              value={form.dob}
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
            />
            {submitted && errors.dob && (
              <p className="text-red-500 text-sm">{errors.dob}</p>
            )}
          </div>

          {/* GENDER */}
          <div className="space-y-2">
            <Label>
              Gender <span className="text-red-500">*</span>
            </Label>
            <Select
              onValueChange={(value) => setForm({ ...form, gender: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            {submitted && errors.gender && (
              <p className="text-red-500 text-sm">{errors.gender}</p>
            )}
          </div>
        </div>

        {/* COLLEGE */}
        <CollegeSelect
          value={form.collegeName}
          onChange={(college) =>
            setForm({
              ...form,
              collegeId: college.collegeId,
              collegeName: college.collegeName,
            })
          }
        />

        {form.collegeId && (
          <div className="space-y-2">
            <Label>
              Institute Roll Number / University ID Number / USN{" "}
              <span className="text-red-500">*</span>
            </Label>
            <div>
              <Input
                placeholder="Roll Number"
                value={form.rollno}
                onChange={(e) => setForm({ ...form, rollno: e.target.value })}
              />
              {submitted && errors.rollno && (
                <p className="text-red-500 text-sm mt-1">{errors.rollno}</p>
              )}
            </div>
          </div>
        )}

        {/* SUBMIT */}
        <Button onClick={handleSubmit} disabled={!isValid} className="w-full">
          Continue
        </Button>
      </div>
    </>
  );
}
