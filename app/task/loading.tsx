export default function Loading() {
    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="flex items-center gap-3">
                <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-violet-600" />
                <p>Loading your tasks...</p>
            </div>
        </div>
    );
}