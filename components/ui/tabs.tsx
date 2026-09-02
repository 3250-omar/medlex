import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cn } from "@/lib/utils";

function Tabs({ className, ...props }: TabsPrimitive.Root.Props) {
  return <TabsPrimitive.Root className={cn("w-full", className)} {...props} />;
}

function TabsList({ className, ...props }: TabsPrimitive.List.Props) {
  return (
    <TabsPrimitive.List
      className={cn("flex border-b border-line", className)}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      className={cn(
        "relative min-h-11 flex-1 border-b-2 border-transparent px-4 font-body text-sm text-muted transition-colors hover:text-white data-active:border-signal data-active:text-signal focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-signal",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return <TabsPrimitive.Panel className={cn("pt-6", className)} {...props} />;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };