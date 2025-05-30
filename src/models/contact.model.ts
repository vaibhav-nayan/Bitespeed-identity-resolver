import { pool } from "../db";
import { ContactInput, Contact } from "../types";

export const findContactsByEmailOrPhone = async (
  email?: string,
  phoneNumber?: string
): Promise<Contact[]> => {
  const { rows } = await pool.query(
    `SELECT
      id,
      email,
      phoneNumber AS "phoneNumber",
      linkedId AS "linkedId",
      linkPrecedence AS "linkPrecedence",
      createdAt AS "createdAt",
      updatedAt AS "updatedAt",
      deletedAt AS "deletedAt" 
    FROM Contact WHERE email = $1 OR phoneNumber = $2`,
    [email, phoneNumber]
  );
  return rows;
};

export const insertContact = async (data: ContactInput): Promise<Contact> => {
  const { email, phoneNumber, linkedId, linkPrecedence } = data;
  const { rows } = await pool.query(
    `INSERT INTO Contact (email, phoneNumber, linkedId, linkPrecedence)
     VALUES ($1, $2, $3, $4) 
     RETURNING
     id,
     email,
     phoneNumber AS "phoneNumber",
     linkedId AS "linkedId",
     linkPrecedence AS "linkPrecedence",
     createdAt AS "createdAt",
     updatedAt AS "updatedAt",
     deletedAt AS "deletedAt"
     `,
    [email, phoneNumber, linkedId || null, linkPrecedence]
  );
  // console.log("From models.ts, Inserted Row: ", rows[0])
  return rows[0];
};

export const updateContact = async (
  id: number,
  updates: Partial<ContactInput>
): Promise<void> => {
  await pool.query(
    `UPDATE Contact SET linkedId = $1, linkPrecedence = $2, updatedAt = NOW() WHERE id = $3`,
    [updates.linkedId, updates.linkPrecedence, id]
  );
};

export const findAllLinkedContacts = async (primaryId: number): Promise<Contact[]> => {
  const { rows } = await pool.query(
    `
      WITH RECURSIVE contact_chain AS (
        SELECT
          id,
          email,
          phoneNumber AS "phoneNumber",
          linkedId AS "linkedId",
          linkPrecedence AS "linkPrecedence",
          createdAt AS "createdAt",
          updatedAt AS "updatedAt",
          deletedAt AS "deletedAt"
        FROM Contact WHERE id = $1 OR linkedId = $1
      )
      SELECT * FROM contact_chain;
    `,
    [primaryId]
  );
  return rows;
};