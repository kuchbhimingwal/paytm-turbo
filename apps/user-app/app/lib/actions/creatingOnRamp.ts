"use server"

import db from '@repo/db/client'
import { getServerSession } from 'next-auth'
import { authOptions } from "../auth"

export async function createOnRamp(amount: number, provider: string ){
  const sessoin = await getServerSession(authOptions);
  const token = Math.random().toString();
  const userId = sessoin.user.id;
  if(!userId){
    return {
      message: "User not logged in"
    }
  }
  await db.onRampTransaction.create({
    data:{
      userId: Number(userId),
      amount: amount,
      status: "Processing",
      startTime: new Date(),
      provider,
      token
    }
  })

  return {
    messsage: "On ramp trsansaction added"
  }
}