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
import { useSession } from "next-auth/react";

export default function StudentOnboarding({ onNext }: { onNext: any }) {
  const { data: session } = useSession();

  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    // dob: "",
    gender: "",
    // collegeId: "",
    // collegeName: "",
    // rollno: "",
  });

  const [errors, setErrors] = useState<any>({});
  //   const [colleges, setColleges] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: any = {};

    if (!form.firstName) newErrors.firstName = "First name is required";
    if (!form.lastName) newErrors.lastName = "Last name is required";
    // if (!form.dob) newErrors.dob = "Date of birth is required";
    if (!form.gender) newErrors.gender = "Please select a gender";
    // if (!form.collegeId) {
    //   newErrors.college = "Please select a college from the list";
    // }
    // if (!form.rollno) {
    //   newErrors.rollno = "Please enter you rollno";
    // }

    return newErrors;
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!session?.user?.email) {
      console.error("No user session found");
      return;
    }
    const validationErrors = validate();
    setErrors(validationErrors);
    setSubmitted(true);

    console.log(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        // 🧠 transform form → backend format
        const payload = {
          name: [form.firstName, form.middleName, form.lastName]
            .filter(Boolean)
            .join(" "),
          gender: form.gender,
        };

        const res = await fetch("/api/user", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: session.user.email,
            ...payload,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          console.error(data.error);
          return;
        }

        // const res2 = await fetch("/api/profile/student", {
        //   method: "PATCH",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({
        //     userId: session.user.id,
        //     collegeId: form.collegeId,
        //     rollno: form.rollno,
        //   }),
        // });

        // const data2 = await res2.json();
        // if (!res2.ok) {
        //   console.error(data2.error);
        //   return;
        // }

        console.log("✅ Updated user:", data.user);
        // console.log("✅ Updated student profile:", data2.profile);

        onNext(form);
      } catch (err) {
        console.error("❌ Update failed:", err);
      } finally {
        setLoading(false);
      }
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
        <div className="flex w-full gap-6">
          {/* <div className="space-y-2 w-full max-w-52">
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
          </div> */}

          {/* GENDER */}
          {/* <div className="space-y-2"> */}
          <div className="space-y-2 w-full">
            <Label>
              Gender <span className="text-red-500">*</span>
            </Label>
            {/* <Select
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
            </Select> */}
            <div className="flex w-full justify-between gap-3 items-center">
              {["male", "female", "other"].map((gender) => (
                <Button
                  key={gender}
                  variant={"outline"}
                  className={`${form.gender === gender ? "text-neutral-800 border-2 border-neutral-800" : "text-neutral-500 border border-neutral-200"} shadom-sm capitalize flex-1`}
                  onClick={() => setForm({ ...form, gender })}
                >
                  {gender}
                </Button>
              ))}
            </div>

            {submitted && errors.gender && (
              <p className="text-red-500 text-sm">{errors.gender}</p>
            )}
          </div>

          {/* COLLEGE */}
          {/* <CollegeSelect
            value={form.collegeName}
            onChange={(college) =>
              setForm({
                ...form,
                collegeId: college.collegeId,
                collegeName: college.collegeName,
              })
            }
          /> */}
        </div>

        {/* {form.collegeId && (
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
        )} */}

        {/* SUBMIT */}
        {/* <Button onClick={handleSubmit} disabled={!isValid} className="w-full"> */}
        <Button onClick={handleSubmit} className="w-full">
          Continue
          {loading && (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
        </Button>
      </div>
    </>
  );
}
