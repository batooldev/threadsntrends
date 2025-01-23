import { NextRequest, NextResponse } from "next/server";

// every route.ts file will contain all request mehtods such as POST, GET, DELETE, PUT
export async function GET(reqn:NextRequest) {
    console.log("GET REQUEST!!")
}