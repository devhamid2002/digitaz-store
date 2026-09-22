import { createRequire } from "node:module";

// Usage:
//   node scripts/db.mjs "SELECT slug, price FROM Product"
//   node scripts/db.mjs "UPDATE Product SET stock = 20 WHERE slug = 'iphone-15-pro-max'"

// Resolve better-sqlite3 through the Prisma adapter so this works
// regardless of the package manager's node_modules layout.
const requireAdapter = createRequire(
  import.meta.resolve("@prisma/adapter-better-sqlite3")
);
const Database = requireAdapter("better-sqlite3");

const sql = process.argv.slice(2).join(" ");
if (!sql) {
  console.error('Usage: node scripts/db.mjs "<SQL statement>"');
  process.exit(1);
}

const db = new Database("dev.db");

try {
  if (/^\s*select/i.test(sql)) {
    console.table(db.prepare(sql).all());
  } else {
    const info = db.prepare(sql).run();
    console.log(`OK — changes: ${info.changes}, lastInsertRowid: ${info.lastInsertRowid}`);
  }
} finally {
  db.close();
}
