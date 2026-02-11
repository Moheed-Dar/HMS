export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center border border-slate-200 dark:border-slate-700">
        {/* Icon / Status Code */}
        <div className="mb-6">
          <h1 className="text-6xl md:text-7xl font-bold text-red-600">403</h1>
        </div>

        {/* Main Message */}
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white mb-4">
          Access Denied
        </h2>

        <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
          You do not have permission to view this page.<br />
          This section is restricted to <span className="font-medium text-slate-800 dark:text-slate-200">Admin users</span> only.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/auth/login"
            className="inline-flex items-center justify-center px-6 py-3 bg-cyan-600 text-white font-medium rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm"
          >
            Go to Login
          </a>

          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-medium rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-colors duration-200 shadow-sm"
          >
            Back to Home
          </a>
        </div>

        {/* Optional small footer text */}
        <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">
          If you believe this is an error, please contact support.
        </p>
      </div>
    </div>
  );
}