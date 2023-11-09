import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { error } from "console";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: {
        params: {
            storeId: string, billboardId: string
        }
    }
) {
    try {
        const { userId } = auth()
        const body = await req.json()
        const { label, imageUrl } = body

        if (!userId) {
            return new NextResponse("Unathent", { status: 401 })
        }

        if (!label) {
            return new NextResponse("label is required", { status: 400 })
        }

        if (!imageUrl) {
            return new NextResponse("imageUrl is required", { status: 400 })
        }

        if (!params.billboardId) {
            return new NextResponse("billboardId is required", { status: 400 })
        }

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse('Sem Autorização', { status: 403 })
        }

        const billboard = await prismadb.billboards.updateMany({
            where: {
                id: params.billboardId
            },
            data: {
                label,
                imageUrl
            }
        })

        return NextResponse.json(billboard)
    } catch (e) {
        console.log('[BILLBOARDS_PATCH]', error)
        return new NextResponse("Internal error", { status: 500 })
    }
}


export async function DELETE(
    req: Request,
    { params }: {
        params: {
            storeId: string, billboardId: string
        }
    }
) {
    try {
        const { userId } = auth()

        if (!userId)
            return new NextResponse("Unauthenticated", { status: 401 })

        if (!params.billboardId)
            return new NextResponse("billboardId is required", { status: 400 })

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        })

        if (!storeByUserId) {
            return new NextResponse('Sem Autorização', { status: 403 })
        }

        const billboards = await prismadb.billboards.deleteMany({
            where: {
                id: params.billboardId
            }
        })

        return NextResponse.json(billboards)

    } catch (e) {
        console.log('[BILLBOARD_DELETE]', e)
        return new NextResponse("Internal error", { status: 500 })
    }
}


export async function GET(
    req: Request,
    { params }: {
        params: {
            billboardId: string
        }
    }
) {
    try {
        if (!params.billboardId)
            return new NextResponse("billboardId is required", { status: 400 })

        const billboards = await prismadb.store.findUnique({
            where: {
                id: params.billboardId
            }
        })

        return NextResponse.json(billboards)

    } catch (e) {
        console.log('[BILLBOARD_GET]', e)
        return new NextResponse("Internal error", { status: 500 })
    }
}