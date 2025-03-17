"use client";

import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const orderFormSchema = z.object({
  orderID: z.string(),
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Invalid email address"),
  status: z.enum(["pending", "processing", "shipped", "delivered", "canceled"]),
  totalAmount: z.number().min(0, "Amount must be positive")
});

type OrderFormData = z.infer<typeof orderFormSchema>;

interface OrderFormProps {
  initialData?: OrderFormData;
  onSubmit: (data: OrderFormData) => Promise<void>;
  isEdit?: boolean;
}

export default function OrderForm({ initialData, onSubmit, isEdit = false }: OrderFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: initialData || {
      orderID: '',
      customerName: '',
      customerEmail: '',
      status: 'pending',
      totalAmount: 0
    }
  });

  const handleSubmit = async (data: OrderFormData) => {
    try {
      setIsLoading(true);
      await onSubmit(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="orderID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order ID</FormLabel>
              <FormControl>
                <Input {...field} disabled={isEdit} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="customerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="customerEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select order status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="totalAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Amount</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  type="number" 
                  step="0.01"
                  onChange={e => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? 'Update Order' : 'Create Order'}
          </Button>
        </div>
      </form>
    </Form>
  );
}