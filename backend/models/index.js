import { Sequelize, Model, DataTypes } from "sequelize";
const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable not set!");
}

export const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // YOU NEED THIS
    },
  },
});

export class User extends Model {}
User.init(
  {
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bio: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
    birthday: DataTypes.DATE,
  },
  { sequelize, modelName: "user" }
);
