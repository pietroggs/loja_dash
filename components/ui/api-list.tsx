'use client';

import { useParams, useRouter } from "next/navigation";
import { ApiAlert } from "./api-alert";
import { useEffect, useState } from "react";

interface ApiListProps {
    entityName: string
    entityIdName: string
}

export const ApiList: React.FC<ApiListProps> = ({
    entityName,
    entityIdName
}) => {
    const params = useParams()
    const router = useRouter()
    const [baseUrl, setBaseUrl] = useState('')
    useEffect(() => {
        // Client-side-only code
        setBaseUrl(`${origin}/api/${params.storeId}`)
    })
    return (
        <>
            <ApiAlert
                title="GET"
                variant="public"
                description={`${baseUrl}/${entityName}`}
            />
            <ApiAlert
                title="GET"
                variant="public"
                description={`${baseUrl}/${entityName}/${entityIdName}`}
            />
            <ApiAlert
                title="POST"
                variant="admin"
                description={`${baseUrl}/${entityName}`}
            />
            <ApiAlert
                title="PATCH"
                variant="admin"
                description={`${baseUrl}/${entityName}/${entityIdName}`}
            />
            <ApiAlert
                title="DELETE"
                variant="admin"
                description={`${baseUrl}/${entityName}/${entityIdName}`}
            />
        </>
    )
}