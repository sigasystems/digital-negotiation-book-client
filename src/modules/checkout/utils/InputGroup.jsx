import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* Small helper for cleaner repeated input fields */
export function InputGroup({ label, name, value, onChange, placeholder, required, error }) {
  return (
    <div className="space-y-2">
      <Label
       htmlFor={name}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={name}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
