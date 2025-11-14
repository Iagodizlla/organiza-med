using OrganizaMed.Aplicacao.ModuloMedico.Commands.SelecionarTodos;
using OrganizaMed.Dominio.ModuloAtividade;

namespace OrganizaMed.Aplicacao.ModuloAtividade.DTOs;

public record SelecionarAtividadesDto(
    Guid Id, 
    SelecionarPacienteAtividadeDto Paciente,
    DateTimeOffset Inicio,
    DateTimeOffset? Termino,
    TipoAtividadeMedica? TipoAtividade,
    IEnumerable<SelecionarMedicosDto> Medicos
);