/** 숫자를 배열로 변경 123 = > [1, 2, 3] */
export function NumToArray(num) {
    const numStr = num.toString();
    const result = numStr.split('').map(Number);

    return result
}

/** 특정 길이만큼 배열에 빈칸 추가  ([5,4,2], 5)  => [5,4,2,"",""] */
export function FillBlankArray(array, length, isReversePush = false) {
    let addNum = length - array.length

    for(let i = 0; i < addNum; i++) {
        if (isReversePush) {
            array.unshift("")
        }
        else {
            array.push("")
        }
    }

    return array
} 

/** 맨 앞에 있는 요소를 맨 뒤로 [1, 2, 3] => [2, 3, 1]*/
export function PushFirstArray(array, index) {
    const element = array.splice(index, 1)[0];
    array.push(element);

    return array
}