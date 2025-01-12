import axios, {isAxiosError} from "axios";
import { NextApiRequest } from 'next';

interface RequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: any;
    headers?: any;
}

interface ExecuteParams {
    databaseId?: string;
    tenantId?: string;
    jobId?: string;
    query: string;
    parameters?: {
        date1?: string;
        date2?: string;
        BranchID?: number;
        [key: string]: string | number | undefined;
    };
    callBackUrl?: string;
    req?: NextApiRequest;
    skipCache?: boolean
}

interface JobResultParams {
    jobId: string;
    page?: number;
    tenantId?: string;
    databaseId?: string;
    req?: NextApiRequest;
}

interface CacheEntry<T> {
    data: T;
    timestamp: number;
}
interface DatabaseResponse {
    databaseId: string;
    tenantId: string;
    apiKey: string;
    database:string;
}

const databaseCache = new Map<string, { database: DatabaseResponse | undefined; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 dakika

export async function checkTenantDatabase(tenantId: string): Promise<DatabaseResponse | undefined> {
    const cached = databaseCache.get(tenantId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION && cached.database !== undefined) {
        return cached.database;
    }
       
    try {
        const instance = Dataset.getInstance();
        const databases = await instance.getDatabase<DatabaseResponse[]>();
        const database = databases.find(item => item.tenantId === tenantId);
        databaseCache.set(tenantId, { database, timestamp: Date.now() });
        return database;
    } catch (error) {
        return undefined;
    }
}

export function extractTenantId(referer: string | undefined): string {

    if (!referer) {
        return '';
    }
    try {
        const tenantId = new URL(referer).pathname.replace(process.env.NEXT_PUBLIC_BASEPATH ||'', '').split("/")[1] || '';
        return tenantId;
    } catch (error) {
        console.error('Error parsing referer:', error);
        return '';
    }
}

export class Dataset {
    private static instance: Dataset;
    private readonly QUERY_CACHE = new Map<string, CacheEntry<any>>();

    private constructor() {}

    public static getInstance(): Dataset {
        if (!Dataset.instance) {
            Dataset.instance = new Dataset();
        }
        return Dataset.instance;
    }
    private async datasetApi<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
        const { method = 'GET', body, headers } = options;
        const apiUrl = `${process.env.DATASET_API_BASE_URL}${endpoint}`;
        try {
            const response = await axios({
                method,
                url: apiUrl,
                data: body,
                headers,
            });
            
            return response.data.data as T;
        } catch (error) {
            if (isAxiosError(error)) {
                console.error('API request error:', error.response?.data || error.message);
                throw new Error(error.response?.data?.message || 'Request failed');
            }
            console.error('API request error:', error);
            throw error;
        }
    }
    public async executeQuery<T>(params: ExecuteParams): Promise<T> {
        const { query, parameters = {}, skipCache } = params;
        let tenantId = process.env.TENANT_ID;
        try {
          
            const database = await checkTenantDatabase(tenantId || '');

            const databaseId = database?.databaseId || params.databaseId || '3';

            if(databaseId !== undefined && databaseId !== null) {
                return this.datasetApi<T>(`/${databaseId}/datamanagerquery`, {
                    method: 'POST',
                    body: {
                        query,
                        parameters,
                        skipCache
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${database?.apiKey}`
                    }
                });
            }
            return [] as T;
        } catch (error) {
            console.error('executeQuery error:', error);
            throw error;
        }
    }

    public async executeBigQuery<T>(params: ExecuteParams): Promise<T> {
        const { query, parameters = {}, tenantId: paramTenantId, req, skipCache, callBackUrl } = params;
        let tenantId = paramTenantId;
        if (params.req && req?.headers.referer) {
            try {
                tenantId = extractTenantId(req.headers.referer);
            } catch (error) {
                console.error('Error parsing referer:', error);
            }
        }
        try {
          
            const database = await checkTenantDatabase(tenantId || '');
            const databaseId = database?.databaseId || params.databaseId || '3';

            if(databaseId !== undefined && databaseId !== null) {
                const { method = 'GET', body, headers } = {
                    method: 'POST',
                    body: {
                        query,
                        parameters,
                        callBackUrl,
                        skipCache
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${database?.apiKey}`
                    }
                };
                const apiUrl = `${process.env.DATASET_API_BASE_URL}/${databaseId}/bigquery`;
                try {
                    const response = await axios({
                        method,
                        url: apiUrl,
                        data: body,
                        headers,
                    });
                    
                    return response.data as T;
                } catch (error) {
                    if (isAxiosError(error)) {
                        console.error('API request error:', error.response?.data || error.message);
                        throw new Error(error.response?.data?.message || 'Request failed');
                    }
                    console.error('API request error:', error);
                    throw error;
                }


            }
            return [] as T;
        } catch (error) {
            console.error('executeQuery error:', error);
            throw error;
        }
    }

    public async getJobResult<T>(params: JobResultParams): Promise<T> {
        const { jobId, tenantId: paramTenantId, req} = params;
        let tenantId = paramTenantId;
        if (params.req && req?.headers.referer) {
            try {
                tenantId = extractTenantId(req.headers.referer);
            } catch (error) {
                console.error('Error parsing referer:', error);
            }
        }
        try {
            const database = await checkTenantDatabase(tenantId || '');
            if (!database) {
                throw new Error(`No database found for tenant: ${tenantId}`);
            }
            const databaseId = database?.databaseId || params.databaseId || '3';

            if(databaseId !== undefined && databaseId !== null) {

                const { method = 'GET', headers } = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${database?.apiKey}`
                    }
                };
                const apiUrl = `${process.env.DATASET_API_BASE_URL}/${databaseId}/job/result/${jobId}`;
                try {
                    const response = await axios({
                        method,
                        url: apiUrl,
                        headers,
                    });
                    
                    return response.data as T;
                } catch (error) {
                    if (isAxiosError(error)) {
                        console.error('API request error:', error.response?.data || error.message);
                        throw new Error(error.response?.data?.message || 'Request failed');
                    }
                    console.error('API request error:', error);
                    throw error;
                }

            }
            throw new Error('DatabaseId is undefined or null');
        } catch (error) {
            console.error('getJobResult error:', error);
            throw error;
        }
    }

    public async getDatabase<T>(): Promise<T> {
        return this.datasetApi<T>(`/database`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.DATASET_API_TOKEN}`
            }
        });
    }
}

// Export singleton instance
export const dataset = Dataset.getInstance();