interface WebView {
  postMessage(message: any): void;
}
enum WebViewMessageType {
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    ORDER_SAVE_ERROR = 'ORDER_SAVE_ERROR',
    PAYMENT_PENDING = 'PAYMENT_PENDING',
    PAYMENT_SUCCESS = 'PAYMENT_SUCCESS',
    PAYMENT_ERROR = 'PAYMENT_ERROR',
    ECR_NOT_CONNECTED = 'ECR_NOT_CONNECTED',
    ECR_ERROR = 'ECR_ERROR',
    SALE_RESPONSE = 'SALE_RESPONSE',
    ACTION_RESPONSE = 'ACTION_RESPONSE',
    PAYMENT_PRINTING = 'PAYMENT_PRINTING'
}



declare global {
  interface Window {
    chrome: {
      webview: WebView;
    };
    handleWebViewError: (error: any) => void;
    handleWebViewMessage: (Type: WebViewMessageType, Code: string, Arg: string) => void;
  }
}

export {WebView, WebViewMessageType};
