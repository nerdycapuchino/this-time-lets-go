export default function RootPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">StudioBMS</h1>
        <p className="text-gray-400 text-lg">Enterprise Business Management System</p>
        <a 
          href="/login" 
          className="inline-block mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
        >
          Enter Application
        </a>
      </div>
    </div>
  );
}
