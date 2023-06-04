import { SQLiteInteger, SQLiteText, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { sql, type InferModel, eq } from 'drizzle-orm';
import Database from 'better-sqlite3';

export const usersTable = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userName: text('userName').notNull(),
});

export const drawingsTable = sqliteTable('drawings', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => usersTable.id),
  drawingName: text('drawing_name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const pixelsTable = sqliteTable('pixels', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  drawingId: integer('drawing_id').references(() => drawingsTable.id),
  posX: integer('pos_x').notNull(),
  posY: integer('pos_y').notNull(),
});

const sqlite = new Database('drawings.sql');
export const db = drizzle(sqlite);

export type Drawing = InferModel<typeof drawingsTable>;
export type Pixels = InferModel<typeof pixelsTable>;
export type User = InferModel<typeof usersTable>;

type SelectedUser = InferModel<typeof usersTable, 'select'>;
type NewUser = InferModel<typeof usersTable, 'insert'>;
type NewDrawing = InferModel<typeof drawingsTable, 'insert'>;
type NewPixel = InferModel<typeof pixelsTable, 'insert'>;

const insertUser = (user: NewUser) => {
  return db.insert(usersTable).values(user);
};

const insertDrawing = (drawing: NewDrawing) => {
    return db.insert(drawingsTable).values(drawing).run().lastInsertRowid();
  };
  

const insertPixel = (pixel: NewPixel) => {
  return db.insert(pixelsTable).values(pixel);
};

 function selectUsers(withName: boolean, userName: string) {
  const { id, userName: name } = usersTable;
  const selectQuery = db.select({ id, ...(withName ? { name } : {}) }).from(usersTable);

  if (withName) {
    selectQuery.where(eq(name, userName));
  }

  return selectQuery;
}

export async function createDrawing(userName: string, drawingName: string, pixels: { x: number; y: number }[]) {
  // Insert into usersTable if user doesn't exist
  let user: User | null = null;

  const existingUsers =  selectUsers(true, userName);
  if (existingUsers) {
    user = existingUsers[0];
    console.log(user);
  } else {
    const newUser: NewUser = { userName };
    const insertedUser = await insertUser(newUser);
    user = insertedUser[0];
    console.log(user);
  }

  if (user) {
    // Insert into drawingsTable
    const newDrawing: NewDrawing = { userId: user.id, drawingName };
    const drawing = await insertDrawing(newDrawing);

    // Insert into pixelsTable
    for (let pixel of pixels) {
      const newPixel: NewPixel = { drawingId: drawing.id, posX: pixel.x, posY: pixel.y };
      await insertPixel(newPixel);
    }
  }
}

export async function getUsers() {
  return await db.select().from(usersTable);
}
