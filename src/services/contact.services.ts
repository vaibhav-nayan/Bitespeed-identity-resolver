import {
  findContactsByEmailOrPhone,
  insertContact,
  updateContact,
  findAllLinkedContacts
} from "../models/contact.model";
import { Contact, ContactResponse } from "../types";

export const handleIdentify = async (
  email?: string,
  phoneNumber?: string
): Promise<ContactResponse> => {
  const normalizedEmail = email?.toLowerCase();
  const normalizedPhone = phoneNumber;

  const contacts = await findContactsByEmailOrPhone(normalizedEmail, normalizedPhone);

  if (contacts.length === 0) {
    const newContact = await insertContact({ email: normalizedEmail, phoneNumber: normalizedPhone, linkPrecedence: "primary" });

    // console.log("From services.ts, newContact body: ", newContact)
    // console.log("From services.ts, newContact phoneNumber : ", newContact.phoneNumber)

    return {
      primaryContactId: newContact.id,
      emails: newContact.email ? [newContact.email.toLowerCase()] : [],
      phoneNumbers: newContact.phoneNumber ? [newContact.phoneNumber] : [],
      secondaryContactIds: []
    };
  }

  const allPrimaries = contacts.filter(c => c.linkPrecedence === "primary");
  const truePrimary = allPrimaries.length > 0
  ? allPrimaries.reduce((oldest, curr) =>
      curr.createdAt < oldest.createdAt ? curr : oldest
    )
  : contacts.reduce((oldest, curr) =>
      curr.createdAt < oldest.createdAt ? curr : oldest
    );

  await Promise.all(
    contacts.map(async (contact) => {
      if (contact.id !== truePrimary.id &&
          (contact.linkPrecedence !== "secondary" || contact.linkedId !== truePrimary.id)) {
        await updateContact(contact.id, {
          linkPrecedence: "secondary",
          linkedId: truePrimary.id
        });
      }
    })
  );

  const emailExists = contacts.some(c => c.email?.toLowerCase() === normalizedEmail);
  const phoneExists = contacts.some(c => c.phoneNumber === normalizedPhone);

  if (!emailExists || !phoneExists) {
    await insertContact({
      email: normalizedEmail,
      phoneNumber: normalizedPhone,
      linkedId: truePrimary.id,
      linkPrecedence: "secondary"
    });
  }

  const linkedContacts = await findAllLinkedContacts(truePrimary.id);

  const emails = new Set<string>();
  const phones = new Set<string>();
  const secondaryIds: number[] = [];

  linkedContacts.forEach(c => {
    if (c.email) emails.add(c.email.toLowerCase());
    if (c.phoneNumber && typeof c.phoneNumber === "string" && c.phoneNumber.trim()) phones.add(c.phoneNumber.trim());
    if (c.id !== truePrimary.id) secondaryIds.push(c.id);
  });

  return {
    primaryContactId: truePrimary.id,
    emails: Array.from(emails),
    phoneNumbers: Array.from(phones),
    secondaryContactIds: secondaryIds
  };
};