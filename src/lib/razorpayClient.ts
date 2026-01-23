declare global {
  interface Window {
    Razorpay?: new (options: any) => {
      open(): void;
      on(event: string, handler: (response: any) => void): void;
    };
  }
}

const CHECKOUT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

export async function loadRazorpayCheckout(): Promise<boolean> {
  if (typeof window === "undefined") {
    return false;
  }

  if (window.Razorpay) {
    return true;
  }

  return new Promise((resolve) => {
    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${CHECKOUT_SRC}"]`);
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");
    script.src = CHECKOUT_SRC;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function getRazorpay() {
  return typeof window === "undefined" ? undefined : window.Razorpay;
}
