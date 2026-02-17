import { auth } from "@/auth"

export default auth((req) => {
    // restricted routes logic can go here
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
