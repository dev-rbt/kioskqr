import { Pool, PoolClient } from 'pg';

// Create a new pool instance
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL
});

// Enhanced error handling
pool.on('error', (err: any) => {
    console.error('Unexpected error on idle client', err);
    console.error('Database pool error:', err);
});

pool.on('connect', (client: PoolClient) => {
    console.log('New client connected to database');
});

// Generic query executor with transaction support
export async function executeQuery<T>(
    queryFn: (client: PoolClient) => Promise<T>,
    useTransaction = false
): Promise<T> {
    const client = await pool.connect();

    try {
        if (useTransaction) {
            await client.query('BEGIN');
        }

        const result = await queryFn(client);

        if (useTransaction) {
            await client.query('COMMIT');
        }

        return result;
    } catch (error) {
        if (useTransaction) {
            await client.query('ROLLBACK');
        }
        throw error;
    } finally {
        client.release();
    }
}

// Simple query executor for single queries
export async function query<T>(
    text: string,
    params?: any[]
): Promise<T> {
    try {
        const result = await pool.query(text, params);
        return result.rows as T;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

// Transaction wrapper
export async function transaction<T>(
    queries: Array<{ text: string; params?: any[] }>
): Promise<T[]> {
    return executeQuery(async (client) => {
        const results: T[] = [];

        for (const query of queries) {
            const result = await client.query(query.text, query.params);
            results.push(result.rows as T);
        }

        return results;
    }, true);
}

// Helper to build WHERE clauses
export function buildWhereClause(conditions: Record<string, any>): {
    whereClause: string;
    values: any[];
} {
    const values: any[] = [];
    const clauses: string[] = [];

    Object.entries(conditions).forEach(([key, value], index) => {
        if (value !== undefined && value !== null) {
            clauses.push(`"${key}" = $${index + 1}`);
            values.push(value);
        }
    });

    return {
        whereClause: clauses.length ? `WHERE ${clauses.join(' AND ')}` : '',
        values,
    };
}

// Helper to build SET clause for updates
export function buildSetClause(data: Record<string, any>): {
    setClause: string;
    values: any[];
} {
    const values: any[] = [];
    const setClauses: string[] = [];

    Object.entries(data).forEach(([key, value], index) => {
        if (value !== undefined) {
            setClauses.push(`"${key}" = $${index + 1}`);
            values.push(value);
        }
    });

    return {
        setClause: setClauses.join(', '),
        values,
    };
}

// Common database operations
export const db = {
    // Find one record
    findOne: async <T>(
        table: string,
        conditions: Record<string, any>
    ): Promise<T | null> => {
        const { whereClause, values } = buildWhereClause(conditions);
        const result = await query<T>(
            `SELECT * FROM "${table}" ${whereClause} LIMIT 1`,
            values
        );
        return (result as T[])[0] || null;
    },

    // Find many records
    findMany: async <T>(
        table: string,
        conditions: Record<string, any> = {}
    ): Promise<T[]> => {
        const { whereClause, values } = buildWhereClause(conditions);
        return query<T[]>(`SELECT * FROM "${table}" ${whereClause}`, values);
    },

    // Insert one record
    insert: async <T>(
        table: string,
        data: Record<string, any>
    ): Promise<T> => {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');

        const result = await query<T>(
            `INSERT INTO "${table}" ("${keys.join('", "')}") 
       VALUES (${placeholders}) 
       RETURNING *`,
            values
        );
        return (result as T[])[0];
    },

    // Update records
    update: async <T>(
        table: string,
        conditions: Record<string, any>,
        data: Record<string, any>
    ): Promise<T[]> => {
        const { setClause, values: setValues } = buildSetClause(data);
        const { whereClause, values: whereValues } = buildWhereClause(conditions);
        const allValues = [...setValues, ...whereValues];
        
        // Adjust the parameter indices in the WHERE clause
        const adjustedWhereClause = whereClause.replace(/\$(\d+)/g, (_, num) => 
            `$${parseInt(num) + setValues.length}`
        );

        const sql = `
            UPDATE "${table}" 
            SET ${setClause} 
            ${adjustedWhereClause} 
            RETURNING *
        `;
        
        console.log('Update SQL:', sql);
        console.log('Update params:', allValues);
        
        return query<T[]>(sql, allValues);
    },

    // Delete records
    delete: async <T>(
        table: string,
        conditions: Record<string, any>
    ): Promise<T[]> => {
        const { whereClause, values } = buildWhereClause(conditions);
        return query<T[]>(
            `DELETE FROM "${table}" ${whereClause} RETURNING *`,
            values
        );
    },

    // Execute raw SQL query
    executeQuery: async <T>(
        sql: string,
        params?: any[] | Record<string, any>,
        useTransaction = false
    ): Promise<T[]> => {
        return executeQuery(async (client) => {
            if (Array.isArray(params)) {
                const result = await client.query(sql, params);
                return result.rows as T[];
            } else if (params) {
                // Convert named parameters to positional parameters
                const paramNames = Object.keys(params);
                const paramValues = paramNames.map(key => params[key]);
                
                // Replace :paramName with $N
                let processedSql = sql;
                paramNames.forEach((name, index) => {
                    processedSql = processedSql.replace(
                        new RegExp(`:${name}\\b`, 'g'), 
                        `$${index + 1}`
                    );
                });

                const result = await client.query(processedSql, paramValues);
                return result.rows as T[];
            } else {
                const result = await client.query(sql);
                return result.rows as T[];
            }
        }, useTransaction);
    },

    // Bulk insert records
    async bulkInsert<T>(
        table: string,
        data: Record<string, any>[]
    ): Promise<number> {
        if (!data.length) return 0;

        const CHUNK_SIZE = 1000; // PostgreSQL'in parametre limiti nedeniyle
        let totalInserted = 0;
        
        // Veriyi chunk'lara böl
        for (let i = 0; i < data.length; i += CHUNK_SIZE) {
            const chunk = data.slice(i, i + CHUNK_SIZE);
            const columns = Object.keys(chunk[0]);

            // Get column types from the database schema
            const schemaQuery = `
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = $1 
                AND column_name = ANY($2)`;
            
            const schemaResult = await executeQuery(async (client) => {
                const result = await client.query(schemaQuery, [table, columns]);
                return result.rows;
            }, true);

            // Create a map of column types from schema
            const columnTypes = schemaResult.reduce((types: Record<string, string>, col) => {
                types[col.column_name] = col.data_type;
                return types;
            }, {});

            // Convert values according to their column types
            const values = chunk.map(item => 
                columns.map(col => {
                    const value = item[col];
                    if (value === null || value === undefined) {
                        return null;
                    }

                    const columnType = columnTypes[col];
                    switch (columnType) {
                        case 'boolean':
                            return value === true || value === 1 || value === '1' || value === 'true';
                        case 'integer':
                        case 'bigint':
                            return Number.parseInt(value);
                        case 'numeric':
                        case 'decimal':
                        case 'real':
                        case 'double precision':
                            return Number.parseFloat(value);
                        case 'uuid':
                            return value.toString();
                        default:
                            return value;
                    }
                })
            );

            // Create placeholders with explicit type casts based on schema
            const placeholders = values.map((_, i) => 
                `(${columns.map((col, j) => {
                    const type = columnTypes[col];
                    return `$${i * columns.length + j + 1}::${type}`;
                }).join(', ')})`
            ).join(', ');

            const insertedCount = await executeQuery(async (client) => {
                // İlk chunk için truncate yap
                if (i === 0) {
                    await client.query(`TRUNCATE TABLE "${table}" CASCADE`);
                }

                // Insert chunk data
                const insertQuery = `
                    INSERT INTO "${table}" (${columns.map(col => `"${col}"`).join(', ')})
                    VALUES ${placeholders}
                `;
                const result = await client.query(insertQuery, values.flat());
                return result.rowCount;
            }, true);

            if(insertedCount)
            totalInserted += insertedCount;
        }

        return totalInserted;
    },
};

export default db;