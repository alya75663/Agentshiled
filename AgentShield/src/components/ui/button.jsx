import React from 'react';
import { cn } from '@/lib/utils';
export const Button = React.forwardRef(function Button({className,variant='default',type='button',...props},ref){
 const styles={default:'bg-primary text-primary-foreground hover:opacity-90',outline:'border border-input bg-background hover:bg-muted',destructive:'bg-destructive text-destructive-foreground',ghost:'hover:bg-muted'};
 return <button ref={ref} type={type} className={cn('inline-flex items-center justify-center rounded-md px-4 py-2 text-sm transition disabled:opacity-50 disabled:pointer-events-none',styles[variant]||styles.default,className)} {...props}/>;
});
