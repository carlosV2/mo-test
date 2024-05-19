import { EntitySchema, MikroORM, ReferenceKind } from "@mikro-orm/postgresql";

const Language = {
  English: "en",
  Spanish: "es",
};

const Text = new EntitySchema({
  name: "Text",
  properties: {
    id: { type: "text", primary: true },
    language: { enum: true, items: Object.values(Language) },
    content: { type: "text" },
  },
});

const Book = new EntitySchema({
  name: "Book",
  abstract: true,
  discriminatorColumn: "cover",
  properties: {
    id: { type: "text", primary: true },
    name: {
      kind: ReferenceKind.MANY_TO_MANY,
      entity: () => "Text",
      owner: true,
      eager: true,
    },
    pages: { type: "int" },
    cover: { enum: true },
  },
});

const PaperbackBook = new EntitySchema({
  name: "PaperbackBook",
  extends: "Book",
  discriminatorValue: "paperback",
});

const HardcoverBook = new EntitySchema({
  name: "HardcoverBook",
  extends: "Book",
  discriminatorValue: "hardcover",
});

const orm = await MikroORM.init({
  clientUrl: "postgres://postgres:postgres@localhost:5432/postgres",
  entities: [Text, Book, PaperbackBook, HardcoverBook],
  dbName: "mo-test",
  schemaGenerator: { disableForeignKeys: false },
});

console.log("Generating schema...");
const generator = orm.getSchemaGenerator();
console.log(await generator.getCreateSchemaSQL());
console.log("All done!");
