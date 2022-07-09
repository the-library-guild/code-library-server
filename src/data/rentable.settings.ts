import {
  DEFAULT_USER_PERMS_INT,
  LIBRARIAN_PERMS_INT,
} from "code-library-perms";

const librarianEmails = [
  "marcelo.teixeira@code.berlin",
  "linus.bolls@code.berlin",

  "alex.maurer@code.berlin",
  "lida.masouleh@code.berlin",
  "alexander.gerick@code.berlin",
  "maya.alroy@code.berlin",
];

const rentableSettings = {
  LIBRARIAN_EMAILS: librarianEmails,

  USER_BOOKING_LIMIT: 5,
  LIBRARIAN_BOOKING_LIMIT: Infinity,

  USER_PERMS_INT: DEFAULT_USER_PERMS_INT,
  LIBRARIAN_PERMS_INT: LIBRARIAN_PERMS_INT,

  ANYONE_CAN_RETURN_ANYONES_BOOKS: true,

  MAX_RENTING_DURATION_HOURS: 24 * 14,
  MAX_SESSION_DURATION_HOURS: 24 * 365 * 999,
};

const RentableState = {
  AVAILABLE: "Available",
  BORROWED: "Borrowed",
  PROCESSING: "Processing",
  OVERDUE: "Overdue",
};
export default rentableSettings;

export { RentableState };
