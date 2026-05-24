import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request : Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const project = await prisma.project.findUnique({
            where: { id: Number(id) },
        });
        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }
        return NextResponse.json(project);
    } catch (error) {
        console.error("Error fetching project:", error);
        return NextResponse.json({ error: "Project not found", error2: error }, { status: 404 });
    }
}

// export async function PUT(request: Request, { params }: { params: { id: string } }) {
//   const { name } = await request.json();
//   const updatedProject = await prisma.project.update({
//     where: { id: Number(params.id) },
//     data: { name },
//   });
//   return NextResponse.json(updatedProject);
// }

// export async function DELETE(request: Request, { params }: { params: { id: string } }) {
//   const deletedProject = await prisma.project.delete({
//     where: { id: Number(params.id) },
//   });
//   return NextResponse.json(deletedProject);
// }
