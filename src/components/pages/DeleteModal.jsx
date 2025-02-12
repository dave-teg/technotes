import { Button } from "../ui/button";

const DeleteModal = ({ isOpen, onClose, onConfirm, item }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/70">
      <div className="z-15 w-96 rounded-md bg-gray-700 px-5 py-4 ">
        <h3 className="mb-2 text-xl font-semibold">Confirm Deletion</h3>
        <p className="mb-9 text-sm text-gray-200">
          Are you sure you want to delete this {item}?
        </p>
        <div className="flex justify-end gap-3">
          {/* <button onClick={onClose} className="text-sm px-2 py-1 bg-gray-400 rounded-sm cursor-pointer hover:bg-gray-500">Cancel</button> */}
          <Button
            onClick={onClose}
            variant="secondary"
            size="sm"
            className="cursor-pointer"
          >
            Cancel
          </Button>
          {/* <button
            onClick={onConfirm}
            className="cursor-pointer rounded-sm bg-red-500 px-2 py-1 text-sm font-semibold hover:bg-red-600"
          >
            Delete
          </button> */}
          <Button
            onClick={onConfirm}
            variant="destructive"
            size="sm"
            className="cursor-pointer"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
