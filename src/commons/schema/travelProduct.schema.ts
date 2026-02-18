import { z } from 'zod';

// 스키마에서 지정한 타입을 data(zod 검증을 통과한 값들)의 타입으로 지정함
export type FormData = z.infer<typeof schema>;

export const schema = z.object({
    name: z.string().min(1, { message: '상품명을 입력해주세요' }),
    remarks: z.string().min(1, { message: '한줄 요약을 입력해주세요' }),
    contents: z.string().min(1, { message: '상품 설명을 입력해주세요' }),

    price: z.preprocess(
        (val) => Number(String(val).replace(/[^0-9]/g, '')),
        z
            .number()
            .int()
            .min(1, { message: '판매 가격을 입력해주세요' })
            .max(10_000_000, { message: '가격은 최대 1천만 원까지 입력 가능합니다.' }),
    ),
    tags: z.string().optional(),
    travelproductAddress: z.object({
        zipcode: z.string().min(1, { message: '우편번호를 입력해주세요.' }),
        address: z.string().optional(),
        addressDetail: z.string().optional(),
        lat: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().optional()), // 처음엔 값이 없다가 값이 들어오면 타입은 숫자(defaultValue에 undefined로 두면 placeholder 안 보임)
        lng: z.preprocess((val) => (val === '' ? undefined : Number(val)), z.number().optional()),
    }),
});
