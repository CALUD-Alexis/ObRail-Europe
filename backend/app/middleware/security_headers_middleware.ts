import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class SecurityHeadersMiddleware {
  async handle({ response }: HttpContext, next: NextFn) {
    // Prevent clickjacking attacks
    response.header('X-Frame-Options', 'DENY')

    // Prevent MIME type sniffing
    response.header('X-Content-Type-Options', 'nosniff')

    // Enable XSS filtering
    response.header('X-XSS-Protection', '1; mode=block')

    // Control referrer information
    response.header('Referrer-Policy', 'strict-origin-when-cross-origin')

    // Permissions policy
    response.header('Permissions-Policy', 'geolocation=(), microphone=(), camera=()')

    // Content Security Policy for API
    response.header('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'")

    // Remove server identification
    response.header('X-Powered-By', '')

    const output = await next()
    return output
  }
}