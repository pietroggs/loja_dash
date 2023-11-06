"use client";

import * as z from 'zod'
import axios from 'axios';
import { useState } from 'react';
import { Trash } from "lucide-react";
import { Billboards } from "@prisma/client";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { AlertModal } from '../modals/alert-modal';
import { ApiAlert } from '../ui/api-alert';
import { useOrigin } from '@/hooks/use-origin';

const formSchema = z.object({
    label: z.string().min(3),
    imageUrl: z.string().min(3)

})

type BillboardFormValue = z.infer<typeof formSchema>

interface BillboardFormProps {
    initialData: Billboards | null;
}

export const BillboardForm: React.FC<BillboardFormProps> = ({ initialData }) => {
    const params = useParams();
    const router = useRouter();
    const origin = useOrigin();

    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const title = initialData ? "Edit billboard" : "Create billboard"
    const description = initialData ? "Edit a billboard" : "Add a new billboard"
    const toastMessage = initialData ? "Billboard updated" : "Billboard created"
    const action = initialData ? "Save data" : "Create"

    const form = useForm<BillboardFormValue>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: '',
            imageUrl: ''
        }
    })

    const onSubmit = async (data: BillboardFormValue) => {
        try {
            console.log(data)
            axios.patch(`/api/stores/${params.storeId}`, data)
            router.refresh()
            toast.success('Loja Atualizada.')
        } catch (error) {
            toast.error("Algo de errado não está certo.")
        }
    }

    const onDelete = async () => {
        try {
            setLoading(true)
            await axios.delete(`/api/stores/${params.storeId}`)
            router.refresh()
            router.push('/')
            toast.success('Loja excluida.')
        } catch (error) {
            toast.error("Para excluir uma loja você deve primeiro remover todos os produtos.")
        } finally {
            setOpen(false)
            setLoading(false)
        }
    }

    return (
        <>
            <AlertModal
                isOpen={open}
                loading={loading}
                onClose={() => { setOpen(false) }}
                onConfirm={() => { onDelete() }}

            />
            <div className="flex items-center justify-between">
                <Heading
                    title={title}
                    description={description}
                />
                {initialData && (
                    <Button
                        disabled={loading}
                        variant="destructive"
                        size="sm"
                        onClick={() => { setOpen(true) }}
                    >
                        <Trash
                            className="h-4 w-4"
                        />
                    </Button>
                )}
            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-8 w-full'>
                    <div className="grid grid-cols-3 gap-8">
                        <FormField
                            control={form.control}
                            name='label'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Label</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={loading}
                                            placeholder='Billboard name'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button disabled={loading} className='ml-auto' type='submit'>
                        {action}
                    </Button>
                </form>
            </Form>
            <Separator />
        </>
    )
}