export default function FormSection({ icon: Icon, title, children }) {
  return (
    <div className="px-6 sm:px-8 py-8 border-b border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gray-100 rounded-lg">
          <Icon className="w-6 h-6 text-gray-700" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h2>
      </div>

      {children}
    </div>
  );
}
