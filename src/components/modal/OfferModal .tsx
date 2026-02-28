interface OfferModalProps {
  onClose: () => void;
  imageUrl?: string;
}

export default function OfferModal({ onClose, imageUrl }: OfferModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-md relative shadow-2xl">
        <button onClick={onClose} className="absolute top-2 right-3 text-xl cursor-pointer">
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-2">🎉 Special Alumni Frame!</h2>
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Offer"
            className="w-full h-50 object-contain rounded-lg mb-4"
          />
        )}
        <p className="mb-4">Create frame with your photos. 📸</p>

        <button
          onClick={() =>
            window.open(
              "https://photoframe.creativeshop.store/frame/3",
              "_blank",
            )
          }
          className="bg-emerald-500 text-white px-4 py-2 rounded-lg cursor-pointer"
        >
          Create Frame
        </button>
      </div>
    </div>
  );
}
