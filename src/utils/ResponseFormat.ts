import { TResponse } from "./Types";

export const GenResObj = (
  code: number,
  success: boolean,
  message: string,
  data?: any | null
): TResponse => {
  return {
    code,
    data: {
      success,
      message,
      data,
    },
  };
};
