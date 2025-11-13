import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { TipoAtividadeMedicaEnum } from '../atividade-medica.models';

export const apenasUmMedicoPorConsulta: ValidatorFn = (
  group: AbstractControl
): ValidationErrors | null => {
  const tipo = group.get('tipoAtividade')?.value as TipoAtividadeMedicaEnum | null;
  const medicos = group.get('medicos')?.value as string[] | null;

  if (tipo === TipoAtividadeMedicaEnum.Consulta && Array.isArray(medicos) && medicos.length > 1) {
    return { apenasUmMedicoPorConsulta: true };
  }
  return null;
};
