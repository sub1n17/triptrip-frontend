'use client';

import {
    ApolloClient,
    ApolloLink,
    ApolloProvider,
    fromPromise,
    InMemoryCache,
} from '@apollo/client';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { useTokenStore } from '../stores/token';
import { useEffect } from 'react';
import { onError } from '@apollo/client/link/error';
import { getAccessToken } from '../libraries/getAccessToken';
import { useLoadStore } from '../stores/load';

interface IApolloSetting {
    children: React.ReactNode;
}

// const global_cache = new InMemoryCache();
const global_cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                fetchTravelproducts: {
                    keyArgs: ['isSoldout', 'search'],
                    merge(existing, incoming) {
                        return incoming;
                    },
                },
            },
        },
    },
});
// => “자동 누적 안 할게, 서버 응답 그대로 쓸게”
// keyArgs : isSoldout, search가 다르면 서로 다른 캐시로 분리됨
// merge() { return incoming } : 새 요청 오면 이전 결과 덮어씀

export default function ApolloSetting(props: IApolloSetting) {
    const { accessToken, setAccessToken } = useTokenStore();
    const { isLoaded, setIsLoaded } = useLoadStore();

    // 새로고침했을 때 토큰 유지시키기
    useEffect(() => {
        getAccessToken()
            .then((newAccessToken) => {
                if (newAccessToken) setAccessToken(newAccessToken);
            })
            .finally(() => setIsLoaded());
    }, []);

    // 토큰 재발급 끝날 때까지 렌더링 자체를 막음
    if (!isLoaded) return null;

    // 사진 업로드
    const uploadLink = createUploadLink({
        uri: 'https://main-practice.codebootcamp.co.kr/graphql',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        credentials: 'include',
    });

    // 토큰 만료 감지
    const errorLink = onError(({ graphQLErrors, operation, forward }) => {
        if (typeof graphQLErrors !== 'undefined') {
            for (const err of graphQLErrors) {
                if (err.extensions?.code === 'UNAUTHENTICATED') {
                    return fromPromise(
                        getAccessToken().then((newAccessToken) => {
                            setAccessToken(newAccessToken);

                            operation.setContext({
                                headers: {
                                    ...operation.getContext().headers,
                                    Authorization: `Bearer ${newAccessToken}`,
                                },
                                credentials: 'include',
                            });
                        }),
                    ).flatMap(() => forward(operation));
                }
            }
        }
    });

    const client = new ApolloClient({
        link: ApolloLink.from([errorLink, uploadLink]),
        // cache: new InMemoryCache(),
        cache: global_cache,
    });

    return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
}
