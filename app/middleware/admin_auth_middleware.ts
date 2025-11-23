import type { HttpContext } from '@adonisjs/core/http'

export default class AdminAuthMiddleware {
    async handle({ request, response }: HttpContext, next: () => Promise<void>) {
        const authHeader = request.header('authorization')

        if (!authHeader) {
            response.header('WWW-Authenticate', 'Basic realm="Admin Area"')
            return response.unauthorized('Access denied')
        }

        const [type, credentials] = authHeader.split(' ')
        if (type !== 'Basic' || !credentials) {
            return response.unauthorized('Invalid authentication format')
        }

        const [username, password] = Buffer.from(credentials, 'base64').toString().split(':')

        // Hardcoded credentials for simplicity as requested ("only me")
        if (username === 'admin' && password === 'admin') {
            await next()
        } else {
            response.header('WWW-Authenticate', 'Basic realm="Admin Area"')
            return response.unauthorized('Invalid credentials')
        }
    }
}
