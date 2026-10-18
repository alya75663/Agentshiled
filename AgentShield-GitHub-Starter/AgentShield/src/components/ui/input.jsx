import React from 'react';
import { cn } from '@/lib/utils';
export const Input=React.forwardRef(function Input({className,type='text',...props},ref){return <input ref={ref} type={type} className={cn('flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring',className)} {...props}/>});
