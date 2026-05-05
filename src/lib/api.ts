import { NextResponse } from "next/server";

export function sendSuccessResponse<T>(data: T, message: string = "Success", status: number = 200) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}

export function sendErrorResponse(error: unknown, status: number = 500, defaultMessage: string = "Internal Server Error") {
  let message = defaultMessage;

  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === "string") {
    message = error;
  }

  return NextResponse.json(
    {
      success: false,
      message,
    },
    { status }
  );
}