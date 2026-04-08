import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Upload,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  HelpCircle,
  LinkIcon,
  CheckSquare,
  Loader2,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
interface EducationEntry {
  id: number;
  schoolName: string;
  qualification: string;
  fieldOfStudy: string;
  yearCompleted: string;
}

interface WorkEntry {
  id: number;
  companyName: string;
  jobTitle: string;
  from: string;
  to: string;
  isCurrent: boolean; // FIX: added "I currently work here" support
}

interface FormData {
  firstName: string;
  middleName: string;
  lastName: string;
  phoneNumber: string;
  emailAddress: string;
  ghanaPostAddress: string;
  city: string;
  region: string;
  legallyAuthorized: string;
  requiresVisa: string;
  workHistory: WorkEntry[];
  education: EducationEntry[];
  certifications: string;
  screeningAnswers: {
    hasExperience: string;
    experienceArea: string;
    yearsOfExperience: string;
    willingToRelocate: string;
    salaryExpectation: string;
  };
  resumeFile: File | null;
  coverLetterFile: File | null;
  certificatesFile: File | null;
  hearAboutUs: string;
  hearAboutUsOther: string;
  declaration: boolean;
}

// FIX: per-field validation errors type
interface FormErrors {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  emailAddress?: string;
  legallyAuthorized?: string;
  requiresVisa?: string;
  resumeFile?: string;
  declaration?: string;
  workHistory?: { id: number; from?: string; to?: string }[];
}

const REGIONS = [
  "Greater Accra", "Ashanti", "Western", "Central", "Eastern",
  "Northern", "Upper East", "Upper West", "Volta", "Brong-Ahafo",
  "Oti", "Bono East", "Ahafo", "Savannah", "North East", "Western North",
];

const HEAR_ABOUT_OPTIONS = [
  { value: "job_boards", label: "Job Boards (LinkedIn, Indeed, Glassdoor, ZipRecruiter)" },
  { value: "company_website", label: "Company Website (Careers Page)" },
  { value: "social_media", label: "Social Media (Twitter/X, Facebook, Instagram)" },
  { value: "employee_referral", label: "Employee Referral" },
  { value: "recruiter", label: "Recruiter/Agency (External headhunter)" },
  { value: "university", label: "University/Campus Event" },
  { value: "professional_association", label: "Professional Association" },
  { value: "other", label: "Other" },
];

// FIX: Ghana phone regex — accepts +233XXXXXXXXX or 0XXXXXXXXX (9 digits after prefix)
const GHANA_PHONE_REGEX = /^(\+233|0)[2-9]\d{8}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── Generic entries hook ───────────────────────────────────────────────────
// FIX: replaces duplicated add/remove/update logic for work & education
function useEntries<T extends { id: number }>(initial: T[]) {
  const [entries, setEntries] = useState<T[]>(initial);

  const add = (blank: Omit<T, "id">) =>
    setEntries((prev) => [...prev, { ...blank, id: Date.now() } as T]);

  const remove = (id: number) =>
    setEntries((prev) => prev.filter((e) => e.id !== id));

  const update = (id: number, field: keyof T, value: T[keyof T]) =>
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );

  return { entries, setEntries, add, remove, update };
}

// ── Section Wrapper ─────────────────────────────────────────────────────────
const Section = ({
  title,
  icon,
  number,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  number: number;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(true);
  const sectionId = `section-${number}-content`;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* FIX: aria-expanded + aria-controls for screen readers */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={sectionId}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-amber-400 text-white text-xs font-bold flex items-center justify-center shrink-0">
            {number}
          </span>
          <span className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-wide">
            {icon}
            {title}
          </span>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-gray-400" aria-hidden="true" />
          : <ChevronDown className="w-4 h-4 text-gray-400" aria-hidden="true" />}
      </button>
      {/* FIX: aria-hidden on collapsed content */}
      <div
        id={sectionId}
        aria-hidden={!open}
        className={open ? "px-6 pb-6 pt-2" : "hidden"}
      >
        {children}
      </div>
    </div>
  );
};

