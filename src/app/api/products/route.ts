// app/api/products/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/lib/product';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import { buffer } from 'micro';
//import { auth } from '@/lib/auth';





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

    
    let query: any = {};
    
    if (category) query.category = category;
    if (featured) query.isFeatured = featured === 'true';
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
    let body: any;
    let imageFiles: string[] = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      body = {
        name: formData.get('name'),
        description: formData.get('description'),
        price: parseFloat(formData.get('price') as string),
        category: formData.get('category'),
        stock: parseInt(formData.get('stock') as string),
        isFeatured: formData.get('isFeatured') === 'true',
      };

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

    const count = await Product.countDocuments();
    const productID = `PROD${String(count + 1).padStart(6, '0')}`;
    
    const product = await Product.create({
      ...body,
      productID,
      images: imageFiles.length > 0 ? imageFiles : (body.images || []),
    });

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

export async function PUT(request: Request) {
  try {
    await dbConnect();
    
    const updates = await request.json();
    const operations = [];
    
    for (const update of updates) {
      let imageUrls = update.images || [];
      
      if (Array.isArray(update.images)) {
        const newImageUrls = [];
        for (const image of update.images) {
          if (typeof image === 'string' && image.startsWith('data:image')) {
            const imageUrl = await uploadToCloudinary(image);
            newImageUrls.push(imageUrl);
          } else {
            newImageUrls.push(image);
          }
        }
        imageUrls = newImageUrls;
      }
      
      operations.push({
        updateOne: {
          filter: { productID: update.productID },
          update: { 
            $set: {
              ...update,
              images: imageUrls
            } 
          }
        }
      });
    }

    const result = await Product.bulkWrite(operations);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Products PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update products' },
      { status: 500 }
    );
  }
}

// DELETE multiple products
export async function DELETE(request: Request) {
  try {
    await dbConnect();
    
    const { productIDs } = await request.json();
    
    const productsToDelete = await Product.find({ productID: { $in: productIDs } });
    
    const result = await Product.deleteMany({
      productID: { $in: productIDs }
    });
    
    for (const product of productsToDelete) {
      for (const imageUrl of product.images) {
        if (imageUrl.includes('cloudinary.com')) {
          try {
       
            const urlParts = imageUrl.split('/');
            const filenameWithExt = urlParts[urlParts.length - 1];
            const public_id = `products/${filenameWithExt.split('.')[0]}`;
            await cloudinary.uploader.destroy(public_id);
          } catch (err) {
            console.error('Failed to delete Cloudinary image:', err);
          }
        }
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Products DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete products' },
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