import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Updating banner video:', params.id);
    
    const body = await request.json();
    const { heading, subheading, buttonText, buttonLink, youtubeUrl } = body;

    const banner = await prisma.banner.update({
      where: { id: parseInt(params.id) },
      data: {
        heading,
        subheading,
        buttonText,
        buttonLink: buttonLink || null,
        youtubeUrl,
      },
    });

    console.log('Banner updated successfully:', banner.id);
    return NextResponse.json(banner);
  } catch (error) {
    console.error('Error updating banner video:', error);
    return NextResponse.json(
      { error: 'Failed to update banner video' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Deleting banner video:', params.id);
    
    await prisma.banner.delete({
      where: { id: parseInt(params.id) },
    });

    console.log('Banner deleted successfully:', params.id);
    return NextResponse.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Error deleting banner video:', error);
    return NextResponse.json(
      { error: 'Failed to delete banner video' },
      { status: 500 }
    );
  }
}
