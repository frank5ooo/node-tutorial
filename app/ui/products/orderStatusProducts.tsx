"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function OrderStatus() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || '');

  useEffect(() => {
    setSelectedStatus(searchParams.get('status') || '');
  }, [searchParams]);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedStatus(value);


    console.log("value",value);

    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set('status', value);
    } else {
      params.delete('status');
    }

    // Navegar a la nueva URL
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <select
      id="status"
      name="status"
      className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
      value={selectedStatus}
      aria-describedby="customer-error"
      onChange={handleStatusChange}
    >
      <option value="">All</option>
      <option value="paid">Sell</option>
      <option value="pending">OnStock</option>
    </select>
  );
}