interface LoadingOverlayProps {
  isVisible: boolean;
}

export function LoadingOverlay({ isVisible }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center">
        <div className="loader mx-auto mb-4" />
        <p className="text-gray-300">Processing your request...</p>
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          .loader {
            width: 50px;
            height: 50px;
            border: 5px solid #007aff;
            border-top: 5px solid #ff2d55;
            border-radius: 50%;
            animation: spin 0.7s linear infinite;
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `
      }} />
    </div>
  );
}
