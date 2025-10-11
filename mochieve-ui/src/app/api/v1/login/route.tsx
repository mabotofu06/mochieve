import { NextRequest, NextResponse } from "next/server";
import { createLogger } from "@/app/_constants/utils/logger";

export async function POST(req: NextRequest) {
  const logger = createLogger('API:Login');
  try {
    const { email, password } = await req.json();
    logger.debug("Login Attempt", { email, hasPassword: !!password });

    return NextResponse.json({status: "success"});

  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? String(err) }, { status: 500 });
  }
}