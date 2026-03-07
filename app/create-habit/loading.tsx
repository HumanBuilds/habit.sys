export default function Loading() {
    return (
        <div className="h-full flex items-center justify-center p-4 md:p-8 !pb-0">
            <div className="w-full max-w-2xl text-center">
                <p className="text-2xl animate-pulse tracking-widest uppercase font-bold">
                    INITIALIZING MODULE...
                </p>
            </div>
        </div>
    );
}
