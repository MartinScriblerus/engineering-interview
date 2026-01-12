import styled from '@emotion/styled';
import React, {
  forwardRef,
  createContext,
  useContext,
  useMemo,
  useState,
  useRef,
  ReactNode,
  ReactElement,
  isValidElement,
  cloneElement,
} from 'react';

export type FormValues = Record<string, string | File | (string | File)[]>;
export type ErrorsMap = Record<string, string | undefined>;
export type Validator = (values: FormValues) => ErrorsMap | Promise<ErrorsMap>;
export type OnSubmitValues = (values: FormValues, event: React.FormEvent<HTMLFormElement>) => void | Promise<void>;

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  onSubmitValues?: OnSubmitValues;
  validate?: Validator;
  validateOn?: 'submit' | 'blur' | 'change';
  preventDefault?: boolean;
  children?: React.ReactNode;
  className?: string;
}

/** Context exposed to form fields to read errors + helper to mark as touched */
const FormContext = createContext<{
  errors: ErrorsMap;
  touched: Record<string, boolean>;
  setTouched: (name: string) => void;
} | null>(null);

export const useFormContext = () => {
  const ctx = useContext(FormContext);
  if (!ctx) throw new Error('useFormContext must be used within a Form');
  return ctx;
};

const StyledForm = styled.form`
  display: block;
  width: 100%;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
`;

const StyledInput = styled.input`
  display: block;
  width: 100%;
  box-sizing: border-box;
  margin-top: 0.25rem;
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  border: 1px solid var(--color-muted, #dcdcdc);
  border-radius: var(--radius-sm, 6px);
  background: var(--surface-input-bg, var(--surface-bg, #fff));
  transition: border-color 120ms ease, box-shadow 120ms ease, transform 80ms ease;

  &:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 4px rgba(0, 112, 243, 0.08);
  }

  &[aria-invalid='true'] {
    border-color: var(--color-danger, #e55353);
    box-shadow: 0 0 0 4px rgba(229, 83, 83, 0.08);
  }
`;

/** Helper: FormData -> values object */
function formDataToObject(fd: FormData): FormValues {
  const out: FormValues = {};
  fd.forEach((value, key) => {
    if (out[key] === undefined) {
      if (value instanceof File) out[key] = value;
      else out[key] = String(value);
    } else {
      if (!Array.isArray(out[key])) out[key] = [out[key] as any];
      (out[key] as any[]).push(value instanceof File ? value : String(value));
    }
  });
  return out;
}

export const Form = forwardRef<HTMLFormElement, FormProps>(function Form(
  {
    children,
    onSubmit,
    onSubmitValues,
    validate,
    validateOn = 'submit',
    preventDefault = true,
    className,
    ...rest
  },
  ref
) {
  const [errors, setErrors] = useState<ErrorsMap>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const internalRef = useRef<HTMLFormElement | null>(null);

  const formRef = (node: HTMLFormElement | null) => {
    internalRef.current = node;
    if (!ref) return;
    if (typeof ref === 'function') ref(node);
    else if (typeof ref === 'object') (ref as any).current = node;
  };

  const setFieldTouched = (name: string) => setTouched((s) => ({ ...s, [name]: true }));

  const contextValue = useMemo(() => ({ errors, touched, setTouched: setFieldTouched }), [errors, touched]);

  const runValidate = async (values: FormValues) => {
    if (!validate) return {};
    try {
      const res = validate(values);
      if (res && typeof (res as Promise<ErrorsMap>)?.then === 'function') {
        return await (res as Promise<ErrorsMap>);
      }
      return res as ErrorsMap;
    } catch (err) {
      console.error('validation error', err);
      return { _form: 'Validation failed' };
    }
  };

  const focusFirstInvalid = (errs: ErrorsMap) => {
    if (!internalRef.current) return;
    const firstName = Object.keys(errs).find((k) => errs[k]);
    if (!firstName) return;
    const el = internalRef.current.querySelector(`[name="${firstName}"]`) as HTMLElement | null;
    if (el && typeof el.focus === 'function') el.focus();
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    if (preventDefault) e.preventDefault();

    const formEl = e.currentTarget;

    // HTML constraint validation
    if (!formEl.checkValidity()) {
      formEl.reportValidity();
      // continue to custom validation if desired
    }

    const fd = new FormData(formEl);
    const values = formDataToObject(fd);

    const errs = await runValidate(values);
    setErrors(errs || {});
    if (Object.keys(errs || {}).length > 0) {
      focusFirstInvalid(errs);
      return;
    }

    if (onSubmit) await onSubmit(e);
    if (onSubmitValues) await onSubmitValues(values, e);
  };

  const handleBlurOrChange =
    validateOn !== 'submit'
      ? async (e: React.FocusEvent | React.ChangeEvent) => {
          const formEl = internalRef.current;
          if (!formEl || !validate) return;
          const fd = new FormData(formEl);
          const values = formDataToObject(fd);
          const errs = await runValidate(values);
          setErrors(errs || {});
          const name = (e.target as HTMLInputElement).name;
          if (name) setFieldTouched(name);
        }
      : undefined;

  return (
    <FormContext.Provider value={contextValue}>
      <StyledForm
        ref={formRef}
        className={className}
        onSubmit={handleSubmit}
        onBlur={handleBlurOrChange}
        onChange={validateOn === 'change' ? (handleBlurOrChange as any) : undefined}
        {...rest}
      >
        {children}
        <div aria-live="assertive" style={{ position: 'absolute', left: -9999, top: 'auto', height: 1, width: 1, overflow: 'hidden' }}>
          {errors._form ?? ''}
        </div>
      </StyledForm>
    </FormContext.Provider>
  );
});

