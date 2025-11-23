import type { HttpContext } from '@adonisjs/core/http'

import Profesor from '#models/profesor'
import Participante from '#models/participante'

export default class FormularioController {
  async show({ view }: HttpContext) {
    const profesores = await Profesor.all()
    return view.render('pages/formulario', { profesores })
  }

  async store({ request, response, session, view, auth }: HttpContext) {
    const { curso, profesor: profesorId } = request.all()
    const user = auth.getUserOrFail()

    // Validar que el profesor exista y pertenezca al curso (o sea elegible)
    // Nota: La lógica de filtrado estricto podría ir aquí.
    // Por simplicidad, asumimos que el formulario envía un ID válido de profesor.

    const profesor = await Profesor.find(profesorId)

    if (!profesor) {
      session.flash('error', 'Profesor no válido.')
      return response.redirect().back()
    }

    // Verificar si el profesor enseña en el curso seleccionado (opcional, pero recomendado)
    // Si la lógica es "solo gente de ese curso puede votarle", aquí podríamos validar
    // que profesor.curso === curso. Pero el requerimiento dice "tenga tantas filas como categorias participe y curso en el que enseña"
    // lo que implica que un profesor puede estar múltiples veces en la tabla profesores con distintos cursos.

    // Verificar si el usuario ya votó
    if (user.votoParticipanteId) {
      session.flash('error', 'Ya has emitido tu voto.')
      return response.redirect().back()
    }

    // Incrementamos voto en la tabla participantes (ya que comparten ID)
    const participante = await Participante.find(profesor.id)
    if (participante) {
      participante.numero_votos += 1
      await participante.save()
    }

    // Actualizar el usuario con su voto
    user.curso = curso
    user.categoria = request.input('categoria')
    user.votoParticipanteId = profesor.id
    user.mensaje = request.input('mensaje')
    await user.save()

    session.flash('votedFor', participante ? participante.nombreCompleto : 'Candidato')

    return view.render('pages/gracias')
  }
}
