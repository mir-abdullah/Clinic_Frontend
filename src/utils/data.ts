import { Action } from "./type";

export const sidebarItems = [
  {
    value: "Dashboard",
    icon: "📊",
    route: "/dashboard"
  },
  {
    value: "Patients",
    icon: "👥",
    route: "/patients"
  },
  {
    value: "Appointments",
    icon: "📅",
    route: "/appointments"
  },
  {
    value: "Visits",
    icon: "🩺",
    route: "/visits"
  },
  {
    value :"Reports",
    icon: "📈",
    route: "/reports"
  }
];

export const visitReasons = [
  {
    category: "General Consultation",
    reasons: ["Checkup", "Follow-up", "Second Opinion", "New Patient Visit"],
  },
  {
    category: "Emergency",
    reasons: ["Severe Pain", "Infection", "Swelling", "Bleeding", "Trauma/Injury"],
  },
  {
    category: "Preventive Care",
    reasons: ["Cleaning", "Scaling", "Fluoride Treatment", "Routine Screening"],
  },
  {
    category: "Restorative Treatment",
    reasons: ["Filling", "Crown", "Bridge", "Tooth Extraction", "Root Canal"],
  },
  {
    category: "Orthodontics",
    reasons: ["Braces Installation", "Braces Adjustment", "Retainer Check", "Aligner Fitting"],
  },
  {
    category: "Cosmetic Dentistry",
    reasons: ["Teeth Whitening", "Veneers", "Smile Design Consultation", "Bonding"],
  },
  {
    category: "Pediatric Dentistry",
    reasons: ["Child Checkup", "Fluoride Application", "Cavity Treatment", "Behavioral Consultation"],
  },
  {
    category: "Prosthodontics",
    reasons: ["Dentures", "Implant Consultation", "Implant Follow-up", "Prosthesis Repair"],
  },
  {
    category: "Periodontal Treatment",
    reasons: ["Gum Disease Treatment", "Deep Cleaning (Scaling & Root Planing)", "Gum Surgery Follow-up"],
  },
  {
    category: "Oral Surgery",
    reasons: ["Wisdom Tooth Removal", "Surgical Extraction", "Biopsy", "Jaw Issue Consultation"],
  },
  {
    category: "Diagnostics",
    reasons: ["X-Ray", "CBCT Scan", "Impression Taking", "Treatment Planning"],
  },
  {
    category: "Other",
    reasons: ["Not Listed", "Custom Reason"],
  },
];

export const quickActions : Action[] = [
  {
      title: "Add Patient",
      description:"Register new patient",
      icon: "👤",
  },
  {
    title:"Book Appointment",
    description:"Schedule new Appointment",
    icon: "📅",
  },
  {
    title:"Record Visit",
    description:"Log details of a patient visit",
    icon: "💳",
    link: "/patients"
  }
]

