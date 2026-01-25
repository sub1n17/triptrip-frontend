// 'use client';

import LogIn from '@/components/user/logIn';
import UserLayout from '@/components/user/userLayout';

export default function logInPage() {
    return (
        <>
            <UserLayout>
                <LogIn></LogIn>
            </UserLayout>
        </>
    );
}
