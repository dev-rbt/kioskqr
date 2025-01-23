interface CefSharp {
  PostMessage(message: any): void;
}
enum CefSharpMessageType {
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    ORDER_SAVE_ERROR = 'ORDER_SAVE_ERROR',
    PAYMENT_PENDING = 'PAYMENT_PENDING',
    PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
    PAYMENT_ERROR = 'PAYMENT_ERROR'
}



declare global {
  interface Window {
    CefSharp: CefSharp;
    handleCefSharpError: (error: any) => void;
    handleCefSharpMessage: (Type: CefSharpMessageType, Code: string, Arg: string) => void;
  }
}

export {CefSharp, CefSharpMessageType};
