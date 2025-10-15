
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request) {
  try {
    const body = await request.json();
   
     const {data} = await axios.post(`${process.env.RENDER_SERVER_URL}/render`, body, {
        headers: { "Content-Type": "application/json" },
        timeout: 600000, // 10 minutes max
     })

    return NextResponse.json({ success: true, data});
  } catch (err) {
    console.error('Error rendering video:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
