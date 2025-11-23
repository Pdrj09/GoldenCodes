import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'

export default class AuthController {
    async showRegister({ view }: HttpContext) {
        return view.render('pages/register')
    }

    async register({ request, response, auth, session }: HttpContext) {
        const { nombre, email, password } = request.all()

        // Validar que el email no esté registrado
        const existingUser = await User.findBy('email', email)
        if (existingUser) {
            session.flash('error', 'Este correo electrónico ya está registrado.')
            return response.redirect().back()
        }

        // Crear el usuario
        const user = await User.create({
            nombre,
            email,
            password,
        })

        // Autenticar automáticamente
        await auth.use('web').login(user)

        session.flash('success', '¡Registro exitoso! Bienvenido.')
        return response.redirect('/')
    }

    async showLogin({ view }: HttpContext) {
        return view.render('pages/login')
    }

    async login({ request, response, auth, session }: HttpContext) {
        const { email, password } = request.all()

        try {
            const user = await User.findBy('email', email)

            if (!user) {
                session.flash('error', 'Credenciales incorrectas.')
                return response.redirect().back()
            }

            const isValidPassword = await hash.verify(user.password, password)

            if (!isValidPassword) {
                session.flash('error', 'Credenciales incorrectas.')
                return response.redirect().back()
            }

            await auth.use('web').login(user)

            return response.redirect('/')
        } catch (error) {
            session.flash('error', 'Error al iniciar sesión.')
            return response.redirect().back()
        }
    }

    async logout({ auth, response }: HttpContext) {
        await auth.use('web').logout()
        return response.redirect('/')
    }
}
