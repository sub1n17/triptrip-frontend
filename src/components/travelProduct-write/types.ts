import { FetchTravelproductQuery } from '@/commons/graphql/graphql';

// ITravelProductWrite<T> => 이 interface는 T라는 제네릭 타입을 받을 수 있는 타입이야 라고 알려줌
export interface ITravelProductWrite<T extends FetchTravelproductQuery> {
    isEdit: boolean;
    data?: T;
}
