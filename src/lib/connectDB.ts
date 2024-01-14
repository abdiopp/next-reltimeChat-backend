import prisma from "@/prisma";
export const connectDB = async () => {
  try {
    await prisma.$connect();
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    throw new Error("Error connecting");
  }
};
