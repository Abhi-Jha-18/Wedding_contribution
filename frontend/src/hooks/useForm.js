import { useState, useCallback } from 'react';

/**
 * Generic form handler.
 *
 * @param {Object} initialValues   – default field values
 * @param {Object} validationRules – { fieldName: (value, allValues) => { valid, message } }
 */
export function useForm(initialValues = {}, validationRules = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value, type, files } = e.target;
    setValues((prev) => ({ ...prev, [name]: type === 'file' ? files[0] : value }));
    // clear error on change
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  const handleBlur = useCallback(
    (e) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      if (validationRules[name]) {
        const result = validationRules[name](values[name], values);
        if (!result.valid) setErrors((prev) => ({ ...prev, [name]: result.message }));
      }
    },
    [validationRules, values],
  );

  const validate = useCallback(() => {
    const newErrors = {};
    let isValid = true;
    for (const [field, rule] of Object.entries(validationRules)) {
      const result = rule(values[field], values);
      if (!result.valid) {
        newErrors[field] = result.message;
        isValid = false;
      }
    }
    setErrors(newErrors);
    setTouched(
      Object.keys(validationRules).reduce((acc, k) => ({ ...acc, [k]: true }), {}),
    );
    return isValid;
  }, [validationRules, values]);

  const handleSubmit = useCallback(
    (onSubmit) => async (e) => {
      e.preventDefault();
      if (!validate()) return;
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [validate, values],
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    validate,
    resetForm,
    setFieldValue,
    setValues,
  };
}
