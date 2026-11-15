import queryString from "query-string"

export { cn } from "cn"

export function convertToPlainObject<T>(value: T): T{
    return JSON.parse(JSON.stringify(value))
}

export function exportId(id: string){
    return `..${id.substring(id.length - 6)}`
}

export const PAGE_SIZE = Number(process.env.PAGE_ZISE) || 2

type QueryParams = Record<string, string | string[] | null | undefined>

export function formUrlQuery({params, key, value, basePath}: {
    params: string | QueryParams
    key: string
    value: string | null
    basePath?: string
}){
    const query = typeof params === "string" ? queryString.parse(params) : { ...params }

    query[key] = value

    const search = queryString.stringify(query, {
        skipNull: true,
        skipEmptyString: true
    })

    if (!basePath) return search

    return search ? `${basePath}?${search}` : basePath
}