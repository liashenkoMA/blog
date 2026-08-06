//=== AUTH ===
const AUTH = 'auth';
const SIGN_IN = 'signin';

//=== USER ===
const USER = 'user';
const USER_UPDATE = 'update';

// === FILE ===
const FILE = 'files';
const FILE_ADD = 'add';
const FILE_GET = ':filename';
const FILE_DELETE = ':filename';

// === CATEGORY ===
const CATEGORY = 'categories';
const CATEGORY_GET = ':slug';

// === TAG ===
const TAG = 'tags';
const TAG_GET = ':slug';

// === ARTICLE ===
const ARTICLE = 'articles';
const ARTICLE_LAST = 'last';
const ARTICLE_CATEGORY = 'category/:slug';
const ARTICLE_TAG = 'tag/:slug';
const ARTICLE_GET = ':slug';

export const ROUTES = {
  AUTH,
  SIGN_IN,
  USER,
  USER_UPDATE,
  FILE,
  FILE_ADD,
  FILE_GET,
  FILE_DELETE,
  CATEGORY,
  CATEGORY_GET,
  TAG,
  TAG_GET,
  ARTICLE,
  ARTICLE_LAST,
  ARTICLE_CATEGORY,
  ARTICLE_TAG,
  ARTICLE_GET,
} as const;
