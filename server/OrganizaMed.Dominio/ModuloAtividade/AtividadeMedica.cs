using OrganizaMed.Dominio.Compartilhado;
using OrganizaMed.Dominio.ModuloMedico;
using OrganizaMed.Dominio.ModuloPaciente;

namespace OrganizaMed.Dominio.ModuloAtividade;

public enum TipoAtividadeMedica
{
    Consulta,
    Cirurgia
}

public abstract class AtividadeMedica : EntidadeBase
{
    public Guid PacienteId { get; set; }
    public Paciente? Paciente { get; set; }
    public DateTimeOffset Inicio { get; set; }
    public DateTimeOffset? Termino { get; set; }
    public bool ConfirmacaoEnviada { get; set; }
    public List<Medico> Medicos { get; set; }

    protected TipoAtividadeMedica tipoAtividade;
    public abstract TipoAtividadeMedica TipoAtividade { get; set; }

    protected AtividadeMedica()
    {
        Medicos = [];
    }

    protected AtividadeMedica(DateTimeOffset inicio, DateTimeOffset? termino) : this()
    {
        Inicio = inicio.ToUniversalTime();
        Termino = termino?.ToUniversalTime();
    }

    public abstract TimeSpan ObterPeriodoDescanso();

    public void AdicionarMedico(Medico medicoParaAdicionar)
    {
        if (Medicos.Contains(medicoParaAdicionar))
            return;

        Medicos.Add(medicoParaAdicionar);

        medicoParaAdicionar.RegistrarAtividade(this);
    }

    public void RemoverMedico(Medico medicoParaRemover)
    {
        if (!Medicos.Contains(medicoParaRemover))
            return;

        Medicos.Remove(medicoParaRemover);

        medicoParaRemover.RemoverAtividade(this);
    }
}