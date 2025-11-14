using FluentResults;
using MediatR;

namespace OrganizaMed.Aplicacao.ModuloAtividade.Commands.Editar;

public record EditarAtividadeMedicaRequest(
    Guid Id,
     DateTimeOffset Inicio,
    DateTimeOffset Termino,
    IEnumerable<Guid> Medicos
) : IRequest<Result<EditarAtividadeMedicaResponse>>;