import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }

    console.log('📥 Original URL:', url);

    // Extract public ID from Cloudinary URL
    const match = url.match(/\/v\d+\/(.+)\.(pdf|png|jpg|jpeg)$/);
    const publicId = match ? match[1] : null;

    if (!publicId) {
      console.error('❌ Could not extract public ID from URL');
      return NextResponse.json({ error: 'Invalid Cloudinary URL' }, { status: 400 });
    }

    // Construct direct download URL with fl_attachment flag
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'dnycwq6ad';
    const directUrl = `https://res.cloudinary.com/${cloudName}/image/upload/fl_attachment/${publicId}.pdf`;
    
    console.log('🔗 Direct download URL:', directUrl);

    // For now, return HTML that forces download/view
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>PDF Viewer</title>
  <style>
    body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; }
    iframe { width: 100%; height: 100%; border: none; }
    .error { 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      height: 100vh; 
      font-family: system-ui;
      text-align: center;
      padding: 20px;
    }
    .download-btn {
      display: inline-block;
      padding: 12px 24px;
      background: #0d447a;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      margin-top: 20px;
      font-weight: 600;
    }
    .download-btn:hover {
      background: #5dba47;
    }
  </style>
</head>
<body>
  <div class="error">
    <div>
      <h3>📄 PDF Document</h3>
      <p>This PDF cannot be displayed in the browser.</p>
      <a href="${directUrl}" class="download-btn" download>
        Download PDF
      </a>
    </div>
  </div>
</body>
</html>
    `;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    });

  } catch (error) {
    console.error('❌ PDF proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
