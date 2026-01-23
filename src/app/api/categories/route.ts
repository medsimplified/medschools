import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const categories = await prisma.course.findMany({
      select: { category: true },
      distinct: ['category'],
    });
    
    const uniqueCategories = categories.map(c => c.category).filter(Boolean);
    
    return NextResponse.json(uniqueCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { icon, title, total, order } = body;

    const category = await prisma.category.create({
      data: {
        icon,
        title,
        total,
        order: order || 0,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
