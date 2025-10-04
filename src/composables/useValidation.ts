export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  email?: boolean;
  custom?: (value: any) => string | null;
}

export interface ValidationErrors {
  [key: string]: string;
}

export function useValidation() {
  const validateField = (value: any, rules: ValidationRule): string | null => {
    if (rules.required && (!value || value.toString().trim() === '')) {
      return 'Este campo es requerido';
    }

    if (value && rules.minLength && value.toString().length < rules.minLength) {
      return `Debe tener al menos ${rules.minLength} caracteres`;
    }

    if (value && rules.maxLength && value.toString().length > rules.maxLength) {
      return `No puede tener más de ${rules.maxLength} caracteres`;
    }

    if (value && rules.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Debe ser un email válido';
      }
    }

    if (value && rules.custom) {
      return rules.custom(value);
    }

    return null;
  };

  const validateForm = (data: any, rules: { [key: string]: ValidationRule }): ValidationErrors => {
    const errors: ValidationErrors = {};

    Object.keys(rules).forEach(field => {
      const error = validateField(data[field], rules[field]);
      if (error) {
        errors[field] = error;
      }
    });

    return errors;
  };

  const hasErrors = (errors: ValidationErrors): boolean => {
    return Object.keys(errors).length > 0;
  };

  return {
    validateField,
    validateForm,
    hasErrors
  };
}
