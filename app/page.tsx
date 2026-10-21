import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";

export default async function Home() {
    await connection()

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        redirect("/login");
    }

    const date = new Date()
        .toLocaleDateString("en-GB", {
            timeZone: "Asia/Kolkata",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
        .split("/")
        .reverse()
        .join("-");

    redirect(`/task?date=${encodeURIComponent(date)}&complete=false`);
}