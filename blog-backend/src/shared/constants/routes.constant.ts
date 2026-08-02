//=== AUTH ===
const AUTH = 'auth';
const SIGN_IN = 'signin';

//=== USER ===
const USER = 'user';
const USER_UPDATE = 'update';

// === FILE ===
const FILE = 'files';
const FILE_ADD = 'add';
const FILE_GET = '"filename';
const FILE_DELETE = ':filename';

export const ROUTES = {
  AUTH,
  SIGN_IN,
  USER,
  USER_UPDATE,
  FILE,
  FILE_ADD,
  FILE_GET,
  FILE_DELETE,
} as const;
