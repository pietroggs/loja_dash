import { BillboardForm } from "@/components/forms/billboard-form"
import prismadb from "@/lib/prismadb"

const BillBoardPage = async ({ params }: { params: { billboardId: string } }) => {
    const billboard = await prismadb.billboards.findUnique({
        where: {
            id: params.billboardId
        }
    })

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardForm 
                    initialData={billboard}
                />
            </div>
        </div>
    )
}

export default BillBoardPage