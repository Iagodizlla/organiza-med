using FluentResults;

namespace OrganizaMed.Aplicacao.ModuloPaciente;

public abstract class PacienteErrorResults
{
    private static bool CpfDuplicado(Paciente paciente, IEnumerable<Paciente> pacientes)
    {
        return pacientes.Any(registro =>
            registro.Id != paciente.Id &&
            string.Equals(
                registro.Cpf,
                paciente.Cpf,
                StringComparison.OrdinalIgnoreCase));
    }
}