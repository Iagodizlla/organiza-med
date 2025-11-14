using OrganizaMed.Aplicacao.ModuloAtividade.DTOs;
using OrganizaMed.Dominio.ModuloAtividade;

namespace OrganizaMed.Aplicacao.ModuloAtividade.Commands.SelecionarPorId;

public record SelecionarAtividadeMedicaPorIdResponse(
    Guid Id,
    SelecionarPacienteAtividadeDto Paciente,
    DateTimeOffset Inicio,
    DateTimeOffset? Termino,
    TipoAtividadeMedica TipoAtividade,
    IEnumerable<SelecionarMedicoAtividadeDto> Medicos
);