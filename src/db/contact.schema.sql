CREATE TABLE IF NOT EXISTS Contact (
  id SERIAL PRIMARY KEY,
  phoneNumber VARCHAR,
  email VARCHAR,
  linkedId INT,
  linkPrecedence VARCHAR CHECK (linkPrecedence IN ('primary', 'secondary')),
  createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMP NOT NULL DEFAULT NOW(),
  deletedAt TIMESTAMP
);