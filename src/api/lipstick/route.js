export async function POST(request) {
  try {
    const formData = await request.formData();
    
    console.log("API Route: Sending request to n8n webhook...");
    
    const res = await fetch(
      'https://jinalman33.app.n8n.cloud/webhook/lipstick-try-on',
      { 
        method: 'POST', 
        body: formData,
        // Optional: add a timeout if needed, but n8n can be slow
      }
    );
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`API Route: Webhook failed with status ${res.status}:`, errorText);
      return Response.json({ error: "Webhook failed", details: errorText }, { status: res.status });
    }
    
    const data = await res.json();
    console.log("API Route: Received response from n8n:", data);
    return Response.json(data);
  } catch (error) {
    console.error("API Route Error:", error);
    return Response.json({ error: "Internal Server Error", message: error.message }, { status: 500 });
  }
}
