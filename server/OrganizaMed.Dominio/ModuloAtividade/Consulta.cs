using OrganizaMed.Dominio.ModuloMedico;

namespace OrganizaMed.Dominio.ModuloAtividade;

public class Consulta : AtividadeMedica
{
    public override TipoAtividadeMedica TipoAtividade
    {
        get => TipoAtividadeMedica.Consulta;
        set => tipoAtividade = value;
    }

    protected Consulta() { }

    public Consulta(DateTimeOffset inicio, DateTimeOffset? termino) : base(inicio, termino)
    {
    }

    public Consulta(DateTimeOffset inicio, DateTimeOffset? termino, Medico medico) : base(inicio, termino)
    {
        Medicos.Add(medico);
        medico.RegistrarAtividade(this);
    }

    public override TimeSpan ObterPeriodoDescanso() => TimeSpan.FromMinutes(10);
}