import { asc, count, eq, gt, sql } from "drizzle-orm";
import { db } from "./db";
import { UserTable } from "./drizzle/schema";

async function insertUser(name = "John Doe") {
    const insertedUser = await db.insert(UserTable).values({
        name: name,
        age: 20,
        email: `${name}@mail.com`,
    })
        .returning({
            id: UserTable.id
        })

    console.log(insertedUser);
}

async function insertMultipleUsers() {
    const users = await db.insert(UserTable).values([
        {
            name: "John Doe",
            age: 20,
            email: "one@mail.com"
        },
        {
            name: "Jane Doe",
            age: 20,
            email: "wifeofjohndoe@mail.com",
            role: "ADMIN"
        }
    ])
        .returning({
            id: UserTable.id
        })
        .onConflictDoUpdate({
            target: UserTable.email,
            set: { name: "Updated Name", email: "updatedmail@mail.com" },
            // where: {}
        })
    console.log(users);
}

async function getUsers() {
    // const users = await db.query.UserTable.findMany({
    //     columns: { name: true },
    //     extras: {
    //         lowerCaseName: sql<string>`lower(${UserTable.name})`.as("lowerCaseName"),
    //     },
    //     offset: 1,
    //     with: {
    //         preferences: true
    //     },
    //     // orderBy: asc(UserTable.name),
    //     orderBy: (table, fn) => fn.asc(table.age),
    //     where: (table, fn) => fn.eq(table.name, "John Doe"),
    // });


    const users = await db
        .select({ id: UserTable.id })
        .from(UserTable)
        .where(eq(UserTable.age, 20));

    const groupedUsers = await db
        .select({
            age: UserTable.age,
            count: count(UserTable.age)
        })
        .from(UserTable)
        .groupBy(UserTable.age)
        .having(columns => gt(columns.count, 1));

    console.log(groupedUsers);
    console.log(users);
}

async function deleteData() {
    await db.delete(UserTable);
}

async function updateUser() {
    await db.update(UserTable)
        .set({
            name: "Jane Doe"
        })
        .where(eq(UserTable.name, "John Doe"));

}

// await insertUser();
// await insertMultipleUsers();
await getUsers();
// await deleteData();

process.exit(0);