// ── Field Label ─────────────────────────────────────────────────────────────
const Label = ({
  children,
  required,
  htmlFor,
}: {
  children: React.ReactNode;
  required?: boolean;
  htmlFor?: string;
}) => (
  <label
    htmlFor={htmlFor}
    className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5"
  >
    {children}
    {required && <span className="text-red-400 ml-1" aria-hidden="true">*</span>}
  </label>
);

// ── Inline field error ──────────────────────────────────────────────────────
// FIX: shows per-field errors instead of toast-only
const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <p role="alert" className="text-xs text-red-500 mt-1">{message}</p>
  ) : null;

// ── File Upload Button ──────────────────────────────────────────────────────
const FileUpload = ({
  label,
  required,
  file,
  onChange,
  error,
  inputId,
}: {
  label: string;
  required?: boolean;
  file: File | null;
  onChange: (f: File | null) => void;
  error?: string;
  inputId: string;
}) => (
  <div>
    <Label required={required} htmlFor={inputId}>{label}</Label>
    <label
      htmlFor={inputId}
      className={`flex items-center gap-3 cursor-pointer border-2 border-dashed rounded-xl px-4 py-3 transition-colors group ${
        error ? "border-red-300" : "border-gray-200 hover:border-amber-400"
      }`}
    >
      <Upload className="w-4 h-4 text-gray-400 group-hover:text-amber-500 shrink-0" aria-hidden="true" />
      <span className="text-sm text-gray-500 truncate">
        {file ? file.name : "Click to upload"}
      </span>
      <input
        id={inputId}
        type="file"
        className="hidden"
        aria-required={required}
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
      {file && (
        <button
          type="button"
          aria-label="Remove file"
          onClick={(e) => { e.preventDefault(); onChange(null); }}
          className="ml-auto text-gray-400 hover:text-red-400"
        >
          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      )}
    </label>
    <FieldError message={error} />
  </div>
);

