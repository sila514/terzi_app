import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasourceUrl: "postgresql://postgres.qmffcecgimlnwaiuuaax:Barvion24.!@aws-1-eu-central-1.pooler.supabase.com:5432/postgres",
});

export default prisma;