import Navbar from "@/components/navbar"
import prismadb from "@/lib/prismadb"
import { auth } from "@clerk/nextjs"
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
    children, params }: {
        children: React.ReactNode
        params: { storeId: string }
    }
) {
    //verifica usario logado
    const { userId } = auth()
    //redir
    if (!userId)
        redirect('sing-in')

    const store = await prismadb.store.findFirst({
        where: {
            id: params.storeId,
            userId: userId
        }
    })

    if (!store)
        redirect('/')

    return(
        <>
        <Navbar/>
        {children}
        </>
    )
}