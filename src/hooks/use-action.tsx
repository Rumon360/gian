"use client";

import { useCallback, useState } from "react";

type ActionResponse<TOutput> = {
  success?: boolean;
  error?: string;
  data?: TOutput;
  msg?: string;
};

type Action<TInput, TOutput> = (
  data: TInput
) => Promise<ActionResponse<TOutput>>;

interface UseActionOptions<TOutput> {
  onSuccess?: (data: TOutput) => void;
  onError?: (error: string) => void;
  onComplete?: () => void;
}

export const useAction = <TInput, TOutput>(
  schema: any,
  action: Action<TInput, TOutput>,
  options: UseActionOptions<TOutput> = {}
) => {
  const [error, setError] = useState<string | undefined>();
  const [data, setData] = useState<TOutput | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(
    async (input: TInput) => {
      setIsLoading(true);
      setError(undefined);
      setData(undefined);

      try {
        const response = await action(input);

        if (response.error) {
          setError(response.error);
          options.onError?.(response.error);
        }

        if (response.data) {
          setData(response.data);
          options.onSuccess?.(response.data);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Something went wrong";
        setError(errorMessage);
        options.onError?.(errorMessage);
      } finally {
        setIsLoading(false);
        options.onComplete?.();
      }

      return { error, data };
    },
    [action, data, error, options]
  );

  return {
    execute,
    error,
    data,
    isLoading,
  };
};
