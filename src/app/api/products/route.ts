// app/api/products/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/lib/product';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { buffer } from 'micro';
//import { auth } from '@/lib/auth';


cloudinary.config({
  cloud_name:"do9w0lwh2",
  api_key: "726923492364645",
  api_secret: "oLnfYutUR5lUrhQ0MVJ6fwj3Pa0"
});


async function uploadToCloudinary(base64Image: string) {
  try {
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: 'products',
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
}


async function uploadBufferToCloudinary(buffer: Buffer, mimeType: string) {
  try {
    const base64Image = `data:${mimeType};base64,${buffer.toString('base64')}`;
    return await uploadToCloudinary(base64Image);
  } catch (error) {
    console.error('Buffer upload error:', error);
    throw new Error('Failed to process image buffer');
  }
}

export async function GET(request: Request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const size = searchParams.get('size');

    
    let query: any = {};
    
    if (category) query.category = category;
    if (featured) query.isFeatured = featured === 'true';
    if (size) query.size = size;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const products = await Product.find(query)
      
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(query);

    return NextResponse.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error('Products GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();

    const contentType = request.headers.get('content-type') || '';
    let body: any = {};
    let imageFiles: string[] = [];
    let sizesArray: string[] = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      console.log("📩 Received formData:", formData);

      // Parse size field separately
      let sizeField = formData.get('size');
      if (typeof sizeField === "string") {
        try {
          sizesArray = JSON.parse(sizeField);
          console.log("✅ Successfully parsed size field:", sizesArray);
        } catch (error) {
          console.error("🚨 Failed to parse size field:", error);
          sizesArray = [];
        }
      }

      // Build basic body object
      body = {
        name: formData.get('name'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price') as string),
        category: formData.get('category'),
        stock: parseInt(formData.get('stock') as string),
        isFeatured: formData.get('isFeatured') === 'true',
        sizes: sizesArray // Use 'sizes' here instead of 'size'
      };
     
      console.log("📝 Basic body:", body);
    
      const files = formData.getAll('images') as File[];
    
      if (files && files.length > 0) {
        for (const file of files) {
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const imageUrl = await uploadBufferToCloudinary(buffer, file.type);
          imageFiles.push(imageUrl);
        }
      }
    } else {
      body = await request.json();
      
      if (body.size && typeof body.size === 'string') {
        try {
          sizesArray = JSON.parse(body.size);
          body.sizes = sizesArray; // Use 'sizes' here
          delete body.size; // Remove 'size' to prevent conflict
          console.log("✅ Successfully parsed size field from JSON body:", sizesArray);
        } catch (error) {
          console.error("🚨 Failed to parse size field in JSON body:", error);
          body.sizes = []; // Use 'sizes' here
        }
      } else if (body.size && Array.isArray(body.size)) {
        body.sizes = body.size; // Convert 'size' to 'sizes'
        delete body.size;
      }
      
      if (body.images && Array.isArray(body.images)) {
        for (const image of body.images) {
          if (typeof image === 'string' && image.startsWith('data:image')) {
            const imageUrl = await uploadToCloudinary(image);
            imageFiles.push(imageUrl);
          } else if (typeof image === 'string') {
            imageFiles.push(image);
          }
        }
      }
    }

    console.log("📏 Sizes array:", sizesArray);

    const count = await Product.countDocuments();
    const productID = `PROD${String(count + 1).padStart(6, '0')}`;
    
    // Create the product data
    console.log("Sizesa: ", sizesArray)
    const productData = {
      ...body,
      productID,
      images: imageFiles.length > 0 ? imageFiles : (body.images || []),
      sizes: sizesArray // Use 'sizes' here
    };
    
    console.log("📦 Product data being saved:", productData);
    
    // Save the product
    const product = await Product.create(productData);
    
    console.log("✅ Product after save:", product);

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Products POST error:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Product with this ID already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create product', details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    await dbConnect();
    
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }
    
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const imageUrl = await uploadBufferToCloudinary(buffer, file.type);
    
    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}