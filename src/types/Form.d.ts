export interface FormFields {
  type: string;
  label: string;
  name: string;
  placeholder?: string;
  value?: string;
  suggestions?: string[];
  error?: string;
  max?: string;
  required?: boolean;
  subType?: string;
}
