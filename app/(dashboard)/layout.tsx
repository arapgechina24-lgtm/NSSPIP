import { AuthProvider } from "@/contexts/nctirs/AuthContext"
import { SessionProvider } from "next-auth/react"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SessionProvider>
            <AuthProvider>
                <div className="flex h-screen w-full bg-black text-green-500 overflow-hidden relative font-mono">
                    {children}
                </div>
            </AuthProvider>
        </SessionProvider>
    )
}
