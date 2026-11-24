export type BookingField = "name" | "email" | "phone" | "firmWebsite" | "notes";

export type BookedCall = {
  start: string;
  end: string;
  durationMin: number;
  name: string;
  email: string;
  meetLink: string | null;
  /** "email": requested by email, the owner confirms by hand (no Google Calendar yet). */
  mode: "google" | "email";
};

export type BookingState = {
  /** "taken": the slot went between picking it and confirming; the picker reloads. */
  status: "idle" | "success" | "error" | "taken";
  message?: string;
  errors?: Partial<Record<BookingField, string>>;
  values?: Partial<Record<BookingField, string>>;
  booking?: BookedCall;
};
