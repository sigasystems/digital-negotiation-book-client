const FormActions = ({
  isEditing,
  isChanged,
  submitting,
  onCancel,
  onSave,
  onBack,
}) => {
  return (
    <div className="border-t border-gray-200 p-6 flex justify-end gap-3 bg-gray-50">
      {isEditing ? (
        <>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={!isChanged || submitting}
            className={`px-6 py-2 rounded-lg text-white cursor-pointer ${
              isChanged && !submitting
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </>
      ) : (
        <>
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 border rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            Back
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={!isChanged || submitting}
            className={`px-6 py-2 rounded-lg text-white cursor-pointer ${
              isChanged && !submitting
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </>
      )}
    </div>
  );
};

export default FormActions;
