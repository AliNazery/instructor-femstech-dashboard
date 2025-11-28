import  { createContext, useContext, useState, ReactNode } from "react";

// Simple className helper
export const cn = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ");

type TabsContextType = {
  value: string;
  onValueChange: (value: string) => void;
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

/**
 * Tabs wrapper — manages tab state (value)
 */
export const Tabs = ({
  value: controlledValue,
  defaultValue,
  onValueChange,
  children,
  className,
}: TabsProps) => {
  const [uncontrolledValue, setUncontrolledValue] = useState(
    defaultValue ?? ""
  );
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const handleChange = (newValue: string) => {
    if (!isControlled) setUncontrolledValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleChange }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
};

export const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Tabs components must be used inside <Tabs>.");
  return context;
};

/**
 * TabsList — container for the tab buttons
 */
export const TabsList = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("inline-flex bg-brand-500 rounded-lg p-1", className)}>
      {children}
    </div>
  );
};

/**
 * TabsTrigger — clickable tab button
 */
export const TabsTrigger = ({
  value,
  children,
  className,
}: {
  value: string;
  children: ReactNode;
  className?: string;
}) => {
  const { value: active, onValueChange } = useTabsContext();
  const isActive = active === value;

  return (
    <button
      type="button"
      onClick={() => onValueChange(value)}
      className={cn(
        "px-4 py-1.5 text-sm font-medium rounded-md transition-all duration-200",
        isActive
          ? "bg-brand-500 text-white shadow"
          : "text-gray-600 hover:text-gray-900",
        className
      )}
    >
      {children}
    </button>
  );
};


export const TabsContent = ({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) => {
  const { value: active } = useTabsContext();
  if (active !== value) return null;
  return <div className="mt-4">{children}</div>;
};