"use server"

import db from '@repo/db/client'
import { getServerSession } from 'next-auth'
import { authOptions } from "../auth"

export async function p2ptransfer(amount:number ,number:string){

  const sessoin = await getServerSession(authOptions);
  const user = sessoin.user;
  if(!user){
    return {
      message: "User not logged in"
    }
  }
  if(user.number == number){
    return{
      message:"you cant send money to yourself"
    }
  }
  const userCheck = await db.user.findUnique({
    where:{
      number: number
    }
  })
  console.log(userCheck);
  
  if(!userCheck){
    return{
      message : "user does not have a account"
    }
  }
  await db.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(user.id)} FOR UPDATE`;
      const fromBalance = await tx.balance.findUnique({
          where: { userId: Number(user.id) },
        });
        if (!fromBalance || fromBalance.amount < amount) {
          throw new Error('Insufficient funds');
        }

        await tx.p2pTransfer.create({
          data:{
            amount,
            timestamp: new Date(),
            fromUserId: Number(user.id),
            toUserId: Number(userCheck.id)
          }
        })
        await tx.balance.update({
          where: { userId: Number(user.id) },
          data: { amount: { decrement: amount } },
        });

        await tx.balance.update({
          where: { userId: userCheck.id },
          data: { amount: { increment: amount } },
        });
  });
}