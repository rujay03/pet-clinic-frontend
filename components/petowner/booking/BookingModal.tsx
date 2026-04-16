"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import BookingDetailsStep from "@/components/petowner/booking/BookingDetailsStep";
import DateTimeStep from "@/components/petowner/booking/DateTimeStep";
import BookingSuccessModal from "@/components/petowner/booking/BookingSuccessModal";

interface BookingData {
  // Personal Information
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  address: string;

  // Pet Information
  petId: string;
  petName: string;
  appointmentType: string;
  note: string;

  // Date & Time
  selectedDate: Date | null;
  selectedTime: string;
  doctorId?: string;

  // Payment
  paymentMethod: string;
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<BookingData>({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    address: "",
    petId: "",
    petName: "",
    appointmentType: "",
    note: "",
    selectedDate: null,
    selectedTime: "",
    doctorId: "",
    paymentMethod: "Credit Card",
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const handleNext = async (stepData: Partial<BookingData>) => {
    const merged = { ...bookingData, ...stepData };
    setBookingData(merged);

    if (currentStep === 2) {
      // Submit appointment to the backend API
      setSubmitting(true);
      setSubmitError(null);
      try {
        const date = merged.selectedDate;
        const appointmentDate = date
          ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
          : "";

        const appointmentTime = merged.selectedTime
          ? merged.selectedTime.length === 5
            ? `${merged.selectedTime}:00`
            : merged.selectedTime
          : "";

        await apiFetch("/api/appointments", {
          method: "POST",
          body: {
            petId: Number(merged.petId),
            doctorId: merged.doctorId ? Number(merged.doctorId) : undefined,
            appointmentDate,
            appointmentTime,
            appointmentType: merged.appointmentType,
            notes: merged.note || null,
          },
        });

        setShowSuccess(true);
      } catch (err: any) {
        setSubmitError(
          err?.message || "Failed to book appointment. Please try again."
        );
      } finally {
        setSubmitting(false);
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    // Reset state
    setCurrentStep(1);
    setShowSuccess(false);
    setSubmitError(null);
    setBookingData({
      firstName: "",
      lastName: "",
      mobileNumber: "",
      email: "",
      address: "",
      petId: "",
      petName: "",
      appointmentType: "",
      note: "",
      selectedDate: null,
      selectedTime: "",
      doctorId: "",
      paymentMethod: "Credit Card",
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    });
    onClose();
  };

  const handleSuccessClose = () => {
    handleClose();
  };

  if (!isOpen && !showSuccess) return null;

  if (showSuccess) {
    return <BookingSuccessModal onClose={handleSuccessClose} />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#202458] px-8 py-6 text-white">
          <h1 className="text-xl font-semibold">
            {currentStep === 1 ? "Booking Appointment" : "Booking Visit Form"}
          </h1>
          <button
            onClick={handleClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#202458] transition-colors hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-4 px-8 py-6">
          <StepIndicator
            number={1}
            label="Booking Details"
            isActive={currentStep === 1}
            isCompleted={currentStep > 1}
          />
          <StepDivider />
          <StepIndicator
            number={2}
            label="Select Date & Time"
            isActive={currentStep === 2}
            isCompleted={currentStep > 2}
          />
          {/* Commented out: Payment step indicator */}
          {/* <StepDivider />
          <StepIndicator
            number={3}
            label="Select Payment"
            isActive={currentStep === 3}
            isCompleted={false}
          /> */}
        </div>

        {/* Error banner */}
        {submitError && (
          <div className="mx-8 mb-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {submitError}
          </div>
        )}

        {/* Content Area */}
        <div className="h-[calc(100%-180px)] overflow-y-auto px-8 pb-6">
          {currentStep === 1 && (
            <BookingDetailsStep data={bookingData} onNext={handleNext} />
          )}
          {currentStep === 2 && (
            <DateTimeStep
              data={bookingData}
              onNext={handleNext}
              onBack={handleBack}
              submitting={submitting}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function StepIndicator({
  number,
  label,
  isActive,
  isCompleted,
}: {
  number: number;
  label: string;
  isActive: boolean;
  isCompleted: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
          isActive
            ? "bg-[#6366F1] text-white"
            : isCompleted
              ? "bg-gray-300 text-gray-600"
              : "bg-gray-200 text-gray-500"
        }`}
      >
        {number}
      </div>
      <span
        className={`text-sm font-medium ${
          isActive ? "text-[#6366F1]" : "text-gray-500"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function StepDivider() {
  return <div className="h-px w-8 bg-gray-300"></div>;
}