export default Form;

/* -------------------------
   InputFormField component
   ------------------------- */

type InputFormFieldProps = {
  name: string;
  id?: string;
  label?: string | ReactNode;
  children?: ReactNode; // optional input element to clone
  type?: string; // used only if rendering default input
  placeholder?: string;
  className?: string;
};

/**
 * InputFormField
 * - Renders a label + input (or clones a provided child input)
 * - Applies aria-invalid and aria-describedby when there's an error
 * - Marks field touched on blur
 */
export function InputFormField({
  name,
  id,
  label,
  children,
  type = 'text',
  placeholder,
  className,
}: InputFormFieldProps) {
  const { errors, setTouched } = useFormContext();
  const error = errors[name];
  const inputId = id ?? name;
  const errorId = error ? `${inputId}-error` : undefined;

  const onBlur = () => setTouched(name);

  if (children && isValidElement(children)) {
    // Clone child (input) and inject accessibility props and onBlur
    return (
      <div className={className}>
        {label && <label htmlFor={inputId}>{label}</label>}
        {cloneElement(children as ReactElement<any>, {
          id: inputId,
          name,
          'aria-invalid': !!error,
          'aria-describedby': errorId,
          onBlur: (e: any) => {
            onBlur();
            const orig = (children as ReactElement<any>).props.onBlur;
            if (typeof orig === 'function') orig(e);
          },
          // apply a base class + inline style so custom inputs match the default look
          className: `${(children as ReactElement<any>).props.className ?? ''} ui-input`.trim(),
          style: {
            display: 'block',
            width: '100%',
            boxSizing: 'border-box',
            marginTop: '0.25rem',
            padding: '0.5rem 0.75rem',
            fontSize: '1rem',
            border: '1px solid var(--color-muted, #dcdcdc)',
            borderRadius: 'var(--radius-sm, 6px)',
            background: 'var(--surface-input-bg, var(--surface-bg, #fff))',
            transition: 'border-color 120ms ease, box-shadow 120ms ease',
            ...( (children as ReactElement<any>).props.style || {} ),
          },
        })}
        {error && (
          <div id={errorId} role="alert" style={{ color: 'var(--color-accent)', marginTop: '0.25rem' }}>
            {error}
          </div>
        )}
      </div>
    );
  }

  // Default rendering if no child provided
  return (
    <div className={className}>
      {label && <label htmlFor={inputId}>{label}</label>}
      <StyledInput
        id={inputId}
        name={name}
        type={type}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={errorId}
        onBlur={onBlur}
      />
      {error && (
        <div id={errorId} role="alert" style={{ color: 'var(--color-accent)', marginTop: '0.25rem' }}>
          {error}
        </div>
      )}
    </div>
  );
}