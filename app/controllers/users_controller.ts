// app/controllers/users_controller.ts
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {

  public async index({ view }) {
    const allUsers = await User.all()

    // 2. Pasar los datos a una plantilla de Edge
    return view.render('pages/usersShow', {
      usersList: allUsers
    })
  }

  public async check({ view }: HttpContext) {
    return view.render('pages/check_vote')
  }

  public async find({ request, response, session }: HttpContext) {
    const email = request.input('email')
    const user = await User.findBy('email', email)

    if (!user) {
      session.flash('error', 'No se encontró un usuario con ese email.')
      return response.redirect().back()
    }

    return response.redirect(`/consultar-voto/${user.id}`)
  }

  public async show({ params, view }: HttpContext) {
    const user = await User.find(params.id)
    if (user) {
      await user.load('votoParticipante')
    }

    return view.render('pages/vote_detail', { user })
  }
}