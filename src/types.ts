export interface Contact {
  id: number;
  phoneNumber: string | null;
  email: string | null;
  linkedId: number | null;
  linkPrecedence: "primary" | "secondary";
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ContactInput {
  phoneNumber?: string;
  email?: string;
  linkedId?: number;
  linkPrecedence: "primary" | "secondary";
}

export interface ContactResponse {
  primaryContactId: number;
  emails: string[];
  phoneNumbers: string[];
  secondaryContactIds: number[];
}

export interface IdentifyContactRequest {
  email?: string;
  phoneNumber?: string;
}
