import {
  ChangeEvent,
  DetailedHTMLProps,
  HTMLAttributes,
  InputHTMLAttributes,
  useEffect,
  useMemo,
  useState,
} from "react";

interface Props
  extends Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    "value" | "onChange"
  > {
  initialValue?: number;
  onChange(newValue: number | undefined): void;
}

export function NumberInput({ initialValue, onChange, ...props }: Props) {
  const [value, setValue] = useState(initialValue?.toString() ?? "");

  useEffect(() => {
    onChange(value ? parseFloat(value) || 0 : undefined);
  }, [value]);

  function handleChage({ target }: ChangeEvent<HTMLInputElement>) {
    let value = target.value;

    // Filtrar: solo números y coma
    value = value.replace(/[^0-9,]/g, "");

    // Si hay más de una coma, quedate solo con la primera
    const parts = value.split(".");
    if (parts.length > 2) {
      value = parts[0] + "." + parts.slice(1).join("").replace(/,/g, "");
    }

    // Convertir a número real (reemplazo de coma a punto)
    const total = parseFloat(value.replace(",", "."));

    console.log("value", value);

    setValue(value);
    
    console.log("Value",(value.replace(",", ".")));
  }
  return <input {...props} value={value} onChange={handleChage} />;
}
