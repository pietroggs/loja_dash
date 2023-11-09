import {format} from 'date-fns'
import prismadb from "@/lib/prismadb"
import { BillboardClient } from "./components/client"
import { BillboadColumn } from "./components/columns"

const BillboardsPage = async ({ params }: {
    params: { storeId: string }
}) => {
    const billboards = await prismadb.billboards.findMany({
        where: {
            storeId: params.storeId
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    const formatedBillboards: BillboadColumn[] = billboards.map((item) => ({
        id: item.id,
        label: item.label,
        createdAt: format(item.createdAt, "d MMMM, yy")
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardClient data={formatedBillboards}/>
            </div>
        </div>
    )
}

export default BillboardsPage