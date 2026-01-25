'use client';

import { firebaseApp } from '@/commons/libraries/firebase';
import ApiWrite from '@/components/myapis-write';
import { collection, doc, getDoc, getFirestore } from 'firebase/firestore/lite';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MyApiEditPage() {
    const params = useParams();
    const id = String(params.myapiId);

    const [data, setData] = useState({});

    useEffect(() => {
        async function aaa() {
            const myAPI = collection(getFirestore(firebaseApp), 'myAPI');
            const fetchData = await getDoc(doc(myAPI, id));
            console.log(fetchData.data());

            setData(fetchData.data() || {});
        }
        aaa();
    }, [id]);

    return (
        <>
            <ApiWrite isEdit={true} data={data}></ApiWrite>
        </>
    );
}
