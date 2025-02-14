"use client";


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Trash2, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

// Define types based on the schema
interface Product {
  productID: string;
  name: string;
  quantity: number;
  price: number;
}

interface OrderFormData {
  orderID: string;
  customerName: string;
  customerEmail: string;
  products: Product[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'canceled';
}

interface OrderFormProps {
  initialData?: Partial<OrderFormData>;
  onSubmit: (data: OrderFormData) => void;
  isEdit?: boolean;
}

const defaultProduct: Product = {
  productID: '',
  name: '',
  quantity: 1,
  price: 0
};

const statusOptions = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'canceled'
];

const OrderForm: React.FC<OrderFormProps> = ({
  initialData,
  onSubmit,
  isEdit = false
}) => {
  // Initialize form state with initial data or default values
  const [formData, setFormData] = useState<OrderFormData>({
    orderID: initialData?.orderID || (isEdit ? '' : uuidv4()),
    customerName: initialData?.customerName || '',
    customerEmail: initialData?.customerEmail || '',
    products: initialData?.products || [{ ...defaultProduct }],
    totalAmount: initialData?.totalAmount || 0,
    status: initialData?.status || 'pending',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof OrderFormData, string>>>({});
  const [productErrors, setProductErrors] = useState<{ [key: number]: Partial<Record<keyof Product, string>> }>({});

  // Validate email format
  const validateEmail = (email: string): boolean => {
    const re = /.+@.+\..+/;
    return re.test(email);
  };

  // Update form data
  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name as keyof OrderFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle product changes
  const handleProductChange = (index: number, field: keyof Product, value: string | number) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: value
    };
    
    // Recalculate total amount
    const newTotalAmount = calculateTotalAmount(updatedProducts);
    
    setFormData(prev => ({
      ...prev,
      products: updatedProducts,
      totalAmount: newTotalAmount
    }));
    
    // Clear error for this field
    if (productErrors[index]?.[field]) {
      const newProductErrors = { ...productErrors };
      newProductErrors[index] = { ...newProductErrors[index], [field]: undefined };
      setProductErrors(newProductErrors);
    }
  };

  // Calculate total from products
  const calculateTotalAmount = (products: Product[]): number => {
    return products.reduce((sum, product) => {
      return sum + (product.quantity * product.price);
    }, 0);
  };

  // Add new product
  const addProduct = () => {
    setFormData(prev => ({
      ...prev,
      products: [...prev.products, { ...defaultProduct, productID: uuidv4() }]
    }));
  };

  // Remove product
  const removeProduct = (index: number) => {
    if (formData.products.length === 1) {
      return; // Keep at least one product
    }
    
    const updatedProducts = formData.products.filter((_, i) => i !== index);
    
    setFormData(prev => ({
      ...prev,
      products: updatedProducts,
      totalAmount: calculateTotalAmount(updatedProducts)
    }));
    
    // Update product errors
    const newProductErrors = { ...productErrors };
    delete newProductErrors[index];
    
    // Reindex remaining errors
    const reindexedErrors: typeof productErrors = {};
    
    Object.keys(newProductErrors).forEach(key => {
      const numKey = parseInt(key);
      if (numKey > index) {
        reindexedErrors[numKey - 1] = newProductErrors[numKey];
      } else {
        reindexedErrors[numKey] = newProductErrors[numKey];
      }
    });
    
    setProductErrors(reindexedErrors);
  };

  // Validate the form
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof OrderFormData, string>> = {};
    const newProductErrors: { [key: number]: Partial<Record<keyof Product, string>> } = {};
    
    if (!formData.orderID.trim()) {
      newErrors.orderID = 'Order ID is required';
    }
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }
    
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required';
    } else if (!validateEmail(formData.customerEmail)) {
      newErrors.customerEmail = 'Invalid email format';
    }
    
    // Validate products
    formData.products.forEach((product, index) => {
      const productError: Partial<Record<keyof Product, string>> = {};
      
      if (!product.productID.trim()) {
        productError.productID = 'Product ID is required';
      }
      
      if (!product.name.trim()) {
        productError.name = 'Product name is required';
      }
      
      if (product.quantity <1) {
        productError.quantity = 'Quantity must be at least 1';
      }
      
      if (product.price < 0) {
        productError.price = 'Price cannot be negative';
      }
      
      if (Object.keys(productError).length > 0) {
        newProductErrors[index] = productError;
      }
    });
    
    setErrors(newErrors);
    setProductErrors(newProductErrors);
    
    return Object.keys(newErrors).length === 0 && Object.keys(newProductErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
        if (typeof onSubmit === 'function') {
          onSubmit(formData); // Ensure onSubmit is a function before calling it
        } else {
          console.error("onSubmit is not defined or not a function");
        }
      }
    };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{isEdit ? 'Edit Order' : 'Create New Order'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Order ID */}
            <div className="space-y-2">
              <Label htmlFor="orderID">Order ID</Label>
              <Input
                id="orderID"
                value={formData.orderID}
                onChange={(e) => handleChange('orderID', e.target.value)}
                disabled={isEdit}
                className={errors.orderID ? 'border-red-500' : ''}
              />
              {errors.orderID && (
                <p className="text-sm text-red-500">{errors.orderID}</p>
              )}
            </div>
            
            {/* Customer Name */}
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => handleChange('customerName', e.target.value)}
                className={errors.customerName ? 'border-red-500' : ''}
              />
              {errors.customerName && (
                <p className="text-sm text-red-500">{errors.customerName}</p>
              )}
            </div>
            
            {/* Customer Email */}
            <div className="space-y-2">
              <Label htmlFor="customerEmail">Customer Email</Label>
              <Input
                id="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={(e) => handleChange('customerEmail', e.target.value)}
                className={errors.customerEmail ? 'border-red-500' : ''}
              />
              {errors.customerEmail && (
                <p className="text-sm text-red-500">{errors.customerEmail}</p>
              )}
            </div>
            
            {/* Order Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Products Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Products</h3>
            
            {formData.products.map((product, index) => (
              <div 
                key={index} 
                className="bg-slate-50 p-4 rounded-md space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Product ID */}
                  <div className="space-y-2">
                    <Label htmlFor={`product-${index}-id`}>Product ID</Label>
                    <Input
                      id={`product-${index}-id`}
                      value={product.productID}
                      onChange={(e) => handleProductChange(index, 'productID', e.target.value)}
                      className={productErrors[index]?.productID ? 'border-red-500' : ''}
                    />
                    {productErrors[index]?.productID && (
                      <p className="text-sm text-red-500">{productErrors[index]?.productID}</p>
                    )}
                  </div>
                  
                  {/* Product Name */}
                  <div className="space-y-2">
                    <Label htmlFor={`product-${index}-name`}>Product Name</Label>
                    <Input
                      id={`product-${index}-name`}
                      value={product.name}
                      onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                      className={productErrors[index]?.name ? 'border-red-500' : ''}
                    />
                    {productErrors[index]?.name && (
                      <p className="text-sm text-red-500">{productErrors[index]?.name}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  {/* Quantity */}
                  <div className="space-y-2">
                    <Label htmlFor={`product-${index}-quantity`}>Quantity</Label>
                    <Input
                      id={`product-${index}-quantity`}
                      type="number"
                      min="1"
                      value={product.quantity}
                      onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value) || 0)}
                      className={productErrors[index]?.quantity ? 'border-red-500' : ''}
                    />
                    {productErrors[index]?.quantity && (
                      <p className="text-sm text-red-500">{productErrors[index]?.quantity}</p>
                    )}
                  </div>
                  
                  {/* Price */}
                  <div className="space-y-2">
                    <Label htmlFor={`product-${index}-price`}>Price</Label>
                    <Input
                      id={`product-${index}-price`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={product.price}
                      onChange={(e) => handleProductChange(index, 'price', parseFloat(e.target.value) || 0)}
                      className={productErrors[index]?.price ? 'border-red-500' : ''}
                    />
                    {productErrors[index]?.price && (
                      <p className="text-sm text-red-500">{productErrors[index]?.price}</p>
                    )}
                  </div>
                  
                  {/* Subtotal and Remove Button */}
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex-grow">
                      <Label htmlFor={`product-${index}-subtotal`}>Subtotal</Label>
                      <Input
                        id={`product-${index}-subtotal`}
                        value={(product.price * product.quantity).toFixed(2)}
                        readOnly
                        className="bg-slate-100"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="flex-shrink-0 text-red-500 hover:text-red-700"
                      onClick={() => removeProduct(index)}
                      disabled={formData.products.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Add Product Button */}
            <Button
              type="button"
              variant="outline"
              onClick={addProduct}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
          
          {/* Total Amount */}
          <div className="md:w-1/3 space-y-2">
            <Label htmlFor="totalAmount">Total Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
              <Input
                id="totalAmount"
                value={formData.totalAmount.toFixed(2)}
                readOnly
                className="pl-6 bg-slate-100"
              />
            </div>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end mt-6">
            <Button type="submit" size= "lg" onClick={handleSubmit}>
              {isEdit ? 'Update Order' : 'Create Order'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default OrderForm;