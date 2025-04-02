'use client';
import { useEffect } from "react";



export default function Home() {
  useEffect(() => {
    const fetchUser = async () => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        const userData = await response.json();
        console.log('User data:', userData);
    };
  
  fetchUser();
}, []);

}
