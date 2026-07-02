import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class SecurityHeadersMiddleware {
  async handle({ request, response }: HttpContext, next: NextFn) {
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

    // Swagger UI requires external scripts/styles from unpkg.com and inline execution
    if (request.url().startsWith('/docs')) {
      response.header(
        'Content-Security-Policy',
        "default-src 'none'; script-src 'unsafe-inline' https://unpkg.com; style-src 'unsafe-inline' https://unpkg.com; connect-src 'self'; img-src 'self' data:; frame-ancestors 'none'"
      )
    } else {
      response.header('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'")
    }

    // Remove server identification
    response.header('X-Powered-By', '')

    const output = await next()
    return output
  }
}