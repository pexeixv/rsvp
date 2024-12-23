import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { CheckIcon, XIcon } from "lucide-react";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        variant,
        ...props
      }) {
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex gap-2">
              {variant === "success" && (
                <div className="grid text-white bg-green-500 rounded-full aspect-square place-items-center size-6">
                  <CheckIcon className="size-4" />
                </div>
              )}
              {variant === "error" && (
                <div className="grid text-white bg-red-500 rounded-full aspect-square place-items-center size-6">
                  <XIcon className="size-4" />
                </div>
              )}
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
