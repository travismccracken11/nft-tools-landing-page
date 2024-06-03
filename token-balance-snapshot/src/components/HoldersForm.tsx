/*-
 *
 * Token Balance Snapshot
 *
 * Copyright (C) 2024 Hedera Hashgraph, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import dictionary from '@/dictionary/en.json';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { formSchema } from '@/utils/formSchema';
import { useFieldArray, useForm, UseFormProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { nodeUrl } from '@/utils/const';
import { toast } from 'sonner';
import { TokenDetails } from '@/types/tokenDetails-response';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { isValidTokenId } from '@/utils/isValidTokenId';
import { Progress } from '@/components/ui/progress';

type HoldersFormProps = {
  setFormData: (formData: FormData['formData']) => void;
  setData: (data: any) => void;
  setShouldFetch: (shouldFetch: boolean) => void;
  setTokenDetailsList: (tokenDetailsList: TokenDetails[]) => void;
  tokenDetailsList: TokenDetails[] | undefined;
  isBalancesFetching: boolean;
  progress: number;
};

export type FormData = {
  formData: {
    tokenId: string;
    minAmount?: string;
    tokenName: string;
    isDurationSelect: boolean;
    isCollapsed: boolean;
    duration?: Date;
  }[];
};

export const HoldersForm = ({
  setFormData,
  setData,
  setShouldFetch,
  isBalancesFetching,
  setTokenDetailsList,
  tokenDetailsList,
  progress,
}: HoldersFormProps) => {
  const useZodForm = <TSchema extends z.ZodType>(
    props: Omit<UseFormProps<TSchema['_input']>, 'resolver'> & {
      schema: TSchema;
    },
  ) => {
    return useForm<TSchema['_input']>({
      ...props,
      resolver: zodResolver(props.schema, undefined, {
        raw: true,
      }),
    });
  };

  const methods = useZodForm({
    schema: formSchema(tokenDetailsList || []),
    defaultValues: {
      formData: [
        {
          tokenId: '',
          minAmount: '',
          tokenName: '',
          isDurationSelect: false,
          duration: undefined,
          isCollapsed: false,
        },
      ],
    },
  });

  const { control, handleSubmit, getValues, setValue } = methods;

  const { fields, update } = useFieldArray({
    name: 'formData',
    control,
  });

  const fetchTokenData = async (url: string, index: number, formData: FormData['formData'][0]) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`${dictionary.httpError} ${response.status}`);
      }

      const data: TokenDetails = await response.json();
      setTokenDetailsList(tokenDetailsList ? [...tokenDetailsList, data] : [data]);

      update(index, {
        tokenId: formData.tokenId,
        minAmount: formData.minAmount,
        tokenName: data.name,
        isDurationSelect: formData.isDurationSelect,
        duration: formData.duration,
        isCollapsed: formData.isCollapsed,
      });
      return data;
    } catch (error) {
      toast.error((error as Error).toString());
      // If token is not found, set tokenName to error message
      update(index, {
        tokenId: formData.tokenId,
        minAmount: formData.minAmount,
        tokenName: dictionary.wrongTokenId,
        isDurationSelect: formData.isDurationSelect,
        duration: formData.duration,
        isCollapsed: formData.isCollapsed,
      });
    }
  };

  const onSubmit = (data: FormData) => {
    setFormData(data.formData);
    setData([]);
    setShouldFetch(true);
  };

  const handleTokenIdBlur = async (tokenId: string, index: number) => {
    if (tokenId && isValidTokenId(tokenId)) {
      const url = `${nodeUrl}/api/v1/tokens/${tokenId}`;
      try {
        await fetchTokenData(url, index, getValues().formData[index]);
      } catch (error) {
        toast.error((error as Error).toString());
      }
    }
  };

  const handleTokenIdChange = (tokenId: string, index: number) => {
    if (!tokenId && !isValidTokenId(tokenId)) {
      const formData = getValues().formData[index];
      update(index, {
        tokenId: formData.tokenId,
        minAmount: formData.minAmount,
        tokenName: '',
        isDurationSelect: formData.isDurationSelect,
        duration: formData.duration,
        isCollapsed: formData.isCollapsed,
      });
    }
  };

  return (
    <Form {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {fields.map((field, index) => (
          <div className="flex flex-col justify-center" key={field.id}>
            <div className="flex flex-col items-start justify-center gap-4">
              <div className="mx-auto mb-4 w-full sm:w-1/2">
                <FormField
                  control={control}
                  name={`formData.${index}.tokenId`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary.tokenId}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            placeholder={dictionary.exampleTokenId}
                            onChange={(event) => {
                              field.onChange(event);
                              handleTokenIdChange(event.target.value, index);
                            }}
                            onBlur={(event) => {
                              field.onBlur();
                              void handleTokenIdBlur(event.target.value, index);
                            }}
                          />
                          {fields[index].tokenName && <p className="absolute top-[103%] text-sm text-muted-foreground">{fields[index].tokenName}</p>}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mx-auto w-full sm:w-1/2 sm:max-w-full">
                <FormField
                  control={control}
                  name={`formData.${index}.minAmount`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dictionary.minAmount}</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} placeholder={dictionary.minAmountPlaceholder} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mx-auto mt-2 w-full sm:w-1/2 sm:max-w-full">
                <FormField
                  control={control}
                  name={`formData.${index}.duration`}
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{dictionary.setDate}</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={'outline'}
                              className={cn('min-w-[138px] pl-3 text-left font-normal sm:w-[1/2]', !field.value && 'text-muted-foreground')}
                            >
                              {field.value ? format(field.value, 'PPP') : <span>{dictionary.pickADate}</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={new Date(field.value || '')}
                            onSelect={(date) => {
                              field.onChange(date);
                              setValue(`formData.${index}.isDurationSelect`, true, { shouldValidate: true });
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        ))}

        <div className="flex items-center justify-center">
          <div className="w-full sm:w-1/2 sm:max-w-full">
            {isBalancesFetching ? (
              <Progress className="my-1" value={progress} />
            ) : (
              <Button data-testid="submit" className="w-full" disabled={isBalancesFetching} type="submit">
                {dictionary.buildList}
              </Button>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
};
