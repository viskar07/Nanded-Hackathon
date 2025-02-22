// components/Modal.tsx

const Modal = ({ isOpen, onClose, children }:any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/3">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>
          &times;
        </button>
        {children}
        {/* Cancel Button */}
        <div className="mt-4 flex justify-end">
          <button 
            className="px-4 py-2 bg-gray-300 text-black rounded-md mr-2" 
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
