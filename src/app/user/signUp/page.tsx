import SignUp from '@/components/user/signUp';
import UserLayout from '@/components/user/userLayout';

export default function signUpPage() {
    return (
        <>
            <UserLayout>
                <SignUp></SignUp>
            </UserLayout>
        </>
    );
}
