 import type { HttpContext } from '@adonisjs/core/http'

export default class FormularioController {
  show({ view } : HttpContext) {
    return view.render('formulario')
  }

  async store({ request, response } : HttpContext) {
    console.log(request.all())
    return response.redirect('/gracias')
  }
}
