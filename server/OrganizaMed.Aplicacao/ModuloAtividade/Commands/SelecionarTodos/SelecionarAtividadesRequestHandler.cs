using FluentResults;
using MediatR;
using OrganizaMed.Aplicacao.ModuloAtividade.DTOs;
using OrganizaMed.Aplicacao.ModuloMedico.Commands.SelecionarTodos;
using OrganizaMed.Dominio.ModuloAtividade;

namespace OrganizaMed.Aplicacao.ModuloAtividade.Commands.SelecionarTodos;

public class SelecionarAtividadesRequestHandler(
    IRepositorioAtividadeMedica repositorioAtividadeMedica
) : IRequestHandler<SelecionarAtividadesMedicasRequest, Result<SelecionarAtividadesMedicasResponse>>
{
    public async Task<Result<SelecionarAtividadesMedicasResponse>> Handle(
        SelecionarAtividadesMedicasRequest request, CancellationToken cancellationToken)
    {
        IEnumerable<AtividadeMedica> registrosFiltrados;
        
        registrosFiltrados = request.TipoAtividade switch
        {
            TipoAtividadeMedica.Consulta => await repositorioAtividadeMedica.SelecionarConsultasAsync(),
            TipoAtividadeMedica.Cirurgia => await repositorioAtividadeMedica.SelecionarCirurgiasAsync(),
            _ => await repositorioAtividadeMedica.SelecionarTodosAsync()
        };

        var response = new SelecionarAtividadesMedicasResponse
        {
            QuantidadeRegistros = registrosFiltrados.Count(),
            Registros = registrosFiltrados.Select(a => new SelecionarAtividadesDto(
                a.Id,
                new SelecionarPacienteAtividadeDto(
                    a.PacienteId,
                    a.Paciente?.Nome ?? "",
                    a.Paciente?.Email ?? "",
                    a.Paciente?.Telefone ?? ""
                ),
                a.Inicio,
                a.Termino,
                a.TipoAtividade,
                a.Medicos.Select(m =>
                    new SelecionarMedicosDto(m.Id, m.Nome, m.Crm)
                )
            ))
        };

        return Result.Ok(response);
    }
}
