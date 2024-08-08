export interface FormFields {
  type: string;
  label: string;
  placeholder?: string;
  value?: string;
  suggestions?: string[];
  error?: string;
  maxDate?: string;
  required?: boolean;
  name: string;
}
