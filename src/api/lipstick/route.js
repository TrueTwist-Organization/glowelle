export async function POST(request) {
  const formData = await request.formData()
  
  const res = await fetch(
    'https://jinalman33.app.n8n.cloud/webhook/lipstick-try-on',
    { method: 'POST', body: formData }
  )
  
  const data = await res.json()
  return Response.json(data)
}
