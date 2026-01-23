import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export async function GET() {
  try {
    console.log('🧪 Testing Cloudinary connection...');
    
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Test Cloudinary connection with a simple operation
    const result = await cloudinary.api.ping();
    
    console.log('✅ Cloudinary connection test successful:', result);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Cloudinary connection successful',
      result 
    });
    
  } catch (error) {
    console.error('❌ Cloudinary connection test failed:', error);
    
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error 
    }, { status: 500 });
  }
}
