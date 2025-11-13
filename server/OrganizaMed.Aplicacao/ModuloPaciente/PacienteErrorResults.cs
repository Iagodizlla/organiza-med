using FluentResults;

namespace OrganizaMed.Aplicacao.ModuloPaciente;

public abstract class PacienteErrorResults
{
    public static Error CpfDuplicadoError(string cpf)
    {
        return new Error("CPF duplicado")
            .CausedBy($"Um paciente com o CPF '{cpf}' já foi cadastrado")
            .WithMetadata("ErrorType", "BadRequest");
    }
}