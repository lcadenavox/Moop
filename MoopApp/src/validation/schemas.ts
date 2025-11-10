import * as Yup from 'yup';
import { TFunction } from 'i18next';

// Helper to collect Yup errors into a simple map
export type ErrorMap = Record<string, string>;

export async function validateWith<T extends object>(
  schema: Yup.ObjectSchema<any>,
  values: T
): Promise<{ valid: true; errors: {} } | { valid: false; errors: ErrorMap }> {
  try {
    await schema.validate(values, { abortEarly: false, stripUnknown: true });
    return { valid: true, errors: {} };
  } catch (err: unknown) {
    if (err instanceof Yup.ValidationError) {
      const errors: ErrorMap = {};
      err.inner.forEach((e: Yup.ValidationError) => {
        if (e.path && !errors[e.path]) {
          errors[e.path] = e.message;
        }
      });
      return { valid: false, errors };
    }
    // Unexpected validation error
    return { valid: false, errors: { _form: 'Validation failed' } };
  }
}

// Auth: Login
export const createLoginSchema = (t: TFunction) =>
  Yup.object({
    email: Yup.string()
      .trim()
      .required(t('auth.common.errorEmailRequired'))
      .email(t('auth.common.errorEmailInvalid')),
    password: Yup.string()
      .trim()
      .required(t('auth.common.errorPasswordRequired'))
      .min(6, t('auth.common.errorPasswordMin')),
  });

// Auth: Register
export const createRegisterSchema = (t: TFunction) =>
  Yup.object({
    name: Yup.string()
      .trim()
      .required(t('auth.register.errorNameRequired'))
      .min(2, t('auth.register.errorNameMin')),
    email: Yup.string()
      .trim()
      .required(t('auth.common.errorEmailRequired'))
      .email(t('auth.common.errorEmailInvalid')),
    password: Yup.string()
      .trim()
      .required(t('auth.common.errorPasswordRequired'))
      .min(6, t('auth.common.errorPasswordMin')),
    confirmPassword: Yup.string()
      .trim()
      .required(t('auth.register.errorConfirmRequired'))
      .oneOf([Yup.ref('password')], t('auth.register.errorPasswordsMismatch')),
  });

// Deposito form
export const createDepositoSchema = (t: TFunction) =>
  Yup.object({
    nome: Yup.string()
      .trim()
      .required(t('deposito.form.errorNomeRequired'))
      .min(2, t('deposito.form.errorNomeMin')),
    endereco: Yup.string()
      .trim()
      .required(t('deposito.form.errorEnderecoRequired'))
      .min(5, t('deposito.form.errorEnderecoMin')),
  });

// Mecanico form
export const createMecanicoSchema = (t: TFunction) =>
  Yup.object({
    nome: Yup.string()
      .trim()
      .required(t('mecanico.form.errorNomeRequired'))
      .min(2, t('mecanico.form.errorNomeMin')),
    especialidade: Yup.string()
      .trim()
      .required(t('mecanico.form.errorEspecialidadeRequired'))
      .min(2, t('mecanico.form.errorEspecialidadeMin')),
  });

// Oficina form
export const createOficinaSchema = (t: TFunction) =>
  Yup.object({
    nome: Yup.string()
      .trim()
      .required(t('oficina.form.errorNomeRequired'))
      .min(2, t('oficina.form.errorNomeMin')),
    endereco: Yup.string()
      .trim()
      .required(t('oficina.form.errorEnderecoRequired'))
      .min(5, t('oficina.form.errorEnderecoMin')),
    telefone: Yup.string()
      .trim()
      .required(t('oficina.form.errorTelefoneRequired'))
      .test('digits', t('oficina.form.errorTelefoneDigits'), (value) =>
        (value || '').replace(/\D/g, '').length >= 10
      ),
    especialidades: Yup.array()
      .of(Yup.string())
      .min(1, t('oficina.form.errorEspecialidadesMin')),
  });

// Register slot form
export const createRegisterSlotSchema = (t: TFunction) =>
  Yup.object({
    vaga: Yup.string().trim().required(t('slot.form.errorVagaRequired')),
    modelo: Yup.string().trim().required(t('slot.form.errorModeloRequired')),
    placa: Yup.string().trim().required(t('slot.form.errorPlacaRequired')),
    cor: Yup.string().trim().required(t('slot.form.errorCorRequired')),
    observacoes: Yup.string().trim().optional(),
  });
