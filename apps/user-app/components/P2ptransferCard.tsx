"use client"
import { Card } from "@repo/ui/card";
import { useState } from "react";
import { TextInput } from "@repo/ui/textinput";
import { Button } from "@repo/ui/button";
import {p2ptransfer} from "../app/lib/actions/p2ptransfer"
export const TransferCard = () =>{
  const [number, setNumber] = useState("");
  const [amount, setAmount] = useState(0);
  
  return <Card title="P2p transfer">
      <div className="border">
        <div>
        <TextInput label={"Phone number"} placeholder={"number"} onChange={(value) => {
            setNumber(value)
        }} />
        <TextInput label={"Amount to send"} placeholder={"amount"} onChange={(value) => {
            setAmount(value)
        }} />
        </div>
        <div className="flex justify-center pt-4">
            <Button onClick={async() => {
              
                await p2ptransfer(amount * 100, number);
            }}>
            Add Money
            </Button>
        </div>
      </div>
    </Card>
}