// ── Main Component ──────────────────────────────────────────────────────────
const JobApplicationForm = ({
  jobTitle = "Software Engineer",
  onClose,
  apiEndpoint = "/api/applications", // FIX: configurable endpoint
}: {
  jobTitle?: string;
  onClose?: () => void;
  apiEndpoint?: string;
}) => {
  const [form, setForm] = useState<FormData>({
    firstName: "", middleName: "", lastName: "",
    phoneNumber: "", emailAddress: "", ghanaPostAddress: "",
    city: "", region: "",
    legallyAuthorized: "", requiresVisa: "",
    certifications: "",
    screeningAnswers: {
      hasExperience: "", experienceArea: "", yearsOfExperience: "",
      willingToRelocate: "", salaryExpectation: "",
    },
    resumeFile: null, coverLetterFile: null, certificatesFile: null,
    hearAboutUs: "", hearAboutUsOther: "",
    declaration: false,
    // these are managed separately via useEntries below
    workHistory: [],
    education: [],
  });

  // FIX: use generic hook instead of duplicated helpers
  const work = useEntries<WorkEntry>([
    { id: Date.now(), companyName: "", jobTitle: "", from: "", to: "", isCurrent: false },
  ]);
  const edu = useEntries<EducationEntry>([
    { id: Date.now() + 1, schoolName: "", qualification: "", fieldOfStudy: "", yearCompleted: "" },
  ]);

  // FIX: per-field error state
  const [errors, setErrors] = useState<FormErrors>({});

  // FIX: submission loading state to prevent double-submit
  const [isSubmitting, setIsSubmitting] = useState(false);

  const set = <K extends keyof FormData>(field: K, value: FormData[K]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const setScreening = (field: keyof FormData["screeningAnswers"], value: string) =>
    setForm((prev) => ({
      ...prev,
      screeningAnswers: { ...prev.screeningAnswers, [field]: value },
    }));

  // FIX: full validation with per-field messages
  const validate = (): FormErrors => {
    const e: FormErrors = {};

    if (!form.firstName.trim()) e.firstName = "First name is required.";
    if (!form.lastName.trim()) e.lastName = "Last name is required.";

    if (!form.emailAddress.trim()) {
      e.emailAddress = "Email address is required.";
    } else if (!EMAIL_REGEX.test(form.emailAddress)) {
      e.emailAddress = "Please enter a valid email address.";
    }

    if (!form.phoneNumber.trim()) {
      e.phoneNumber = "Phone number is required.";
    } else if (!GHANA_PHONE_REGEX.test(form.phoneNumber.replace(/\s/g, ""))) {
      e.phoneNumber = "Enter a valid Ghana number, e.g. +233 20 000 0000.";
    }

    if (!form.legallyAuthorized) e.legallyAuthorized = "Please select an option.";
    if (!form.requiresVisa) e.requiresVisa = "Please select an option.";
    if (!form.resumeFile) e.resumeFile = "Please upload your Resume/CV.";
    if (!form.declaration) e.declaration = "You must accept the declaration to proceed.";

    // FIX: validate work date ranges
    const workErrors = work.entries
      .filter((w) => w.from && w.to && !w.isCurrent && w.to < w.from)
      .map((w) => ({ id: w.id, to: "End date cannot be before start date." }));
    if (workErrors.length > 0) e.workHistory = workErrors;

    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors before submitting.", {
        position: "top-right",
        style: { color: "#ef4444" },
      });
      // Scroll to first error
      document.querySelector("[data-error]")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      // FIX: use FormData to handle file uploads correctly
      const payload = new FormData();

      // Text fields
      const textFields: (keyof FormData)[] = [
        "firstName", "middleName", "lastName", "phoneNumber", "emailAddress",
        "ghanaPostAddress", "city", "region", "legallyAuthorized", "requiresVisa",
        "certifications", "hearAboutUs", "hearAboutUsOther",
      ];
      textFields.forEach((f) => payload.append(f, String(form[f] ?? "")));

      payload.append("declaration", String(form.declaration));
      payload.append("screeningAnswers", JSON.stringify(form.screeningAnswers));
      payload.append("workHistory", JSON.stringify(work.entries));
      payload.append("education", JSON.stringify(edu.entries));

      // File fields
      if (form.resumeFile) payload.append("resumeFile", form.resumeFile);
      if (form.coverLetterFile) payload.append("coverLetterFile", form.coverLetterFile);
      if (form.certificatesFile) payload.append("certificatesFile", form.certificatesFile);

      const response = await fetch(apiEndpoint, {
        method: "POST",
        body: payload,
        // Do NOT set Content-Type — browser sets multipart boundary automatically
      });

      if (!response.ok) {
        // FIX: handle HTTP error responses from the API
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message ?? `Server error: ${response.status}`);
      }

      toast.success("Application submitted successfully!", {
        position: "top-right",
        style: { color: "#237227" },
      });
      onClose?.();
    } catch (err) {
      // FIX: show meaningful error if network or API fails
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast.error(message, { position: "top-right", style: { color: "#ef4444" } });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWorkError = (id: number, field: "from" | "to") =>
    errors.workHistory?.find((w) => w.id === id)?.[field];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} noValidate className="max-w-3xl mx-auto flex flex-col gap-5">

        {/* Header */}
        <div className="bg-[#222d32] rounded-2xl px-6 py-6 flex items-center justify-between">
          <div>
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-widest mb-1">
              CalBank PLC — Recruitment Portal
            </p>
            <h1 className="text-white text-xl sm:text-2xl font-bold">Job Application Form</h1>
            <p className="text-gray-400 text-sm mt-1">{jobTitle}</p>
          </div>
          <FileText className="w-10 h-10 text-amber-400 shrink-0" aria-hidden="true" />
        </div>

        {/* 1. Applicant Information */}
        <Section number={1} title="Applicant Information" icon={<User className="w-4 h-4" aria-hidden="true" />}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div data-error={errors.firstName ? true : undefined}>
              <Label required htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={form.firstName}
                onChange={(e) => set("firstName", e.target.value)}
                placeholder="John"
                className={`text-sm ${errors.firstName ? "border-red-300 focus-visible:ring-red-300" : ""}`}
                aria-invalid={!!errors.firstName}
                aria-describedby={errors.firstName ? "firstName-error" : undefined}
              />
              <FieldError message={errors.firstName} />
            </div>
            <div>
              <Label htmlFor="middleName">
                Middle Name{" "}
                <span className="text-gray-400 font-normal normal-case">(optional)</span>
              </Label>
              <Input id="middleName" value={form.middleName} onChange={(e) => set("middleName", e.target.value)} placeholder="Michael" className="text-sm" />
            </div>
            <div data-error={errors.lastName ? true : undefined}>
              <Label required htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={form.lastName}
                onChange={(e) => set("lastName", e.target.value)}
                placeholder="Doe"
                className={`text-sm ${errors.lastName ? "border-red-300 focus-visible:ring-red-300" : ""}`}
                aria-invalid={!!errors.lastName}
              />
              <FieldError message={errors.lastName} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div data-error={errors.phoneNumber ? true : undefined}>
              <Label required htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={form.phoneNumber}
                onChange={(e) => set("phoneNumber", e.target.value)}
                placeholder="+233 20 000 0000"
                className={`text-sm ${errors.phoneNumber ? "border-red-300 focus-visible:ring-red-300" : ""}`}
                aria-invalid={!!errors.phoneNumber}
              />
              <FieldError message={errors.phoneNumber} />
            </div>
            <div data-error={errors.emailAddress ? true : undefined}>
              <Label required htmlFor="emailAddress">Email Address</Label>
              <Input
                id="emailAddress"
                type="email"
                value={form.emailAddress}
                onChange={(e) => set("emailAddress", e.target.value)}
                placeholder="john@example.com"
                className={`text-sm ${errors.emailAddress ? "border-red-300 focus-visible:ring-red-300" : ""}`}
                aria-invalid={!!errors.emailAddress}
              />
              <FieldError message={errors.emailAddress} />
            </div>
          </div>
          <div className="mb-4">
            <Label htmlFor="ghanaPostAddress">Ghana Post Address</Label>
            <Input id="ghanaPostAddress" value={form.ghanaPostAddress} onChange={(e) => set("ghanaPostAddress", e.target.value)} placeholder="GA-XXX-XXXX" className="text-sm" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Accra" className="text-sm" />
            </div>
            <div>
              <Label htmlFor="region">Region</Label>
              <select
                id="region"
                value={form.region}
                onChange={(e) => set("region", e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="">Select region</option>
                {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
        </Section>

        {/* 2. Work Eligibility */}
        <Section number={2} title="Work Eligibility" icon={<CheckSquare className="w-4 h-4" aria-hidden="true" />}>
          <div className="flex flex-col gap-4">
            {/* FIX: fieldset + legend for radio groups */}
            <fieldset>
              <legend className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Are you legally authorized to work in this country?{" "}
                <span className="text-red-400" aria-hidden="true">*</span>
              </legend>
              <div className="flex gap-6 mt-1">
                {["Yes", "No"].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                    <input
                      type="radio"
                      name="legallyAuthorized"
                      value={opt}
                      checked={form.legallyAuthorized === opt}
                      onChange={() => set("legallyAuthorized", opt)}
                      className="accent-amber-400"
                    />
                    {opt}
                  </label>
                ))}
              </div>
              <FieldError message={errors.legallyAuthorized} />
            </fieldset>

            <fieldset>
              <legend className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Do you require visa sponsorship?{" "}
                <span className="text-red-400" aria-hidden="true">*</span>
              </legend>
              <div className="flex gap-6 mt-1">
                {["Yes", "No"].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                    <input
                      type="radio"
                      name="requiresVisa"
                      value={opt}
                      checked={form.requiresVisa === opt}
                      onChange={() => set("requiresVisa", opt)}
                      className="accent-amber-400"
                    />
                    {opt}
                  </label>
                ))}
              </div>
              <FieldError message={errors.requiresVisa} />
            </fieldset>
          </div>
        </Section>

        {/* 3. Employment History */}
        <Section number={3} title="Employment History" icon={<Briefcase className="w-4 h-4" aria-hidden="true" />}>
          <div className="flex flex-col gap-5">
            {work.entries.map((w, idx) => (
              <div key={w.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50 relative">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Experience {idx + 1}</span>
                  {work.entries.length > 1 && (
                    <button
                      type="button"
                      aria-label={`Remove experience ${idx + 1}`}
                      onClick={() => work.remove(w.id)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <Label htmlFor={`work-company-${w.id}`}>Company Name</Label>
                    <Input id={`work-company-${w.id}`} value={w.companyName} onChange={(e) => work.update(w.id, "companyName", e.target.value)} placeholder="Acme Corp" className="text-sm" />
                  </div>
                  <div>
                    <Label htmlFor={`work-title-${w.id}`}>Job Title</Label>
                    <Input id={`work-title-${w.id}`} value={w.jobTitle} onChange={(e) => work.update(w.id, "jobTitle", e.target.value)} placeholder="Software Engineer" className="text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <Label htmlFor={`work-from-${w.id}`}>From</Label>
                    <Input id={`work-from-${w.id}`} type="month" value={w.from} onChange={(e) => work.update(w.id, "from", e.target.value)} className="text-sm" />
                    <FieldError message={getWorkError(w.id, "from")} />
                  </div>
                  <div>
                    {/* FIX: disable "To" when currently employed here */}
                    <Label htmlFor={`work-to-${w.id}`}>To</Label>
                    <Input
                      id={`work-to-${w.id}`}
                      type="month"
                      value={w.isCurrent ? "" : w.to}
                      onChange={(e) => work.update(w.id, "to", e.target.value)}
                      disabled={w.isCurrent}
                      className="text-sm disabled:opacity-40"
                    />
                    <FieldError message={getWorkError(w.id, "to")} />
                  </div>
                </div>
                {/* FIX: "I currently work here" checkbox */}
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={w.isCurrent}
                    onChange={(e) => work.update(w.id, "isCurrent", e.target.checked as unknown as boolean)}
                    className="accent-amber-400"
                  />
                  I currently work here
                </label>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                work.add({ companyName: "", jobTitle: "", from: "", to: "", isCurrent: false })
              }
              className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 font-semibold self-start transition-colors"
            >
              <Plus className="w-4 h-4" aria-hidden="true" /> Add another experience
            </button>
          </div>
        </Section>

        {/* 4. Education */}
        <Section number={4} title="Education" icon={<GraduationCap className="w-4 h-4" aria-hidden="true" />}>
          <p className="text-xs text-gray-400 italic mb-4">List most recent first</p>
          <div className="flex flex-col gap-5">
            {edu.entries.map((e, idx) => (
              <div key={e.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Institution {idx + 1}</span>
                  {edu.entries.length > 1 && (
                    <button
                      type="button"
                      aria-label={`Remove institution ${idx + 1}`}
                      onClick={() => edu.remove(e.id)}
                      className="text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div>
                    <Label htmlFor={`edu-school-${e.id}`}>School Name</Label>
                    <Input id={`edu-school-${e.id}`} value={e.schoolName} onChange={(ev) => edu.update(e.id, "schoolName", ev.target.value)} placeholder="University of Ghana" className="text-sm" />
                  </div>
                  <div>
                    <Label htmlFor={`edu-qual-${e.id}`}>Qualification</Label>
                    <Input id={`edu-qual-${e.id}`} value={e.qualification} onChange={(ev) => edu.update(e.id, "qualification", ev.target.value)} placeholder="BSc Computer Science" className="text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor={`edu-field-${e.id}`}>Field of Study</Label>
                    <Input id={`edu-field-${e.id}`} value={e.fieldOfStudy} onChange={(ev) => edu.update(e.id, "fieldOfStudy", ev.target.value)} placeholder="Computer Science" className="text-sm" />
                  </div>
                  <div>
                    <Label htmlFor={`edu-year-${e.id}`}>Year Completed</Label>
                    <Input id={`edu-year-${e.id}`} type="number" min="1950" max="2099" value={e.yearCompleted} onChange={(ev) => edu.update(e.id, "yearCompleted", ev.target.value)} placeholder="2022" className="text-sm" />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => edu.add({ schoolName: "", qualification: "", fieldOfStudy: "", yearCompleted: "" })}
              className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700 font-semibold self-start transition-colors"
            >
              <Plus className="w-4 h-4" aria-hidden="true" /> Add another institution
            </button>
          </div>
        </Section>

        {/* 5. Relevant Certifications */}
        <Section number={5} title="Relevant Certifications" icon={<FileText className="w-4 h-4" aria-hidden="true" />}>
          <Label htmlFor="certifications">
            Certifications{" "}
            <span className="text-gray-400 font-normal normal-case">(optional)</span>
          </Label>
          <textarea
            id="certifications"
            value={form.certifications}
            onChange={(e) => set("certifications", e.target.value)}
            rows={3}
            placeholder="List any relevant certifications, e.g. AWS Certified Developer, PMP..."
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
          />
        </Section>

        {/* 6. Screening Questions */}
        <Section number={6} title="Screening Questions" icon={<HelpCircle className="w-4 h-4" aria-hidden="true" />}>
          <p className="text-xs text-gray-400 italic mb-4">Role-specific · Max 5 · Knockout or screening</p>
          <div className="flex flex-col gap-4">
            {/* FIX: fieldset + legend for radio group */}
            <fieldset>
              <legend className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Do you have experience in a specific skill/area?
              </legend>
              <div className="flex gap-4 mb-2">
                {["Yes", "No"].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                    <input
                      type="radio"
                      name="hasExperience"
                      value={opt}
                      checked={form.screeningAnswers.hasExperience === opt}
                      onChange={() => setScreening("hasExperience", opt)}
                      className="accent-amber-400"
                    />
                    {opt}
                  </label>
                ))}
              </div>
              {form.screeningAnswers.hasExperience === "Yes" && (
                <Input
                  value={form.screeningAnswers.experienceArea}
                  onChange={(e) => setScreening("experienceArea", e.target.value)}
                  placeholder="Please explain..."
                  className="text-sm"
                  aria-label="Describe your experience area"
                />
              )}
            </fieldset>

            <div>
              <Label htmlFor="yearsOfExperience">Years of relevant experience</Label>
              <Input
                id="yearsOfExperience"
                value={form.screeningAnswers.yearsOfExperience}
                onChange={(e) => setScreening("yearsOfExperience", e.target.value)}
                placeholder="e.g. 3"
                className="text-sm"
              />
            </div>

            <fieldset>
              <legend className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Are you willing to relocate?
              </legend>
              <div className="flex gap-4">
                {["Yes", "No"].map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                    <input
                      type="radio"
                      name="willingToRelocate"
                      value={opt}
                      checked={form.screeningAnswers.willingToRelocate === opt}
                      onChange={() => setScreening("willingToRelocate", opt)}
                      className="accent-amber-400"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <Label htmlFor="salaryExpectation">Salary Expectations</Label>
              <Input
                id="salaryExpectation"
                value={form.screeningAnswers.salaryExpectation}
                onChange={(e) => setScreening("salaryExpectation", e.target.value)}
                placeholder="e.g. GHS 5,000 – 7,000/month"
                className="text-sm"
              />
            </div>
          </div>
        </Section>

        {/* 7. Document Upload */}
        <Section number={7} title="Document Upload" icon={<Upload className="w-4 h-4" aria-hidden="true" />}>
          <div className="flex flex-col gap-4">
            <FileUpload
              inputId="resumeFile"
              label="Resume/CV"
              required
              file={form.resumeFile}
              onChange={(f) => set("resumeFile", f)}
              error={errors.resumeFile}
            />
            <FileUpload
              inputId="coverLetterFile"
              label="Cover Letter (Optional)"
              file={form.coverLetterFile}
              onChange={(f) => set("coverLetterFile", f)}
            />
            <FileUpload
              inputId="certificatesFile"
              label="Certificates (Optional)"
              file={form.certificatesFile}
              onChange={(f) => set("certificatesFile", f)}
            />
          </div>
        </Section>

        {/* 8. How Did You Hear About Us */}
        <Section number={8} title="How Did You Hear About This Role?" icon={<LinkIcon className="w-4 h-4" aria-hidden="true" />}>
          <fieldset>
            <legend className="sr-only">How did you hear about this role?</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {HEAR_ABOUT_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-start gap-2.5 cursor-pointer rounded-xl border px-3 py-2.5 transition-colors ${
                    form.hearAboutUs === opt.value
                      ? "border-amber-400 bg-amber-50"
                      : "border-gray-100 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="hearAboutUs"
                    value={opt.value}
                    checked={form.hearAboutUs === opt.value}
                    onChange={() => set("hearAboutUs", opt.value)}
                    className="accent-amber-400 mt-0.5 shrink-0"
                  />
                  <span className="text-sm text-gray-700">{opt.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          {form.hearAboutUs === "employee_referral" && (
            <div className="mt-3">
              <Label htmlFor="hearAboutUsOther-referral">Who referred you?</Label>
              <Input id="hearAboutUsOther-referral" value={form.hearAboutUsOther} onChange={(e) => set("hearAboutUsOther", e.target.value)} placeholder="Enter referrer's name" className="text-sm" />
            </div>
          )}
          {form.hearAboutUs === "professional_association" && (
            <div className="mt-3">
              <Label htmlFor="hearAboutUsOther-assoc">Please provide details</Label>
              <Input id="hearAboutUsOther-assoc" value={form.hearAboutUsOther} onChange={(e) => set("hearAboutUsOther", e.target.value)} placeholder="Association name..." className="text-sm" />
            </div>
          )}
          {form.hearAboutUs === "other" && (
            <div className="mt-3">
              <Label htmlFor="hearAboutUsOther-other">Please specify</Label>
              <Input id="hearAboutUsOther-other" value={form.hearAboutUsOther} onChange={(e) => set("hearAboutUsOther", e.target.value)} placeholder="Tell us how you heard about us..." className="text-sm" />
            </div>
          )}
        </Section>

        {/* 9. Declaration */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-7 h-7 rounded-full bg-amber-400 text-white text-xs font-bold flex items-center justify-center shrink-0" aria-hidden="true">9</span>
            <span className="text-sm font-bold text-gray-800 uppercase tracking-wide">Declaration</span>
          </div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.declaration}
              onChange={(e) => set("declaration", e.target.checked)}
              className="accent-amber-400 mt-1 shrink-0 w-4 h-4"
              aria-describedby="declaration-text"
            />
            <span id="declaration-text" className="text-sm text-gray-600 leading-relaxed">
              I certify that the information provided is accurate and complete to the best of my knowledge.
              I understand that any misrepresentation may result in disqualification or termination of employment.
            </span>
          </label>
          <FieldError message={errors.declaration} />
        </div>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row gap-3 pb-4">
          {onClose && (
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto border-gray-300 text-gray-600 rounded-xl py-5 text-sm font-medium"
            >
              Cancel
            </Button>
          )}
          {/* FIX: disabled + spinner while submitting */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-400 hover:bg-amber-500 text-white rounded-xl py-5 text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                Submitting…
              </span>
            ) : (
              "Submit Application"
            )}
          </Button>
        </div>

      </form>
    </div>
  );
};

export default JobApplicationForm;