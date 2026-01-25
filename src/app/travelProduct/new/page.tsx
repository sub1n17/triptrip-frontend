'use client';

import { withLoginCheck } from '@/commons/hocs/withLoginCheck';
import TravelProductWrite from '@/components/travelProduct-write';

function TravelProductWritePage() {
    return (
        <>
            <TravelProductWrite isEdit={false}></TravelProductWrite>
        </>
    );
}
export default withLoginCheck(TravelProductWritePage);
