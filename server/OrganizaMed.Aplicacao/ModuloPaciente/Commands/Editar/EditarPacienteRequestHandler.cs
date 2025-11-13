using FluentResults;
using FluentValidation;
using MediatR;
using OrganizaMed.Aplicacao.Compartilhado;
using OrganizaMed.Dominio.Compartilhado;
using OrganizaMed.Dominio.ModuloPaciente;

namespace OrganizaMed.Aplicacao.ModuloPaciente.Commands.Editar;

public class EditarPacienteRequestHandler(
    IRepositorioPaciente repositorioPaciente,
    IContextoPersistencia contexto,
    IValidator<Paciente> validador
) : IRequestHandler<EditarPacienteRequest, Result<EditarPacienteResponse>>
{
    public async Task<Result<EditarPacienteResponse>> Handle(EditarPacienteRequest request, CancellationToken cancellationToken)
    {
        var pacienteSelecionado = await repositorioPaciente.SelecionarPorIdAsync(request.Id);

        if (pacienteSelecionado == null)
            return Result.Fail(ErrorResults.NotFoundError(request.Id));
        
        pacienteSelecionado.Nome = request.Nome;
        pacienteSelecionado.Cpf = request.Cpf;
        pacienteSelecionado.Email = request.Email;
        pacienteSelecionado.Telefone = request.Telefone;
        
        var resultadoValidacao = 
            await validador.ValidateAsync(pacienteSelecionado, cancellationToken);
        
        if (!resultadoValidacao.IsValid)
        {
            var erros = resultadoValidacao.Errors
                .Select(failure => failure.ErrorMessage)
                .ToList();

            return Result.Fail(ErrorResults.BadRequestError(erros));
        }

        var pacientes = await repositorioPaciente.SelecionarTodosAsync();

        if (CpfDuplicado(pacienteSelecionado, pacientes))
            return Result.Fail(PacienteErrorResults.CpfDuplicadoError(pacienteSelecionado.Cpf));
        
        try
        {
            await repositorioPaciente.EditarAsync(pacienteSelecionado);

            await contexto.GravarAsync();
        }
        catch (Exception ex)
        {
            await contexto.RollbackAsync();
            
            return Result.Fail(ErrorResults.InternalServerError(ex));
        }
 
        return Result.Ok(new EditarPacienteResponse(pacienteSelecionado.Id));
    }
    
    private bool CpfDuplicado(Paciente paciente, IEnumerable<Paciente> pacientes)
    {
        return pacientes
            .Any(registro => 
                !registro.Id.Equals(paciente.Id) &&
                string.Equals(registro.Cpf, paciente.Cpf, StringComparison.CurrentCultureIgnoreCase)
            );
    }
}