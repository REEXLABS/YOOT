import { DB_APP_TOKEN, DB_URL } from "$env/static/private"
import type { RequestHandler } from "./$types"
import logger from "$lib/utils/logger"
import type { AuthCodeData } from "$lib/types"


export const GET = (
    async ({ url }) => {
        const function_name = "VerifyAuth"
        try {
            const user_email = url.searchParams.get("email") ?? ""
            const code = url.searchParams.get("code") ?? ""
            if (user_email === "") {
                return new Response("email query parameter is required", { status: 400 })
            }
            if (code === "") {
                return new Response("invalid code", { status: 400 })
            }
            const where_clause = { "used": { "$eq": false }, generated_for: { "$eq": user_email }, code: { "$eq": code } }
            const req_url: URL = new URL(`${DB_URL}/collections/auth_codes`)
            req_url.searchParams.append("where", JSON.stringify(where_clause))
            const response = await fetch(
                req_url.toString(),
                {
                    headers: {
                        "X-Cassandra-Token": DB_APP_TOKEN,
                        "Content-Type": "application/json"
                    }

                }
            )
            return new Response("", { status: 200 })
        } catch (err) {
            logger("ERR", err as string, function_name)
            return new Response("", { status: 500 })
        }
    }
) satisfies RequestHandler
