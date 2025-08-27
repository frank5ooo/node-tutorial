"use client";

export default function OrderStatus() {
  // NOTE: Uncomment this code in Chapter 11

  return (
    
      <select
        id="status"
        name="status"
        className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
        defaultValue=""
        aria-describedby="customer-error"
      >
        <option value="">All</option>
        <option value="paid">Paid</option>
        <option value="pending">Pending</option>
      </select>
    
  );
}
