import { User } from '@/types/User';
import { useState, useEffect } from 'react';

export function useAuth() {
    const [user, setUser] = useState<User>();
    const [loading, setLoading] = useState(true);
    const [trigger, setTrigger] = useState(false);

    useEffect(() => {
        // Check if JWT token is present in localStorage
        const token = localStorage.getItem('token');

        if (token) {
            // If token is present, send a request to the server to get user data
            fetch('http://localhost:5023/auth/fetch', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Network response was not ok.');
                })
                .then(data => {
                    setUser(data.response);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                    setLoading(false);
                });
        } else {
            // No token found, mark loading as false
            setLoading(false);
        }
    }, [trigger]); // Empty dependency array ensures the effect runs once after initial render

    function manualTriggerAuth() {
        setTrigger(prevState => !prevState);
    }

    return { user, loading, manualTriggerAuth };
}
