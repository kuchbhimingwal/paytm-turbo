import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import { TransferCard } from "../../../components/P2ptransferCard";
async function getBalance() {
    const session = await getServerSession(authOptions);
    const balance = await prisma.balance.findFirst({
        where: {
            userId: Number(session?.user?.id)
        }
    });
    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0
    }
}

async function getUsers(){
    const users = await prisma.user.findMany();
    const newUser  = users.map(({ id, name, number }) => ({ id, name , number }))
    return newUser
}

export default async function() {
    const users = await getUsers();
    console.log(users);
    
    return <div className="w-screen">
        <div>
            <TransferCard />
        </div>
    </div>
}
