import * as React from "react";
import { cn } from "@/lib/utils";

interface InputPriceProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value?: number | string;
  onChange?: (value: number) => void;
  prefix?: string;
  allowNegative?: boolean;
  decimalScale?: number;
  onBlur?: () => void;
  onFocus?: () => void;
}

const InputPrice = React.forwardRef<HTMLInputElement, InputPriceProps>(
  (
    {
      value = "",
      onChange,
      prefix = "Rp",
      placeholder = "0",
      className,
      disabled = false,
      allowNegative = false,
      decimalScale = 0,
      onBlur,
      onFocus,
      ...props
    },
    ref,
  ) => {
    const [displayValue, setDisplayValue] = React.useState("");
    const [isFocused, setIsFocused] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Format number with thousand separators
    const formatNumber = (num: number | string): string => {
      if (num === "" || num === null || num === undefined) return "";

      const numStr = String(num);
      const numValue = parseFloat(numStr);

      if (isNaN(numValue)) return "";

      // Handle decimal scale
      const parts = numValue.toFixed(decimalScale).split(".");
      const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      const decimalPart = parts[1];

      return decimalScale > 0 ? `${integerPart},${decimalPart}` : integerPart;
    };

    // Parse formatted string to number
    const parseFormattedNumber = (str: string): number => {
      if (!str) return 0;
      // Remove thousand separators (.) and replace comma (,) with dot for decimal
      const cleanStr = str.replace(/\./g, "").replace(/,/g, ".");
      const parsed = parseFloat(cleanStr);
      return isNaN(parsed) ? 0 : parsed;
    };

    // Update display value when value prop changes
    React.useEffect(() => {
      if (!isFocused) {
        const numValue = typeof value === "string" ? parseFloat(value) : value;
        setDisplayValue(formatNumber(numValue || ""));
      }
    }, [value, isFocused]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.currentTarget.value;
      const cursorPosition = e.currentTarget.selectionStart || 0;
      const inputLength = inputValue.length;

      // Remove prefix if present
      const valueWithoutPrefix = prefix
        ? inputValue.replace(prefix, "").trim()
        : inputValue;

      // Allow only numbers, dots, commas, and minus (if allowed)
      const regex = allowNegative ? /^-?[\d.,]*$/ : /^[\d.,]*$/;

      if (!regex.test(valueWithoutPrefix) && valueWithoutPrefix !== "") {
        return;
      }

      // Parse the input to get numeric value
      const numericValue = parseFormattedNumber(valueWithoutPrefix);

      // Format the value
      const formattedValue = formatNumber(numericValue);
      setDisplayValue(formattedValue);

      // Determine if cursor was at the end before formatting
      const cursorWasAtEnd = cursorPosition === inputLength;

      // Calculate new cursor position after formatting
      let newCursorPos = 0;

      if (cursorWasAtEnd) {
        // If cursor was at the end, keep it at the end
        newCursorPos = formattedValue.length;
      } else {
        // Otherwise, calculate based on digit count before cursor
        const beforeCursor = valueWithoutPrefix.slice(
          0,
          cursorPosition - (prefix ? prefix.length + 1 : 0),
        );
        const digitsBeforeCursor = beforeCursor.replace(/[^\d]/g, "").length;

        let digitCount = 0;
        for (let i = 0; i < formattedValue.length; i++) {
          if (/\d/.test(formattedValue[i])) {
            digitCount++;
            if (digitCount >= digitsBeforeCursor) {
              newCursorPos = i + 1;
              break;
            }
          }
        }
      }

      // Adjust for prefix
      if (prefix) {
        newCursorPos += prefix.length + 1;
      }

      // Set cursor position after React updates the DOM
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
      }, 0);

      // Call onChange with numeric value
      if (onChange) {
        onChange(numericValue);
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      // Select all text on focus for easy editing
      e.currentTarget.select();
      if (onFocus) onFocus();
    };

    const handleBlur = () => {
      setIsFocused(false);
      // Reformat on blur
      const numValue = typeof value === "string" ? parseFloat(value) : value;
      setDisplayValue(formatNumber(numValue || ""));
      if (onBlur) onBlur();
    };

    const displayValueWithPrefix = prefix
      ? `${prefix} ${displayValue}`
      : displayValue;

    return (
      <input
        ref={(node) => {
          inputRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            (ref as React.MutableRefObject<HTMLInputElement | null>).current =
              node;
          }
        }}
        type="text"
        value={displayValueWithPrefix}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={prefix ? `${prefix} ${placeholder}` : placeholder}
        disabled={disabled}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        autoComplete="off"
        {...props}
      />
    );
  },
);
InputPrice.displayName = "InputPrice";

export { InputPrice };
