import React from 'react';
export default function JsonViewer({data}){return <pre className="overflow-auto rounded-md bg-muted p-3 text-xs">{JSON.stringify(data,null,2)}</pre>}
