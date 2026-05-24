"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";


export async function addProject(formData: FormData) {
  const name = formData.get("name") as string;
  const color = formData.get("color") as string;
  await prisma.project.create({ data: { name, color } });
  revalidatePath("/dashboard");
}
