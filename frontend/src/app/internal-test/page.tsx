// app/internal-test/page.tsx

export default async function InternalTestPage() {
  let data;
  try {
    // NEXT_PUBLIC_API_URL_SERVER は Docker Compose の内部通信用URL（例: http://backend:9000/api）を指す
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL_SERVER}/user`);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    data = await res.json();
  } catch (error: any) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Internal API Communication Test</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
