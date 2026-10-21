import { Navbar } from "../../components/navbar/goalNavbar";
import { TaskNavbar } from "../../components/taskSection";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { Token } from "@/lib/token";
import User from "@/models/user";
import Todo from "@/models/todo";
import { JwtPayload } from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import { TodoList } from "@/components/tasks";
import { InputTodo } from "@/components/input";
import { connection } from "next/server";

type TasksProps = {
    searchParams: Promise<{
        date?: string;
        complete?: string;
    }>;
};


interface Payload extends JwtPayload {
    id: string;
    username: string;
    goal:string;
}

export default async function Tasks({ searchParams }: TasksProps) {
    await connection()

    const { date,complete } = await searchParams

    await connectDB();

    const isComplete = complete === "true";
    

    const res = await GetTask(date ?? "", isComplete);

    const percen = res.todos === 0 ? 0 : Math.floor(res.complete/res.todos*100)
    
    

    return(
        <>
        <Navbar title={res.goal} percentage={percen} />
        <TaskNavbar completed={res.complete} uncompleted={!isComplete ? res.uncomplete : null} date={date ?? ""} taskStatus={isComplete} />
        <TodoList todos={res.tasks} />
        <InputTodo date={date} />
        {/* <CalendarPopup open={true} /> */}
        </>

    ) 
}


async function GetTask(date: string, complete: boolean) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

   

    if (!token) {
        redirect("/login");
    }

    let decoded: string | JwtPayload;

    try {
        decoded = Token.verify(token);
    } catch {
        redirect("/login");
    }

    if (
        typeof decoded === "string" ||
        typeof decoded.id !== "string"
    ) {
        redirect("/login");
    }

    const payload = decoded as Payload;

    const user = await User.findById(payload.id).lean();

    if (!user) {
        redirect("/login");
    }

    const todos = await Todo.find({
        user: user._id,
        date,
    }).lean().then(docs => docs.map(doc => {
        // Convert to plain object, handling ObjectId fields
        const plain = doc as any;
        return {
            ...plain,
            _id: plain._id?.toString() || plain._id,
            user: plain.user?.toString() || plain.user,
            createdAt: plain.createdAt?.toString() || plain.createdAt,
            updatedAt: plain.updatedAt?.toString() || plain.updatedAt,
        };
    }));

    const priorityOrder: Record<string, number> = {
        high: 1,
        medium: 2,
        low: 3,
        normal: 4,
    };

    const sortTasks = (tasks: any[]) =>
        tasks.sort((a, b) => {
            // 1. Priority: high > medium > low > normal
            const priorityDifference =
                (priorityOrder[a.priority] ?? 5) -
                (priorityOrder[b.priority] ?? 5);

            if (priorityDifference !== 0) {
                return priorityDifference;
            }

            // 2. CreatedAt: newest first
            return (
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
        });

    if( complete ) {
        const completed = await Todo.find({
            user: user._id,
            date,
            completed: complete,
        })
            .lean()
            .then(docs =>
                docs.map(doc => {
                    const plain = doc as any;
                    return {
                        ...plain,
                        _id: plain._id?.toString() || plain._id,
                        user: plain.user?.toString() || plain.user,
                        createdAt: plain.createdAt?.toString() || plain.createdAt,
                        updatedAt: plain.updatedAt?.toString() || plain.updatedAt,
                    };
                })
            );

        sortTasks(completed);

        return {
            todos: todos.length,
            complete: completed.length,
            uncomplete: todos.length - completed.length,
            goal: user.goal,
            tasks: completed
        }
    }
    else {
        const uncompleted = await Todo.find({
            user: user._id,
            date,
            completed: complete,
        })
            .lean()
            .then(docs =>
                docs.map(doc => {
                    const plain = doc as any;
                    return {
                        ...plain,
                        _id: plain._id?.toString() || plain._id,
                        user: plain.user?.toString() || plain.user,
                        createdAt: plain.createdAt?.toString() || plain.createdAt,
                        updatedAt: plain.updatedAt?.toString() || plain.updatedAt,
                    };
                })
            );

        sortTasks(uncompleted);

        return {
            todos: todos.length,
            complete: todos.length - uncompleted.length,
            uncomplete: uncompleted.length,
            goal: user.goal,
            tasks: uncompleted
        }
    }


}


