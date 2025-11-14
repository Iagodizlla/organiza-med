using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OrganizaMed.Dominio.ModuloAtividade;

namespace OrganizaMed.Infraestrutura.Orm.ModuloAtividade;

public class MapeadorAtividadeMedicaEmOrm : IEntityTypeConfiguration<AtividadeMedica>
{
    public void Configure(EntityTypeBuilder<AtividadeMedica> modelBuilder)
    {
        modelBuilder.ToTable("TBAtividadeMedica");

        modelBuilder.Property(x => x.Id).ValueGeneratedNever();

        modelBuilder.Property(x => x.Inicio)
            .IsRequired();

        modelBuilder.Property(x => x.Termino)
            .IsRequired(false);

        modelBuilder.Property(x => x.ConfirmacaoEnviada)
            .HasColumnType("bit")
            .IsRequired();

        modelBuilder
            .HasMany(a => a.Medicos)
            .WithMany(t => t.Atividades)
            .UsingEntity(j => j.ToTable("TBAtividadeMedica_TBMedico"));

        modelBuilder
            .HasDiscriminator(x => x.TipoAtividade)
            .HasValue<Consulta>(TipoAtividadeMedica.Consulta)
            .HasValue<Cirurgia>(TipoAtividadeMedica.Cirurgia);

        modelBuilder
            .HasOne(a => a.Usuario)
            .WithMany()
            .HasForeignKey(a => a.UsuarioId)
            .IsRequired()
            .OnDelete(DeleteBehavior.NoAction);
    }
}